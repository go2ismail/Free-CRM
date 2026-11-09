import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.CRM_BASE_URL ?? 'http://localhost:5055';

export default defineConfig({
  testDir: '.',
  outputDir: 'test-results',
  timeout: 180_000,
  expect: {
    timeout: 20_000,
  },
  globalSetup: require.resolve('./global-setup'),
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: !!process.env.CI,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
  },
  projects: [
    {
      name: 'setup',
      testMatch: /tests[\\/]setup[\\/]auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testMatch: /tests[\\/]api[\\/].*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'ui',
      testMatch: /tests[\\/]ui[\\/].*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/admin.json',
      },
    },
  ],
});
