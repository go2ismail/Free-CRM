import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import type { ApiClient } from '../fixtures/api-client';
import { cleanupRecord, findRecordByValue, uniqueValueFor } from '../fixtures/cleanup';
import { createContext, ORDER_ITEM_CONFIG, prepareContext } from '../fixtures/crud-api';
import type { ModuleContext, ModuleDef } from '../fixtures/modules';
import { cleanupPrerequisites } from '../fixtures/prerequisites';
import { CrudListPage } from '../pages/crud-list-page';
import { NestedGrid } from '../pages/nested-grid';

const PRODUCT_PRICE = 199.99;

export async function runUiOrderCrud(page: Page, api: ApiClient, def: ModuleDef): Promise<void> {
  const config = ORDER_ITEM_CONFIG[def.key];
  if (!config) {
    throw new Error(`No order item configuration for ${def.key}`);
  }

  const ctx: ModuleContext = createContext(def, api.adminId);
  await prepareContext(api, def, ctx);
  const listPage = new CrudListPage(page, def);
  const uniqueValue = uniqueValueFor(def, ctx);
  const productName = ctx.pre.product.name;
  const rowText = def.rowText(ctx);

  const items = async (orderId: string) =>
    api.list<Record<string, any>>(
      config.itemController,
      `${config.listAction}?${config.parentField}=${orderId}`,
    );

  try {
    await listPage.goto();

    // Create the order through the UI and keep the modal open for the item grid.
    await listPage.openAdd();
    await listPage.fillFields(def.fields, ctx);
    await listPage.saveKeepOpen('Save Successful');
    await expect(page.locator('#MainModal #ComplexDiv')).toBeVisible({ timeout: 30_000 });

    const order = await findRecordByValue(api, def, uniqueValue);
    expect(order, `${def.name}: order created through the UI should exist in the API`).toBeTruthy();
    const orderId = String(order!.id);

    const nested = new NestedGrid(page, page.locator('#MainModal #ComplexDiv .e-grid'), listPage);

    // Add, edit and remove an order item.
    await nested.addItem(productName, 7);
    let orderItems = await items(orderId);
    expect(orderItems.length, `${def.name}: one item should be persisted`).toBe(1);
    expect(orderItems[0].quantity).toBe(7);
    expect(Number(orderItems[0].total)).toBeCloseTo(PRODUCT_PRICE * 7, 2);

    await nested.editItem(productName, 3);
    orderItems = await items(orderId);
    expect(orderItems.length, `${def.name}: item count after edit`).toBe(1);
    expect(orderItems[0].quantity).toBe(3);
    expect(Number(orderItems[0].total)).toBeCloseTo(PRODUCT_PRICE * 3, 2);

    await nested.deleteItem(productName);
    orderItems = await items(orderId);
    expect(orderItems.length, `${def.name}: item should be deleted`).toBe(0);

    await listPage.closeModal();

    // Update the order status through the UI.
    await listPage.openEdit(rowText);
    await listPage.setEditField(def.edit.label, def.edit.kind, String(def.edit.value(ctx)));
    await listPage.saveKeepOpen('Save Successful');
    await listPage.closeModal();

    await listPage.expectRow(rowText);
    await expect(
      listPage.grid.locator('.e-row').filter({ hasText: rowText }).first(),
      `${def.name}: updated status should be visible in the grid`,
    ).toContainText('Confirmed');

    const updated = await findRecordByValue(api, def, uniqueValue);
    expect(String(updated?.orderStatus), `${def.name}: order status should be Confirmed`).toBe('2');

    // Delete the order through the UI.
    await listPage.openDelete(rowText);
    await listPage.save('Delete Successful');
    await listPage.expectNoRow(rowText);

    expect(
      await findRecordByValue(api, def, uniqueValue),
      `${def.name}: deleted order should be gone from the API`,
    ).toBeUndefined();
    expect((await items(orderId)).length, `${def.name}: items should be gone with the order`).toBe(0);
  } finally {
    await cleanupRecord(api, def, ctx);
    await cleanupPrerequisites(api, ctx.pre);
  }
}
