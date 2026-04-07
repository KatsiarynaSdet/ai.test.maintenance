import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for TypeScript tests
 * Configured to run on Chromium only
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 3 : 3,
  reporter: 'html',
  use: {
    baseURL: 'https://playwright.dev',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['desktop'] },
    },
  ],

  webServer: undefined,
});
