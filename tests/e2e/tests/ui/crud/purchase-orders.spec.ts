import { test } from '@playwright/test';
import { ApiClient } from '../../../fixtures/api-client';
import { runUiOrderCrud } from '../../../fixtures/crud-ui-orders';
import { moduleByKey } from '../../../fixtures/modules';

test('Purchase Orders CRUD with order items through the UI', async ({ page }) => {
  const api = await ApiClient.create();
  try {
    await api.login();
    await runUiOrderCrud(page, api, moduleByKey('purchase-orders'));
  } finally {
    await api.dispose();
  }
});
