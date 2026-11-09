import { expect, test } from '@playwright/test';
import { ApiClient } from '../../fixtures/api-client';
import type { ModuleDef } from '../../fixtures/modules';
import { CrudListPage } from '../../pages/crud-list-page';

function updateOnlyDef(route: string, controller: string, listAction: string): ModuleDef {
  return {
    key: `update-only-${controller}`,
    name: controller,
    route,
    controller,
    listAction,
    createAction: '',
    updateAction: '',
    deleteAction: '',
    uniqueField: 'name',
    idField: 'id',
    fields: [],
    rowText: (c) => c.unique,
    editedRowText: (c) => c.edit,
    edit: { label: 'Name', kind: 'text', value: (c) => c.edit },
    apiCreate: () => ({}),
    apiUpdate: () => ({}),
    apiDelete: () => ({}),
  };
}

test('My Company can be edited and restored', async ({ page }) => {
  const api = await ApiClient.create();
  try {
    await api.login();
    const companies = await api.list<Record<string, any>>('Company', 'GetCompanyList');
    const original = companies[0];
    expect(original?.name).toBeTruthy();

    const def = updateOnlyDef('/Companies/MyCompany', 'Company', 'GetCompanyList');
    const listPage = new CrudListPage(page, def);
    await listPage.goto();
    await listPage.expectRow(original.name);

    const updatedName = `${original.name} E2E`;
    await listPage.openEdit(original.name);
    await listPage.fillText('Name', updatedName);
    await listPage.save('Save Successful');
    await listPage.expectRow(updatedName);

    const current = await api.get<Record<string, any>>(`/api/Company/GetCompanySingle?id=${original.id}`);
    expect(current.name).toBe(updatedName);

    await listPage.openEdit(updatedName);
    await listPage.fillText('Name', original.name);
    await listPage.save('Save Successful');
    await listPage.expectRow(original.name);
  } finally {
    await api.dispose();
  }
});

test('My Profile can be edited and restored', async ({ page }) => {
  const api = await ApiClient.create();
  try {
    const login = await api.login();
    const profiles = await api.list<Record<string, any>>(
      'Security',
      `GetMyProfileList?userId=${login.userId}`,
    );
    const original = profiles[0];
    expect(original?.firstName).toBeTruthy();

    const def = updateOnlyDef('/Profiles/MyProfile', 'Security', `GetMyProfileList?userId=${login.userId}`);
    def.uniqueField = 'firstName';
    const listPage = new CrudListPage(page, def);
    await listPage.goto();
    await listPage.expectRow(original.firstName);

    const updatedFirstName = `${original.firstName}-E2E`;
    await listPage.openEdit(original.firstName);
    await listPage.fillText('First Name', updatedFirstName);
    await listPage.save('Save Successful');
    await listPage.expectRow(updatedFirstName);

    const afterUpdate = await api.list<Record<string, any>>(
      'Security',
      `GetMyProfileList?userId=${login.userId}`,
    );
    expect(afterUpdate[0].firstName).toBe(updatedFirstName);

    await listPage.openEdit(updatedFirstName);
    await listPage.fillText('First Name', original.firstName);
    await listPage.save('Save Successful');
    await listPage.expectRow(original.firstName);
  } finally {
    await api.dispose();
  }
});
