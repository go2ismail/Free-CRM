import { test } from '@playwright/test';
import { ApiClient } from '../../../fixtures/api-client';
import { runUiCrud } from '../../../fixtures/crud-ui';
import { moduleByKey } from '../../../fixtures/modules';

test('Taxs CRUD through the UI', async ({ page }) => {
  const api = await ApiClient.create();
  try {
    await api.login();
    await runUiCrud(page, api, moduleByKey('taxs'));
  } finally {
    await api.dispose();
  }
});