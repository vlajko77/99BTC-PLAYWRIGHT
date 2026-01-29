import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Global teardown starting...');
  
  // Possible global teardown can be added here:
  // - Stopping test servers
  // - Cleaning up test data
  // - Removing temporary files
  
  console.log('✓ Global teardown complete');
}

export default globalTeardown;
