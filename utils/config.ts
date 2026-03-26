export const BASE_URL =
  process.env.PLAYWRIGHT_BASE_URL || "https://99bitcoins.local";

export const stagingHttpCredentials =
  process.env.STAGING_HTTP_USER && process.env.STAGING_HTTP_PASS
    ? {
        httpCredentials: {
          username: process.env.STAGING_HTTP_USER,
          password: process.env.STAGING_HTTP_PASS,
        },
      }
    : {};
