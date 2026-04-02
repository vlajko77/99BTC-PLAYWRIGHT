import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";
import { SessionManager } from "../../utils/SessionManager";

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly userGreeting: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByRole("textbox", {
      name: "Username or Email Address",
    });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Log In" });
    this.userGreeting = page.getByText(/Howdy\s*,?/i).first();
  }

  async goto() {
    await this.page.goto("/wp-login.php");
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithSession(username: string, password: string): Promise<void> {
    // Check if valid session exists
    if (await SessionManager.loadSession(this.page.context(), username)) {
      // Verify session is still valid
      await this.page.goto("/wp-admin/");
      if (await this.isLoggedIn()) {
        return;
      }
    }

    // No valid session, perform fresh login
    await this.goto();
    await this.login(username, password);
    await this.verifyLoginSuccess();

    // Save session for future use
    await SessionManager.saveSession(this.page.context(), username);
  }

  private async isLoggedIn(): Promise<boolean> {
    try {
      await this.userGreeting.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async verifyLoginSuccess() {
    await expect(this.userGreeting).toBeVisible({ timeout: 30000 });
  }

  async verifyLoginFailure(errorMessage?: string) {
    const error = this.page.locator("#login_error");
    await expect(error).toBeVisible();
    if (errorMessage) {
      await expect(error).toContainText(errorMessage);
    }
  }

  async clearSession(username: string): Promise<void> {
    SessionManager.clearSession(username);
  }

  static clearAllSessions(): void {
    SessionManager.clearAllSessions();
  }
}
