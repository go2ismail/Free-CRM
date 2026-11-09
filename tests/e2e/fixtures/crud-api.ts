import { expect } from '@playwright/test';
import type { ApiClient } from './api-client';
import { cleanupRecord, findRecord, findRecordByValue, uniqueValueFor } from './cleanup';
import { uniqueFor } from './data-factory';
import type { ModuleContext, ModuleDef } from './modules';
import { cleanupPrerequisites } from './prerequisites';

export function createContext(def: ModuleDef, adminId: string): ModuleContext {
  const unique = uniqueFor(def.key);
  return {
    unique,
    edit: `${unique}-U`,
    pre: {},
    adminId,
  };
}

export async function prepareContext(api: ApiClient, def: ModuleDef, ctx: ModuleContext): Promise<void> {
  if (def.prepare) {
    ctx.pre = await def.prepare(api, ctx);
  }
}

export async function runApiCrud(api: ApiClient, def: ModuleDef): Promise<void> {
  const ctx = createContext(def, api.adminId);
  await prepareContext(api, def, ctx);

  try {
    const created = await api.post<Record<string, any>>(
      `/api/${def.controller}/${def.createAction}`,
      def.apiCreate(ctx),
    );
    const id = created?.[def.idField] ?? created?.id;
    expect(id, `${def.name}: create response should contain ${def.idField}`).toBeTruthy();

    const uniqueValue = uniqueValueFor(def, ctx);
    let record = await findRecord(api, def, ctx);
    expect(record, `${def.name}: created record ${uniqueValue} should appear in ${def.listAction}`).toBeTruthy();
    expect(String(record?.[def.uniqueField]), `${def.name}: list should expose ${def.uniqueField}`).toBe(uniqueValue);

    await api.post(`/api/${def.controller}/${def.updateAction}`, def.apiUpdate(created, ctx));

    const updatedValue =
      def.key === 'users' || def.key === 'sales-orders' || def.key === 'purchase-orders'
        ? uniqueValue
        : ctx.edit;
    record = await findRecordByValue(api, def, updatedValue);
    expect(record, `${def.name}: updated record should remain in the list`).toBeTruthy();
    if (def.key === 'users') {
      expect(record?.firstName, 'User first name should be updated').toBe(`${ctx.edit}-First`);
    } else if (def.key === 'sales-orders' || def.key === 'purchase-orders') {
      expect(String(record?.orderStatus), 'Order status should be updated to Confirmed').toBe('2');
    } else {
      expect(String(record?.[def.uniqueField]), `${def.name}: ${def.uniqueField} should be updated`).toBe(ctx.edit);
    }

    await api.post(`/api/${def.controller}/${def.deleteAction}`, def.apiDelete(record ?? created, ctx));

    const afterDelete = await findRecordByValue(api, def, updatedValue);
    if (def.softDelete) {
      expect(afterDelete, `${def.name}: soft-deleted record stays visible in the user list`).toBeTruthy();
      expect(afterDelete?.isDeleted, `${def.name}: IsDeleted should be true after delete`).toBe(true);
    } else {
      expect(afterDelete, `${def.name}: deleted record should not appear in ${def.listAction}`).toBeUndefined();
    }
  } finally {
    await cleanupRecord(api, def, ctx);
    await cleanupPrerequisites(api, ctx.pre);
  }
}

export type OrderItemConfig = {
  itemController: string;
  parentField: 'salesOrderId' | 'purchaseOrderId';
  listAction: string;
  createAction: string;
  updateAction: string;
  deleteAction: string;
};

export const ORDER_ITEM_CONFIG: Record<string, OrderItemConfig> = {
  'sales-orders': {
    itemController: 'SalesOrderItem',
    parentField: 'salesOrderId',
    listAction: 'GetSalesOrderItemBySalesOrderIdList',
    createAction: 'CreateSalesOrderItem',
    updateAction: 'UpdateSalesOrderItem',
    deleteAction: 'DeleteSalesOrderItem',
  },
  'purchase-orders': {
    itemController: 'PurchaseOrderItem',
    parentField: 'purchaseOrderId',
    listAction: 'GetPurchaseOrderItemByPurchaseOrderIdList',
    createAction: 'CreatePurchaseOrderItem',
    updateAction: 'UpdatePurchaseOrderItem',
    deleteAction: 'DeletePurchaseOrderItem',
  },
};

export async function runApiOrderItems(api: ApiClient, def: ModuleDef): Promise<void> {
  const config = ORDER_ITEM_CONFIG[def.key];
  if (!config) {
    throw new Error(`No order item configuration for ${def.key}`);
  }

  const ctx = createContext(def, api.adminId);
  await prepareContext(api, def, ctx);

  try {
    const order = await api.post<Record<string, any>>(
      `/api/${def.controller}/${def.createAction}`,
      def.apiCreate(ctx),
    );
    expect(order?.id, `${def.name}: order create should return an id`).toBeTruthy();

    const item = await api.post<Record<string, any>>(`/api/${config.itemController}/${config.createAction}`, {
      [config.parentField]: order.id,
      productId: ctx.pre.product.id,
      summary: `${ctx.unique}-item`,
      unitPrice: 199.99,
      quantity: 7,
      createdById: api.adminId,
    });
    expect(item?.id, `${def.name}: item create should return an id`).toBeTruthy();

    let items = await api.list<Record<string, any>>(
      config.itemController,
      `${config.listAction}?${config.parentField}=${order.id}`,
    );
    expect(items.length, `${def.name}: order should contain one item`).toBe(1);
    expect(items[0].quantity).toBe(7);
    expect(Number(items[0].total)).toBeCloseTo(199.99 * 7, 2);

    await api.post(`/api/${config.itemController}/${config.updateAction}`, {
      id: item.id,
      [config.parentField]: order.id,
      productId: ctx.pre.product.id,
      summary: `${ctx.unique}-item`,
      unitPrice: 199.99,
      quantity: 3,
      updatedById: api.adminId,
    });

    items = await api.list<Record<string, any>>(
      config.itemController,
      `${config.listAction}?${config.parentField}=${order.id}`,
    );
    expect(items.length, `${def.name}: order item count after update`).toBe(1);
    expect(items[0].quantity).toBe(3);
    expect(Number(items[0].total)).toBeCloseTo(199.99 * 3, 2);

    await api.post(`/api/${config.itemController}/${config.deleteAction}`, {
      id: item.id,
      deletedById: api.adminId,
    });

    items = await api.list<Record<string, any>>(
      config.itemController,
      `${config.listAction}?${config.parentField}=${order.id}`,
    );
    expect(items.length, `${def.name}: order item should be removed`).toBe(0);

    await api.post(`/api/${def.controller}/${def.deleteAction}`, {
      id: order.id,
      deletedById: api.adminId,
    });
    expect(await findRecord(api, def, ctx), `${def.name}: order should be removed`).toBeUndefined();
  } finally {
    await cleanupRecord(api, def, ctx);
    await cleanupPrerequisites(api, ctx.pre);
  }
}
