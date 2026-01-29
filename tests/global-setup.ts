import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Global setup starting...');
  
  // Possible global setup can be added here:
  // - Starting a test server
  // - Seeding test data
  // - Checking environment variables
  
  const { baseURL } = config.projects[0].use;
  if (baseURL) {
    console.log(`✓ Base URL configured: ${baseURL}`);
  }
  
  console.log('✓ Global setup complete');
}

export default globalSetup;
