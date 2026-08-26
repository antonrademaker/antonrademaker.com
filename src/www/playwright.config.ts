import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:1313',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'mobile-webkit',
      use: { ...devices['iPhone 13'] }
    }
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:1313',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
});