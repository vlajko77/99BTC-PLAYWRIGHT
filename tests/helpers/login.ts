import { Page, Locator, expect } from '@playwright/test';

// Login credentials
export const WP_USERNAME = process.env.WP_USERNAME || 'user@example.com';
export const WP_PASSWORD = process.env.WP_PASSWORD || 'REDACTED';

// Function to perform login
export async function login(page: Page, username?: string, password?: string) {
  const user = username ?? WP_USERNAME;
  const pass = password ?? WP_PASSWORD;

  await page.waitForSelector('input#user_login', { state: 'visible', timeout: 5000 });
  await page.fill('input#user_login', user);
  await page.fill('input#user_pass', pass);
}

