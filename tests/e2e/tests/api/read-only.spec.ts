import { expect, test } from '@playwright/test';
import { ApiClient } from '../../fixtures/api-client';

test.describe.configure({ mode: 'serial' });

let api: ApiClient;
let adminId: string;

test.beforeAll(async () => {
  api = await ApiClient.create();
  const login = await api.login();
  adminId = login.userId;
});

test.afterAll(async () => {
  await api.dispose();
});

test('Company list and single endpoints return the seeded company', async () => {
  const companies = await api.list<Record<string, any>>('Company', 'GetCompanyList');
  expect(companies.length).toBeGreaterThan(0);
  const single = await api.get<Record<string, any>>(`/api/Company/GetCompanySingle?id=${companies[0].id}`);
  expect(single.id).toBe(companies[0].id);
  expect(single.name).toBeTruthy();
});

test('Number sequences are seeded and readable', async () => {
  const sequences = await api.list<Record<string, any>>('NumberSequence', 'GetNumberSequenceList');
  expect(sequences.length).toBeGreaterThan(0);
  expect(sequences.every((sequence) => Boolean(sequence.entityName))).toBe(true);
});

test('Roles are seeded and readable', async () => {
  const roles = await api.list<Record<string, any>>('Security', 'GetRoleList');
  expect(roles.length).toBeGreaterThan(0);
  expect(roles.map((role) => role.name)).toContain('Users');
});

test('User list includes the default administrator', async () => {
  const users = await api.list<Record<string, any>>('Security', 'GetUserList');
  const admin = users.find((user) => user.email === 'admin@root.com');
  expect(admin).toBeTruthy();
  expect(admin?.isDeleted).toBeFalsy();
});

test('My profile endpoint returns the signed-in administrator', async () => {
  const profile = await api.list<Record<string, any>>('Security', `GetMyProfileList?userId=${adminId}`);
  expect(profile.length).toBeGreaterThan(0);
  expect(profile[0].id).toBe(adminId);
  expect(profile[0].firstName).toBe('Root');
});

test('Dashboard endpoints return data', async () => {
  const endpoints = [
    'GetCardsDashboard',
    'GetSalesDashboard',
    'GetPurchaseDashboard',
    'GetCRMDashboard',
    'GetLeadPipelineFunnel',
    'GetSalesTeamLeadClosing',
    'GetCampaignByStatus',
    'GetLeadActivityByType',
  ];

  for (const endpoint of endpoints) {
    const result = await api.getRaw(`/api/Dashboard/${endpoint}`);
    expect(result.status, `GET ${endpoint}`).toBe(200);
    expect(result.body.code, `GET ${endpoint}`).toBe(200);
  }
});

test('Order item report endpoints return lists', async () => {
  const salesItems = await api.list<Record<string, any>>('SalesOrderItem', 'GetSalesOrderItemList');
  const purchaseItems = await api.list<Record<string, any>>('PurchaseOrderItem', 'GetPurchaseOrderItemList');
  expect(Array.isArray(salesItems)).toBe(true);
  expect(Array.isArray(purchaseItems)).toBe(true);
});
