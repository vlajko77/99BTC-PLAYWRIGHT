import { BrowserContext } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

export class SessionManager {
  private static readonly STORAGE_DIR = path.join(process.cwd(), ".auth");
  private static readonly SESSION_EXPIRY_HOURS = 24;

  static getStoragePath(username: string): string {
    if (!fs.existsSync(SessionManager.STORAGE_DIR)) {
      fs.mkdirSync(SessionManager.STORAGE_DIR, { recursive: true });
    }
    return path.join(SessionManager.STORAGE_DIR, `${username}-session.json`);
  }

  static async loadSession(
    context: BrowserContext,
    username: string,
  ): Promise<boolean> {
    const storagePath = SessionManager.getStoragePath(username);

    if (!fs.existsSync(storagePath)) {
      return false;
    }

    try {
      const storageState = JSON.parse(fs.readFileSync(storagePath, "utf-8"));

      const stats = fs.statSync(storagePath);
      const ageInHours = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);
      if (ageInHours > SessionManager.SESSION_EXPIRY_HOURS) {
        fs.unlinkSync(storagePath);
        return false;
      }

      await context.addCookies(storageState.cookies || []);
      return true;
    } catch {
      return false;
    }
  }

  static async saveSession(
    context: BrowserContext,
    username: string,
  ): Promise<void> {
    const storagePath = SessionManager.getStoragePath(username);
    const storageState = await context.storageState();
    fs.writeFileSync(storagePath, JSON.stringify(storageState, null, 2));
  }

  static clearSession(username: string): void {
    const storagePath = SessionManager.getStoragePath(username);
    if (fs.existsSync(storagePath)) {
      fs.unlinkSync(storagePath);
    }
  }

  static clearAllSessions(): void {
    if (fs.existsSync(SessionManager.STORAGE_DIR)) {
      const files = fs.readdirSync(SessionManager.STORAGE_DIR);
      for (const file of files) {
        if (file.endsWith("-session.json")) {
          fs.unlinkSync(path.join(SessionManager.STORAGE_DIR, file));
        }
      }
    }
  }
}
