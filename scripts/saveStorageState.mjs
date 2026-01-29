#!/usr/bin/env node
// Save Playwright storage state after manual login (headed).
// Usage: node scripts/saveStorageState.mjs

import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const outDir = path.resolve(process.cwd(), 'auth');
const outFile = path.join(outDir, 'storageState.json');

async function run() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('Launching headed browser. Complete the Cloudflare challenge and log in, then press ENTER.');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const url = process.env.STAGING_WP_LOGIN_URL || 'https://staging.99bitcoins.com/wp-login.php';
  await page.goto(url);

  // Wait for the user to complete manual steps
  await waitForEnter();

  await context.storageState({ path: outFile });
  console.log('Storage state saved to', outFile);
  await browser.close();
}

function waitForEnter() {
  return new Promise((resolve) => {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', () => {
      process.stdin.pause();
      resolve();
    });
  });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
