// Login credentials
if (!process.env.WP_USERNAME || !process.env.WP_PASSWORD) {
  throw new Error("WP_USERNAME and WP_PASSWORD environment variables must be set");
}

export const WP_USERNAME = process.env.WP_USERNAME;
export const WP_PASSWORD = process.env.WP_PASSWORD;

// URLs
export const STAGING_URL =
  process.env.STAGING_URL || "https://staging.99bitcoins.com/";
