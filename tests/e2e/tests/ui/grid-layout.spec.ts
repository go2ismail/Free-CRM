import { expect, test, type Page } from '@playwright/test';
import { MODULES } from '../../fixtures/modules';

test.describe.configure({ mode: 'serial' });

type ListRoute = {
  name: string;
  route: string;
};

const LIST_ROUTES: ListRoute[] = [
  ...MODULES.map((module) => ({ name: module.name, route: module.route })),
  { name: 'Sales Report', route: '/SalesReports/SalesReportList' },
  { name: 'Purchase Report', route: '/PurchaseReports/PurchaseReportList' },
  { name: 'Roles', route: '/Roles/RoleList' },
  { name: 'Number Sequences', route: '/NumberSequences/NumberSequenceList' },
];

type Rect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type Padding = {
  top: string;
  right: string;
  bottom: string;
  left: string;
};

type LayoutMetrics = {
  padding: Padding;
  wrapper: Rect;
  grid: Rect & { height: number };
  footerTop: number;
  scrollHeight: number;
  clientHeight: number;
  scrollWidth: number;
  clientWidth: number;
};

async function openList(page: Page, route: string): Promise<void> {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    () => Boolean(document.querySelector('#app')) && !document.querySelector('#app')?.hasAttribute('v-cloak'),
  );
  await expect(page.locator('.e-grid .e-gridheader').first()).toBeVisible({ timeout: 60_000 });
  await page.waitForFunction(
    () => {
      const grid = document.querySelector('.e-grid');
      return grid !== null && grid.getBoundingClientRect().height > 400;
    },
    undefined,
    { timeout: 30_000 },
  );
  await page.waitForTimeout(200);
}

async function measureLayout(page: Page): Promise<LayoutMetrics> {
  return page.evaluate(() => {
    const wrapper = document.querySelector('.content-wrapper') as HTMLElement;
    const grid = document.querySelector('.e-grid') as HTMLElement;
    const footer = document.querySelector('.main-footer') as HTMLElement;
    const style = getComputedStyle(wrapper);
    const wrapperRect = wrapper.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();
    const doc = document.documentElement;
    const toRect = (rect: DOMRect) => ({ top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left });

    return {
      padding: {
        top: style.paddingTop,
        right: style.paddingRight,
        bottom: style.paddingBottom,
        left: style.paddingLeft,
      },
      wrapper: toRect(wrapperRect),
      grid: { ...toRect(gridRect), height: gridRect.height },
      footerTop: footerRect.top,
      scrollHeight: doc.scrollHeight,
      clientHeight: doc.clientHeight,
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
    };
  });
}

function expectFullBleed(metrics: LayoutMetrics, label: string): void {
  expect(metrics.padding.top, `${label}: content wrapper top padding`).toBe('0px');
  expect(metrics.padding.right, `${label}: content wrapper right padding`).toBe('0px');
  expect(metrics.padding.bottom, `${label}: content wrapper bottom padding`).toBe('0px');
  expect(metrics.padding.left, `${label}: content wrapper left padding`).toBe('0px');
  expect(
    Math.abs(metrics.grid.top - metrics.wrapper.top),
    `${label}: grid top should be flush with the content wrapper top`,
  ).toBeLessThanOrEqual(2);
  expect(
    Math.abs(metrics.grid.left - metrics.wrapper.left),
    `${label}: grid left should be flush with the content wrapper left`,
  ).toBeLessThanOrEqual(2);
  expect(
    Math.abs(metrics.grid.right - metrics.wrapper.right),
    `${label}: grid right should be flush with the content wrapper right`,
  ).toBeLessThanOrEqual(2);
  expect(
    Math.abs(metrics.grid.bottom - metrics.wrapper.bottom),
    `${label}: grid bottom should be flush with the content wrapper bottom`,
  ).toBeLessThanOrEqual(2);
  expect(
    Math.abs(metrics.wrapper.bottom - metrics.footerTop),
    `${label}: content wrapper bottom should touch the footer top`,
  ).toBeLessThanOrEqual(2);
  expect(metrics.grid.height, `${label}: grid height should fill the viewport`).toBeGreaterThan(400);
  expect(metrics.scrollHeight, `${label}: the page should not scroll vertically`).toBeLessThanOrEqual(
    metrics.clientHeight + 1,
  );
  expect(metrics.scrollWidth, `${label}: the page should not scroll horizontally`).toBeLessThanOrEqual(
    metrics.clientWidth + 1,
  );
}

test('every list page renders a full-bleed grid above the footer', async ({ page }) => {
  expect(LIST_ROUTES, 'All module list pages plus the report, role, and number sequence lists').toHaveLength(29);

  for (const definition of LIST_ROUTES) {
    await openList(page, definition.route);
    expectFullBleed(await measureLayout(page), definition.name);
  }
});

test('the pager sits at the bottom of a populated list grid', async ({ page }) => {
  await openList(page, '/Customers/CustomerList');
  await page
    .locator('.e-grid')
    .first()
    .evaluate((element) => {
      const grid = (
        element as unknown as {
          ej2_instances?: Array<{
            pageSettings?: { pageSize?: number };
            refresh?: () => void;
          }>;
        }
      ).ej2_instances?.[0];
      if (grid?.pageSettings) {
        grid.pageSettings.pageSize = 1000;
        grid.refresh?.();
      }
    });

  const pager = page.locator('.e-grid .e-gridpager').first();
  await expect(pager).toBeVisible({ timeout: 20_000 });
  await page.waitForTimeout(300);

  const metrics = await page.evaluate(() => {
    const grid = document.querySelector('.e-grid') as HTMLElement;
    const gridPager = document.querySelector('.e-grid .e-gridpager') as HTMLElement;
    const gridRect = grid.getBoundingClientRect();
    const pagerRect = gridPager.getBoundingClientRect();
    return {
      gridHeight: gridRect.height,
      gridBottom: gridRect.bottom,
      pagerBottom: pagerRect.bottom,
    };
  });

  expect(metrics.gridHeight).toBeGreaterThan(400);
  expect(
    Math.abs(metrics.gridBottom - metrics.pagerBottom),
    'pager bottom should sit at the grid bottom',
  ).toBeLessThanOrEqual(4);
});

test('modal sub-grids keep their configured height', async ({ page }) => {
  await openList(page, '/Customers/CustomerList');

  const heights = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.e-grid')).map((element) => {
      const grid = (element as unknown as { ej2_instances?: Array<{ height?: string | number }> }).ej2_instances?.[0];
      return {
        height: grid?.height,
        inManageContactModal: Boolean(element.closest('#ManageContactModal')),
      };
    }),
  );

  const mainGrid = heights.find((item) => !item.inManageContactModal);
  const modalGrid = heights.find((item) => item.inManageContactModal);
  expect(mainGrid?.height, 'main grid should fill its container').toBe('100%');
  expect(modalGrid?.height, 'Manage Contact modal grid should keep its fixed height').toBe('240px');

  await page.locator('#AddCustom').click();
  await expect(page.locator('#MainModal')).toBeVisible({ timeout: 20_000 });
  await page.locator('#MainModal .modal-footer button[data-bs-dismiss="modal"]').click();
  await expect(page.locator('#MainModal')).toBeHidden({ timeout: 20_000 });
});

test('the full-bleed layout stays flush after a viewport resize', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await openList(page, '/Roles/RoleList');
  expectFullBleed(await measureLayout(page), '1280x720');

  await page.setViewportSize({ width: 1600, height: 900 });
  await page.waitForFunction(
    () => {
      const grid = document.querySelector('.e-grid');
      return grid !== null && grid.getBoundingClientRect().height > 400;
    },
    undefined,
    { timeout: 30_000 },
  );
  await page.waitForTimeout(500);

  const resized = await measureLayout(page);
  expect(resized.clientWidth).toBe(1600);
  expect(resized.clientHeight).toBe(900);
  expectFullBleed(resized, '1600x900');
});
