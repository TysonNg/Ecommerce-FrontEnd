import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/browser',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:3100', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }],
  webServer: { command: 'npm run start -- --port 3100 --hostname 127.0.0.1', env: { NEXT_BUILD_DIR: '.next-admin-test' }, url: 'http://127.0.0.1:3100/admin', reuseExistingServer: false, timeout: 90000 },
});
