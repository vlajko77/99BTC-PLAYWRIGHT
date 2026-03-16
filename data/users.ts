// WordPress admin credentials
export const adminUser = {
  username: process.env.WP_USERNAME || "user@example.com",
  password: process.env.WP_PASSWORD || "REDACTED",
};

// Site URLs
export const urls = {
  local: process.env.PLAYWRIGHT_BASE_URL || "https://99bitcoins.local",
  staging:
    process.env.STAGING_URL || "https://staging:staging@staging.99bitcoins.com/",
};
