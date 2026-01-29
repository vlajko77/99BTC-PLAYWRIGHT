// Login credentials
// For CI/CD: Set WP_USERNAME and WP_PASSWORD environment variables
// For local dev: Falls back to default test account
export const WP_USERNAME = process.env.WP_USERNAME || 'user@example.com';
export const WP_PASSWORD = process.env.WP_PASSWORD || 'REDACTED';

// URLs
export const STAGING_URL = process.env.STAGING_URL || 'https://staging:staging@staging.99bitcoins.com/';
