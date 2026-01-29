import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import * as fs from 'fs';
import * as path from 'path';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly userGreeting: Locator;
  private static readonly STORAGE_DIR = path.join(process.cwd(), '.auth');

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByRole('textbox', { name: 'Username or Email Address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.userGreeting = page.getByText(/Howdy\s*,?/i).first();
  }

  private getStoragePath(username: string): string {
    // Ensure .auth directory exists
    if (!fs.existsSync(LoginPage.STORAGE_DIR)) {
      fs.mkdirSync(LoginPage.STORAGE_DIR, { recursive: true });
    }
    return path.join(LoginPage.STORAGE_DIR, `${username}-session.json`);
  }

  async goto() {
    await this.page.goto('https://99bitcoins.local/wp-login.php');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithSession(username: string, password: string): Promise<void> {
    const storagePath = this.getStoragePath(username);

    // Check if valid session exists
    if (await this.loadSession(storagePath)) {
      // Verify session is still valid
      await this.page.goto('https://99bitcoins.local/wp-admin/');
      if (await this.isLoggedIn()) {
        return;
      }
    }

    // No valid session, perform fresh login
    await this.goto();
    await this.login(username, password);
    await this.verifyLoginSuccess();

    // Save session for future use
    await this.saveSession(storagePath);
  }

  private async loadSession(storagePath: string): Promise<boolean> {
    if (!fs.existsSync(storagePath)) {
      return false;
    }

    try {
      const storageState = JSON.parse(fs.readFileSync(storagePath, 'utf-8'));

      // Check if session file is older than 24 hours
      const stats = fs.statSync(storagePath);
      const ageInHours = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);
      if (ageInHours > 24) {
        fs.unlinkSync(storagePath);
        return false;
      }

      // Load cookies into context
      await this.page.context().addCookies(storageState.cookies || []);
      return true;
    } catch {
      return false;
    }
  }

  private async saveSession(storagePath: string): Promise<void> {
    const storageState = await this.page.context().storageState();
    fs.writeFileSync(storagePath, JSON.stringify(storageState, null, 2));
  }

  private async isLoggedIn(): Promise<boolean> {
    try {
      await this.userGreeting.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async verifyLoginSuccess() {
    await expect(this.userGreeting).toBeVisible({ timeout: 8000 });
  }

  async verifyLoginFailure(errorMessage?: string) {
    const error = this.page.locator('#login_error');
    await expect(error).toBeVisible();
    if (errorMessage) {
      await expect(error).toContainText(errorMessage);
    }
  }

  async clearSession(username: string): Promise<void> {
    const storagePath = this.getStoragePath(username);
    if (fs.existsSync(storagePath)) {
      fs.unlinkSync(storagePath);
    }
  }

  static async clearAllSessions(): Promise<void> {
    if (fs.existsSync(LoginPage.STORAGE_DIR)) {
      const files = fs.readdirSync(LoginPage.STORAGE_DIR);
      for (const file of files) {
        if (file.endsWith('-session.json')) {
          fs.unlinkSync(path.join(LoginPage.STORAGE_DIR, file));
        }
      }
    }
  }
}
