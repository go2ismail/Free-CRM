import { expect, test } from '@playwright/test';

test.describe('anonymous access', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('login stores the session and redirects to My Profile', async ({ page }) => {
    await page.goto('/Accounts/Login');
    await page.waitForFunction(() => !document.querySelector('#app')?.hasAttribute('v-cloak'));
    await page.locator('#Email').fill('admin@root.com');
    await page.locator('#Password').fill('123456');
    await page.locator('button[type=submit]').click();

    await page.waitForURL('**/Profiles/MyProfile', { timeout: 60_000 });
    const storage = await page.evaluate(() => ({
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      userId: localStorage.getItem('userId'),
      userRoles: localStorage.getItem('userRoles'),
      menuNavigation: localStorage.getItem('menuNavigation'),
    }));
    expect(storage.accessToken).toBeTruthy();
    expect(storage.refreshToken).toBeTruthy();
    expect(storage.userId).toBeTruthy();
    expect(storage.userRoles).toContain('Customers');
    expect(storage.menuNavigation).toContain('Customers');
  });

  test('invalid credentials show an error and keep the user on the login page', async ({ page }) => {
    await page.goto('/Accounts/Login');
    await page.waitForFunction(() => !document.querySelector('#app')?.hasAttribute('v-cloak'));
    await page.locator('#Email').fill('admin@root.com');
    await page.locator('#Password').fill('wrong-password');
    await page.locator('button[type=submit]').click();

    const swal = page.locator('.swal2-popup');
    await expect(swal).toBeVisible({ timeout: 30_000 });
    await expect(swal).toContainText('Login Failed');
    await expect(swal).toContainText('Invalid login credentials');
    expect(page.url()).toContain('/Accounts/Login');
    expect(await page.evaluate(() => localStorage.getItem('accessToken'))).toBeNull();
  });

  test('protected pages redirect anonymous visitors to the login page', async ({ page }) => {
    await page.goto('/Customers/CustomerList');
    await page.waitForURL('**/Accounts/Login', { timeout: 30_000 });
    await expect(page.locator('#Email')).toBeVisible();
  });
});

test.describe('authenticated session', () => {
  test('logout clears the client session and protects pages again', async ({ page }) => {
    await page.goto('/Accounts/Logout');
    await page.waitForFunction(() => !document.querySelector('#app')?.hasAttribute('v-cloak'));
    await page.getByRole('button', { name: 'Log Out', exact: true }).click();

    const swal = page.locator('.swal2-popup');
    await expect(swal).toBeVisible({ timeout: 30_000 });
    await expect(swal).toContainText('Logout Successful');

    await page.waitForURL((url) => url.pathname === '/', { timeout: 30_000 });
    const storage = await page.evaluate(() => ({
      accessToken: localStorage.getItem('accessToken'),
      userId: localStorage.getItem('userId'),
      roles: localStorage.getItem('userRoles'),
    }));
    expect(storage.accessToken).toBeNull();
    expect(storage.userId).toBeNull();
    expect(storage.roles).toBeNull();

    await page.goto('/Customers/CustomerList');
    await page.waitForURL('**/Accounts/Login', { timeout: 30_000 });
  });
});
