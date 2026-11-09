import { expect, test } from '@playwright/test';
import { ADMIN_EMAIL, ADMIN_PASSWORD, ApiClient } from '../../fixtures/api-client';
import { runApiCrud, runApiOrderItems } from '../../fixtures/crud-api';
import { CRUD_MODULES, ORDER_MODULE_KEYS } from '../../fixtures/modules';

test.describe.configure({ mode: 'serial' });

for (const def of CRUD_MODULES) {
  test(`API CRUD - ${def.name}`, async () => {
    const api = await ApiClient.create();
    try {
      await api.login();
      await runApiCrud(api, def);
    } finally {
      await api.dispose();
    }
  });
}

for (const key of ORDER_MODULE_KEYS) {
  const def = CRUD_MODULES.find((item) => item.key === key)!;
  test(`API nested items - ${def.name}`, async () => {
    const api = await ApiClient.create();
    try {
      await api.login();
      await runApiOrderItems(api, def);
    } finally {
      await api.dispose();
    }
  });
}

test('API authentication rejects invalid credentials', async () => {
  const api = await ApiClient.create();
  try {
    const result = await api.loginWithPassword(ADMIN_EMAIL, 'definitely-wrong-password');
    expect(result.code).not.toBe(200);
  } finally {
    await api.dispose();
  }
});
