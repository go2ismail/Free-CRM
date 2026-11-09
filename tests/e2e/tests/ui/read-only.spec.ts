import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('dashboard cards and charts render', async ({ page }) => {
  const responses = [
    'GetCardsDashboard',
    'GetSalesDashboard',
    'GetPurchaseDashboard',
    'GetCRMDashboard',
    'GetLeadPipelineFunnel',
    'GetSalesTeamLeadClosing',
    'GetCampaignByStatus',
    'GetLeadActivityByType',
  ].map((endpoint) =>
    page.waitForResponse(
      (response) => response.request().method() === 'GET' && response.url().includes(`/api/Dashboard/${endpoint}`),
      { timeout: 60_000 },
    ),
  );

  await page.goto('/Dashboards/DefaultDashboard', { waitUntil: 'domcontentloaded' });
  for (const response of responses) {
    const result = await response;
    expect(result.status(), 'Dashboard endpoint should return HTTP 200').toBe(200);
  }

  await page.waitForFunction(() => !document.querySelector('#app')?.hasAttribute('v-cloak'));
  await expect(page.locator('.card').first()).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('.display-4').first()).not.toBeEmpty({ timeout: 30_000 });
  await expect(page.locator('.e-chart').first()).toBeVisible({ timeout: 30_000 });
});

test('sales report shows data and exports to Excel', async ({ page }) => {
  const listResponse = page.waitForResponse(
    (response) =>
      response.request().method() === 'GET' &&
      response.url().includes('/api/SalesOrderItem/GetSalesOrderItemList'),
    { timeout: 60_000 },
  );

  await page.goto('/SalesReports/SalesReportList', { waitUntil: 'domcontentloaded' });
  await listResponse;
  await page.waitForFunction(() => !document.querySelector('#app')?.hasAttribute('v-cloak'));

  const grid = page.locator('.e-grid').first();
  await expect(grid.locator('.e-gridheader')).toBeVisible({ timeout: 30_000 });
  await expect(grid.locator('.e-row').first()).toBeVisible({ timeout: 30_000 });

  const downloadPromise = page.waitForEvent('download', { timeout: 60_000 });
  await page.evaluate(() => {
    const grid = (
      document.querySelector('.e-grid') as unknown as {
        ej2_instances?: Array<{ excelExport?: () => void }>;
      }
    )?.ej2_instances?.[0];
    grid?.excelExport?.();
  });
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.xlsx$/i);
});

test('purchase report shows data', async ({ page }) => {
  const listResponse = page.waitForResponse(
    (response) =>
      response.request().method() === 'GET' &&
      response.url().includes('/api/PurchaseOrderItem/GetPurchaseOrderItemList'),
    { timeout: 60_000 },
  );

  await page.goto('/PurchaseReports/PurchaseReportList', { waitUntil: 'domcontentloaded' });
  await listResponse;
  await page.waitForFunction(() => !document.querySelector('#app')?.hasAttribute('v-cloak'));
  const grid = page.locator('.e-grid').first();
  await expect(grid.locator('.e-gridheader')).toBeVisible({ timeout: 30_000 });
  await expect(grid.locator('.e-row').first()).toBeVisible({ timeout: 30_000 });
});

test('roles list renders the seeded roles', async ({ page }) => {
  const listResponse = page.waitForResponse(
    (response) => response.request().method() === 'GET' && response.url().includes('/api/Security/GetRoleList'),
    { timeout: 60_000 },
  );
  await page.goto('/Roles/RoleList', { waitUntil: 'domcontentloaded' });
  await listResponse;
  await page.waitForFunction(() => !document.querySelector('#app')?.hasAttribute('v-cloak'));
  const grid = page.locator('.e-grid').first();
  await expect(grid.locator('.e-gridheader')).toBeVisible({ timeout: 30_000 });
  await expect(grid.locator('.e-row').first()).toBeVisible({ timeout: 30_000 });
});

test('number sequences list renders the seeded sequences', async ({ page }) => {
  const listResponse = page.waitForResponse(
    (response) =>
      response.request().method() === 'GET' &&
      response.url().includes('/api/NumberSequence/GetNumberSequenceList'),
    { timeout: 60_000 },
  );
  await page.goto('/NumberSequences/NumberSequenceList', { waitUntil: 'domcontentloaded' });
  await listResponse;
  await page.waitForFunction(() => !document.querySelector('#app')?.hasAttribute('v-cloak'));
  const grid = page.locator('.e-grid').first();
  await expect(grid.locator('.e-gridheader')).toBeVisible({ timeout: 30_000 });
  await expect(grid.locator('.e-row').first()).toBeVisible({ timeout: 30_000 });
});
