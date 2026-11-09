import { expect, test } from '@playwright/test';
import { MODULES } from '../../fixtures/modules';

type RouteDefinition = {
  name: string;
  route: string;
  listResponse?: string;
  checkGrid?: boolean;
};

const ROUTES: RouteDefinition[] = [
  ...MODULES.map((module) => ({
    name: module.name,
    route: module.route,
    listResponse: `/api/${module.controller}/${module.listAction}`,
    checkGrid: true,
  })),
  {
    name: 'Sales Report',
    route: '/SalesReports/SalesReportList',
    listResponse: '/api/SalesOrderItem/GetSalesOrderItemList',
    checkGrid: true,
  },
  {
    name: 'Purchase Report',
    route: '/PurchaseReports/PurchaseReportList',
    listResponse: '/api/PurchaseOrderItem/GetPurchaseOrderItemList',
    checkGrid: true,
  },
  {
    name: 'Roles',
    route: '/Roles/RoleList',
    listResponse: '/api/Security/GetRoleList',
    checkGrid: true,
  },
  {
    name: 'Number Sequences',
    route: '/NumberSequences/NumberSequenceList',
    listResponse: '/api/NumberSequence/GetNumberSequenceList',
    checkGrid: true,
  },
  {
    name: 'Default Dashboard',
    route: '/Dashboards/DefaultDashboard',
    listResponse: '/api/Dashboard/GetCardsDashboard',
    checkGrid: false,
  },
];

test('every application page loads without script errors', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(String(error)));

  for (const definition of ROUTES) {
    const responsePromise = definition.listResponse
      ? page.waitForResponse(
          (response) =>
            response.request().method() === 'GET' &&
            response.url().includes(definition.listResponse as string),
          { timeout: 60_000 },
        )
      : Promise.resolve(null);

    const navigation = await page.goto(definition.route, { waitUntil: 'domcontentloaded' });
    expect(navigation?.status(), `${definition.name} should return HTTP 200`).toBe(200);
    await responsePromise;
    await page.waitForFunction(() => Boolean(document.querySelector('#app')) && !document.querySelector('#app')?.hasAttribute('v-cloak'));

    if (definition.checkGrid) {
      await expect(
        page.locator('.e-grid .e-gridheader').first(),
        `${definition.name} should render a Syncfusion grid`,
      ).toBeVisible({ timeout: 60_000 });
    } else {
      await expect(page.locator('.card').first(), `${definition.name} should render dashboard cards`).toBeVisible({
        timeout: 60_000,
      });
    }
  }

  expect(pageErrors, `Unexpected page errors: ${pageErrors.join('\n')}`).toEqual([]);
});

test('the public landing page links to the login page', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('a[href="/Accounts/Login"]').first()).toBeVisible();
});

test('the sidebar navigation opens a page from the menu', async ({ page }) => {
  await page.goto('/Profiles/MyProfile');
  await page.waitForFunction(() => !document.querySelector('#app')?.hasAttribute('v-cloak'));

  await page.evaluate(() => {
    const treeView = (
      document.querySelector('#mainMenu') as unknown as {
        ej2_instances?: Array<{ expandAll?: () => void }>;
      }
    )?.ej2_instances?.[0];
    treeView?.expandAll?.();
  });

  const menuLink = page.locator('#mainMenu a[href="/CustomerGroups/CustomerGroupList"]').first();
  await expect(menuLink).toBeVisible({ timeout: 30_000 });
  await menuLink.click();
  await page.waitForURL('**/CustomerGroups/CustomerGroupList', { timeout: 30_000 });
  await expect(page.locator('.e-grid .e-gridheader').first()).toBeVisible({ timeout: 60_000 });
});
