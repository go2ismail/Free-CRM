import { expect, test as setup } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../../fixtures/api-client';

const storageStatePath = path.join(__dirname, '..', '..', '.auth', 'admin.json');

setup('authenticate as the default administrator', async ({ page }) => {
  fs.mkdirSync(path.dirname(storageStatePath), { recursive: true });

  await page.goto('/Accounts/Login', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.querySelector('#app')?.hasAttribute('v-cloak'));

  await page.locator('#Email').fill(ADMIN_EMAIL);
  await page.locator('#Password').fill(ADMIN_PASSWORD);
  await page.locator('button[type=submit]').click();

  await page.waitForURL('**/Profiles/MyProfile', { timeout: 60_000 });
  await page.waitForFunction(() => Boolean(localStorage.getItem('accessToken')), null, {
    timeout: 30_000,
  });

  const storage = await page.evaluate(() => ({
    accessToken: JSON.parse(localStorage.getItem('accessToken') ?? 'null') as string | null,
    refreshToken: JSON.parse(localStorage.getItem('refreshToken') ?? 'null') as string | null,
    userId: JSON.parse(localStorage.getItem('userId') ?? 'null') as string | null,
    userRoles: JSON.parse(localStorage.getItem('userRoles') ?? 'null') as string[] | null,
    menuNavigation: JSON.parse(localStorage.getItem('menuNavigation') ?? 'null') as unknown[] | null,
  }));

  expect(storage.accessToken, 'Login should persist an access token in localStorage').toBeTruthy();
  expect(storage.refreshToken, 'Login should persist a refresh token').toBeTruthy();
  expect(storage.userId, 'Login should persist the user id').toBeTruthy();
  expect(storage.userRoles, 'Login should persist the role list').toContain('Customers');
  expect(storage.menuNavigation, 'Login should persist the menu navigation tree').not.toBeNull();

  const token = storage.accessToken as string;
  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8')) as {
    exp?: number;
  };
  const expires = payload.exp ?? Math.floor(Date.now() / 1000) + 3600;

  await page.context().addCookies([
    {
      name: 'accessToken',
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
      expires,
    },
  ]);

  await page.context().storageState({ path: storageStatePath });
});
