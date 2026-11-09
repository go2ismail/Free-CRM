import { expect } from '@playwright/test';
import type { ApiClient } from '../fixtures/api-client';
import { cleanupRecord, findRecordByValue, uniqueValueFor } from '../fixtures/cleanup';
import { createContext, prepareContext } from '../fixtures/crud-api';
import type { ModuleContext, ModuleDef } from '../fixtures/modules';
import { cleanupPrerequisites } from '../fixtures/prerequisites';
import { CrudListPage } from '../pages/crud-list-page';

export async function runUiCrud(
  page: import('@playwright/test').Page,
  api: ApiClient,
  def: ModuleDef,
): Promise<void> {
  const ctx: ModuleContext = createContext(def, api.adminId);
  await prepareContext(api, def, ctx);
  const listPage = new CrudListPage(page, def);
  const uniqueValue = uniqueValueFor(def, ctx);

  try {
    await listPage.goto();

    await listPage.openAdd();
    await listPage.fillFields(def.fields, ctx);
    await listPage.save('Save Successful');
    await listPage.expectRow(def.rowText(ctx));

    const created = await findRecordByValue(api, def, uniqueValue);
    expect(created, `${def.name}: record created through the UI should exist in the API`).toBeTruthy();

    await listPage.openEdit(def.rowText(ctx));
    await listPage.setEditField(def.edit.label, def.edit.kind, String(def.edit.value(ctx)));
    await listPage.save('Save Successful');
    await listPage.expectRow(def.editedRowText(ctx));

    if (def.softDelete) {
      await expect(
        listPage.grid.locator('.e-row').filter({ hasText: uniqueValue }),
        'Soft-deleted user should keep its row',
      ).toHaveCount(1, { timeout: 20_000 });
    } else {
      await listPage.expectNoRow(uniqueValue);
    }

    const updatedValue =
      def.key === 'users' || def.key === 'sales-orders' || def.key === 'purchase-orders'
        ? uniqueValue
        : ctx.edit;
    const updated = await findRecordByValue(api, def, updatedValue);
    expect(updated, `${def.name}: updated record should still exist in the API`).toBeTruthy();
    if (def.key === 'users') {
      expect(updated?.firstName, 'User first name should be updated').toBe(`${ctx.edit}-First`);
    } else {
      expect(String(updated?.[def.uniqueField]), `${def.name}: ${def.uniqueField} should be updated`).toBe(ctx.edit);
    }

    await listPage.openDelete(def.editedRowText(ctx));
    await listPage.save('Delete Successful');

    const afterDelete = await findRecordByValue(api, def, updatedValue);
    if (def.softDelete) {
      expect(afterDelete, 'Soft-deleted user remains in the user list').toBeTruthy();
      expect(afterDelete?.isDeleted, 'IsDeleted should be true after deleting a user').toBe(true);
    } else {
      await listPage.expectNoRow(uniqueValue);
      await listPage.expectNoRow(ctx.edit);
      expect(afterDelete, `${def.name}: deleted record should be gone from the API`).toBeUndefined();
    }
  } finally {
    await cleanupRecord(api, def, ctx);
    await cleanupPrerequisites(api, ctx.pre);
  }
}
