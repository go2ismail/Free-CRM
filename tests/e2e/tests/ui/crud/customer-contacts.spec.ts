import { test } from '@playwright/test';
import { ApiClient } from '../../../fixtures/api-client';
import { runUiCrud } from '../../../fixtures/crud-ui';
import { moduleByKey } from '../../../fixtures/modules';

test('Customer Contacts CRUD through the UI', async ({ page }) => {
  const api = await ApiClient.create();
  try {
    await api.login();
    await runUiCrud(page, api, moduleByKey('customer-contacts'));
  } finally {
    await api.dispose();
  }
});