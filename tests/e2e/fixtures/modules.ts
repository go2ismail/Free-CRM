import type { ApiClient } from './api-client';
import { DATES, E2E_DESCRIPTION, USER_PASSWORD, emailFor } from './data-factory';
import {
  createCampaign,
  createCustomer,
  createCustomerCategory,
  createCustomerGroup,
  createLead,
  createProduct,
  createProductGroup,
  createSalesTeam,
  createTax,
  createTodo,
  createUnitMeasure,
  createVendor,
  createVendorCategory,
  createVendorGroup,
  type PrereqMap,
} from './prerequisites';

export type ModuleContext = {
  unique: string;
  edit: string;
  pre: PrereqMap;
  adminId: string;
};

export type FieldSpec =
  | { label: string; kind: 'text' | 'textarea' | 'number' | 'date'; value: (c: ModuleContext) => string | number }
  | { label: string; kind: 'dropdown'; value: (c: ModuleContext) => string }
  | { label: string; kind: 'checkbox'; value: (c: ModuleContext) => boolean };

export type ModuleDef = {
  key: string;
  name: string;
  route: string;
  controller: string;
  listAction: string;
  createAction: string;
  updateAction: string;
  deleteAction: string;
  uniqueField: string;
  idField: 'id' | 'userId';
  fields: FieldSpec[];
  rowText: (c: ModuleContext) => string;
  editedRowText: (c: ModuleContext) => string;
  edit: { label: string; kind: 'text' | 'dropdown'; value: (c: ModuleContext) => string };
  prepare?: (api: ApiClient, c: ModuleContext) => Promise<PrereqMap>;
  softDelete?: boolean;
  keepOpenOnSave?: boolean;
  apiCreate: (c: ModuleContext) => Record<string, unknown>;
  apiUpdate: (record: Record<string, any>, c: ModuleContext) => Record<string, unknown>;
  apiDelete: (record: Record<string, any>, c: ModuleContext) => Record<string, unknown>;
};

const basePayload = (c: ModuleContext) => ({ createdById: c.adminId });
const updateBase = (record: Record<string, any>, c: ModuleContext) => ({
  id: record.id,
  updatedById: c.adminId,
});

function simpleModule(options: {
  key: string;
  name: string;
  route: string;
  controller: string;
  listAction: string;
  createAction: string;
  updateAction: string;
  deleteAction: string;
  prepare?: ModuleDef['prepare'];
  fields?: FieldSpec[];
  softDelete?: boolean;
  keepOpenOnSave?: boolean;
  uniqueField?: string;
  rowText?: ModuleDef['rowText'];
  edit?: ModuleDef['edit'];
  apiCreate?: ModuleDef['apiCreate'];
  apiUpdate?: ModuleDef['apiUpdate'];
}): ModuleDef {
  return {
    key: options.key,
    name: options.name,
    route: options.route,
    controller: options.controller,
    listAction: options.listAction,
    createAction: options.createAction,
    updateAction: options.updateAction,
    deleteAction: options.deleteAction,
    uniqueField: options.uniqueField ?? 'name',
    idField: 'id',
    fields: options.fields ?? [
      { label: 'Name', kind: 'text', value: (c) => c.unique },
      { label: 'Description', kind: 'textarea', value: () => E2E_DESCRIPTION },
    ],
    rowText: options.rowText ?? ((c) => c.unique),
    editedRowText: options.edit ? (c) => String(options.edit!.value(c)) : (c) => c.edit,
    edit: options.edit ?? { label: 'Name', kind: 'text', value: (c) => c.edit },
    prepare: options.prepare,
    softDelete: options.softDelete,
    keepOpenOnSave: options.keepOpenOnSave,
    apiCreate:
      options.apiCreate ??
      ((c) => ({ name: c.unique, description: E2E_DESCRIPTION, ...basePayload(c) })),
    apiUpdate:
      options.apiUpdate ??
      ((record, c) => ({ ...updateBase(record, c), name: c.edit, description: E2E_DESCRIPTION })),
    apiDelete: (record, c) => ({ id: record.id, deletedById: c.adminId }),
  };
}

function titleModule(options: {
  key: string;
  name: string;
  route: string;
  controller: string;
  listAction: string;
  createAction: string;
  updateAction: string;
  deleteAction: string;
  fields: FieldSpec[];
  prepare?: ModuleDef['prepare'];
  apiCreate: (c: ModuleContext) => Record<string, unknown>;
  apiUpdate: (record: Record<string, any>, c: ModuleContext) => Record<string, unknown>;
  keepOpenOnSave?: boolean;
}): ModuleDef {
  return {
    key: options.key,
    name: options.name,
    route: options.route,
    controller: options.controller,
    listAction: options.listAction,
    createAction: options.createAction,
    updateAction: options.updateAction,
    deleteAction: options.deleteAction,
    uniqueField: 'title',
    idField: 'id',
    fields: options.fields,
    rowText: (c) => c.unique,
    editedRowText: (c) => c.edit,
    edit: { label: 'Title', kind: 'text', value: (c) => c.edit },
    prepare: options.prepare,
    keepOpenOnSave: options.keepOpenOnSave,
    apiCreate: options.apiCreate,
    apiUpdate: options.apiUpdate,
    apiDelete: (record, c) => ({ id: record.id, deletedById: c.adminId }),
  };
}

export const MODULES: ModuleDef[] = [
  simpleModule({
    key: 'sales-teams',
    name: 'Sales Teams',
    route: '/SalesTeams/SalesTeamList',
    controller: 'SalesTeam',
    listAction: 'GetSalesTeamList',
    createAction: 'CreateSalesTeam',
    updateAction: 'UpdateSalesTeam',
    deleteAction: 'DeleteSalesTeam',
  }),
  simpleModule({
    key: 'sales-representatives',
    name: 'Sales Representatives',
    route: '/SalesRepresentatives/SalesRepresentativeList',
    controller: 'SalesRepresentative',
    listAction: 'GetSalesRepresentativeList',
    createAction: 'CreateSalesRepresentative',
    updateAction: 'UpdateSalesRepresentative',
    deleteAction: 'DeleteSalesRepresentative',
    prepare: async (api, c) => ({ team: await createSalesTeam(api, c.unique) }),
    fields: [
      { label: 'Name', kind: 'text', value: (c) => c.unique },
      { label: 'JobTitle', kind: 'text', value: () => 'E2E Sales Representative' },
      { label: 'EmployeeNumber', kind: 'text', value: (c) => `${c.unique}-emp` },
      { label: 'PhoneNumber', kind: 'text', value: () => '555-0101' },
      { label: 'EmailAddress', kind: 'text', value: (c) => emailFor(c.unique) },
      { label: 'Sales Team', kind: 'dropdown', value: (c) => c.pre.team.name },
      { label: 'Description', kind: 'textarea', value: () => E2E_DESCRIPTION },
    ],
    apiCreate: (c) => ({
      name: c.unique,
      jobTitle: 'E2E Sales Representative',
      employeeNumber: `${c.unique}-emp`,
      phoneNumber: '555-0101',
      emailAddress: emailFor(c.unique),
      description: E2E_DESCRIPTION,
      salesTeamId: c.pre.team.id,
      ...basePayload(c),
    }),
    apiUpdate: (record, c) => ({
      ...updateBase(record, c),
      name: c.edit,
      jobTitle: 'E2E Sales Representative',
      employeeNumber: `${c.unique}-emp`,
      phoneNumber: '555-0101',
      emailAddress: emailFor(c.unique),
      description: E2E_DESCRIPTION,
      salesTeamId: c.pre.team.id,
    }),
  }),
  simpleModule({
    key: 'customer-groups',
    name: 'Customer Groups',
    route: '/CustomerGroups/CustomerGroupList',
    controller: 'CustomerGroup',
    listAction: 'GetCustomerGroupList',
    createAction: 'CreateCustomerGroup',
    updateAction: 'UpdateCustomerGroup',
    deleteAction: 'DeleteCustomerGroup',
  }),
  simpleModule({
    key: 'customer-categories',
    name: 'Customer Categories',
    route: '/CustomerCategories/CustomerCategoryList',
    controller: 'CustomerCategory',
    listAction: 'GetCustomerCategoryList',
    createAction: 'CreateCustomerCategory',
    updateAction: 'UpdateCustomerCategory',
    deleteAction: 'DeleteCustomerCategory',
  }),
  {
    key: 'customers',
    name: 'Customers',
    route: '/Customers/CustomerList',
    controller: 'Customer',
    listAction: 'GetCustomerList',
    createAction: 'CreateCustomer',
    updateAction: 'UpdateCustomer',
    deleteAction: 'DeleteCustomer',
    uniqueField: 'name',
    idField: 'id',
    prepare: async (api, c) => ({
      group: await createCustomerGroup(api, c.unique),
      category: await createCustomerCategory(api, c.unique),
    }),
    fields: [
      { label: 'Name', kind: 'text', value: (c) => c.unique },
      { label: 'Customer Group', kind: 'dropdown', value: (c) => c.pre.group.name },
      { label: 'Customer Category', kind: 'dropdown', value: (c) => c.pre.category.name },
      { label: 'Description', kind: 'textarea', value: () => E2E_DESCRIPTION },
      { label: 'Street', kind: 'text', value: () => '100 E2E Street' },
      { label: 'City', kind: 'text', value: () => 'E2E City' },
      { label: 'State', kind: 'text', value: () => 'E2E State' },
      { label: 'Zip Code', kind: 'text', value: () => '12345' },
      { label: 'Country', kind: 'text', value: () => 'US' },
      { label: 'Phone Number', kind: 'text', value: () => '555-0102' },
      { label: 'Fax Number', kind: 'text', value: () => '555-0103' },
      { label: 'Email', kind: 'text', value: (c) => emailFor(c.unique) },
      { label: 'Website', kind: 'text', value: () => 'https://example.com' },
    ],
    rowText: (c) => c.unique,
    editedRowText: (c) => c.edit,
    edit: { label: 'Name', kind: 'text', value: (c) => c.edit },
    apiCreate: (c) => ({
      name: c.unique,
      description: E2E_DESCRIPTION,
      street: '100 E2E Street',
      city: 'E2E City',
      state: 'E2E State',
      zipCode: '12345',
      country: 'US',
      phoneNumber: '555-0102',
      faxNumber: '555-0103',
      emailAddress: emailFor(c.unique),
      website: 'https://example.com',
      customerGroupId: c.pre.group.id,
      customerCategoryId: c.pre.category.id,
      ...basePayload(c),
    }),
    apiUpdate: (record, c) => ({
      ...updateBase(record, c),
      name: c.edit,
      description: E2E_DESCRIPTION,
      street: '100 E2E Street',
      city: 'E2E City',
      state: 'E2E State',
      zipCode: '12345',
      country: 'US',
      phoneNumber: '555-0102',
      faxNumber: '555-0103',
      emailAddress: emailFor(c.unique),
      website: 'https://example.com',
      customerGroupId: c.pre.group.id,
      customerCategoryId: c.pre.category.id,
    }),
    apiDelete: (record, c) => ({ id: record.id, deletedById: c.adminId }),
  },
  {
    key: 'customer-contacts',
    name: 'Customer Contacts',
    route: '/CustomerContacts/CustomerContactList',
    controller: 'CustomerContact',
    listAction: 'GetCustomerContactList',
    createAction: 'CreateCustomerContact',
    updateAction: 'UpdateCustomerContact',
    deleteAction: 'DeleteCustomerContact',
    uniqueField: 'name',
    idField: 'id',
    prepare: async (api, c) => {
      const group = await createCustomerGroup(api, c.unique);
      const category = await createCustomerCategory(api, c.unique);
      const customer = await createCustomer(api, c.unique, group, category);
      return { group, category, customer };
    },
    fields: [
      { label: 'Name', kind: 'text', value: (c) => c.unique },
      { label: 'Customer', kind: 'dropdown', value: (c) => c.pre.customer.name },
      { label: 'JobTitle', kind: 'text', value: () => 'E2E Contact' },
      { label: 'PhoneNumber', kind: 'text', value: () => '555-0104' },
      { label: 'EmailAddress', kind: 'text', value: (c) => emailFor(c.unique) },
      { label: 'Description', kind: 'textarea', value: () => E2E_DESCRIPTION },
    ],
    rowText: (c) => c.unique,
    editedRowText: (c) => c.edit,
    edit: { label: 'Name', kind: 'text', value: (c) => c.edit },
    apiCreate: (c) => ({
      name: c.unique,
      jobTitle: 'E2E Contact',
      phoneNumber: '555-0104',
      emailAddress: emailFor(c.unique),
      description: E2E_DESCRIPTION,
      customerId: c.pre.customer.id,
      ...basePayload(c),
    }),
    apiUpdate: (record, c) => ({
      ...updateBase(record, c),
      name: c.edit,
      jobTitle: 'E2E Contact',
      phoneNumber: '555-0104',
      emailAddress: emailFor(c.unique),
      description: E2E_DESCRIPTION,
      customerId: c.pre.customer.id,
    }),
    apiDelete: (record, c) => ({ id: record.id, deletedById: c.adminId }),
  },
  simpleModule({
    key: 'vendor-groups',
    name: 'Vendor Groups',
    route: '/VendorGroups/VendorGroupList',
    controller: 'VendorGroup',
    listAction: 'GetVendorGroupList',
    createAction: 'CreateVendorGroup',
    updateAction: 'UpdateVendorGroup',
    deleteAction: 'DeleteVendorGroup',
  }),
  simpleModule({
    key: 'vendor-categories',
    name: 'Vendor Categories',
    route: '/VendorCategories/VendorCategoryList',
    controller: 'VendorCategory',
    listAction: 'GetVendorCategoryList',
    createAction: 'CreateVendorCategory',
    updateAction: 'UpdateVendorCategory',
    deleteAction: 'DeleteVendorCategory',
  }),
  {
    key: 'vendors',
    name: 'Vendors',
    route: '/Vendors/VendorList',
    controller: 'Vendor',
    listAction: 'GetVendorList',
    createAction: 'CreateVendor',
    updateAction: 'UpdateVendor',
    deleteAction: 'DeleteVendor',
    uniqueField: 'name',
    idField: 'id',
    prepare: async (api, c) => ({
      group: await createVendorGroup(api, c.unique),
      category: await createVendorCategory(api, c.unique),
    }),
    fields: [
      { label: 'Name', kind: 'text', value: (c) => c.unique },
      { label: 'Vendor Group', kind: 'dropdown', value: (c) => c.pre.group.name },
      { label: 'Vendor Category', kind: 'dropdown', value: (c) => c.pre.category.name },
      { label: 'Description', kind: 'textarea', value: () => E2E_DESCRIPTION },
      { label: 'Street', kind: 'text', value: () => '200 E2E Street' },
      { label: 'City', kind: 'text', value: () => 'E2E City' },
      { label: 'State', kind: 'text', value: () => 'E2E State' },
      { label: 'Zip Code', kind: 'text', value: () => '12345' },
      { label: 'Country', kind: 'text', value: () => 'US' },
      { label: 'Phone Number', kind: 'text', value: () => '555-0202' },
      { label: 'Fax Number', kind: 'text', value: () => '555-0203' },
      { label: 'Email', kind: 'text', value: (c) => emailFor(c.unique) },
      { label: 'Website', kind: 'text', value: () => 'https://example.com' },
    ],
    rowText: (c) => c.unique,
    editedRowText: (c) => c.edit,
    edit: { label: 'Name', kind: 'text', value: (c) => c.edit },
    apiCreate: (c) => ({
      name: c.unique,
      description: E2E_DESCRIPTION,
      street: '200 E2E Street',
      city: 'E2E City',
      state: 'E2E State',
      zipCode: '12345',
      country: 'US',
      phoneNumber: '555-0202',
      faxNumber: '555-0203',
      emailAddress: emailFor(c.unique),
      website: 'https://example.com',
      vendorGroupId: c.pre.group.id,
      vendorCategoryId: c.pre.category.id,
      ...basePayload(c),
    }),
    apiUpdate: (record, c) => ({
      ...updateBase(record, c),
      name: c.edit,
      description: E2E_DESCRIPTION,
      street: '200 E2E Street',
      city: 'E2E City',
      state: 'E2E State',
      zipCode: '12345',
      country: 'US',
      phoneNumber: '555-0202',
      faxNumber: '555-0203',
      emailAddress: emailFor(c.unique),
      website: 'https://example.com',
      vendorGroupId: c.pre.group.id,
      vendorCategoryId: c.pre.category.id,
    }),
    apiDelete: (record, c) => ({ id: record.id, deletedById: c.adminId }),
  },
  {
    key: 'vendor-contacts',
    name: 'Vendor Contacts',
    route: '/VendorContacts/VendorContactList',
    controller: 'VendorContact',
    listAction: 'GetVendorContactList',
    createAction: 'CreateVendorContact',
    updateAction: 'UpdateVendorContact',
    deleteAction: 'DeleteVendorContact',
    uniqueField: 'name',
    idField: 'id',
    prepare: async (api, c) => {
      const group = await createVendorGroup(api, c.unique);
      const category = await createVendorCategory(api, c.unique);
      const vendor = await createVendor(api, c.unique, group, category);
      return { group, category, vendor };
    },
    fields: [
      { label: 'Name', kind: 'text', value: (c) => c.unique },
      { label: 'Vendor', kind: 'dropdown', value: (c) => c.pre.vendor.name },
      { label: 'JobTitle', kind: 'text', value: () => 'E2E Contact' },
      { label: 'PhoneNumber', kind: 'text', value: () => '555-0204' },
      { label: 'EmailAddress', kind: 'text', value: (c) => emailFor(c.unique) },
      { label: 'Description', kind: 'textarea', value: () => E2E_DESCRIPTION },
    ],
    rowText: (c) => c.unique,
    editedRowText: (c) => c.edit,
    edit: { label: 'Name', kind: 'text', value: (c) => c.edit },
    apiCreate: (c) => ({
      name: c.unique,
      jobTitle: 'E2E Contact',
      phoneNumber: '555-0204',
      emailAddress: emailFor(c.unique),
      description: E2E_DESCRIPTION,
      vendorId: c.pre.vendor.id,
      ...basePayload(c),
    }),
    apiUpdate: (record, c) => ({
      ...updateBase(record, c),
      name: c.edit,
      jobTitle: 'E2E Contact',
      phoneNumber: '555-0204',
      emailAddress: emailFor(c.unique),
      description: E2E_DESCRIPTION,
      vendorId: c.pre.vendor.id,
    }),
    apiDelete: (record, c) => ({ id: record.id, deletedById: c.adminId }),
  },
  simpleModule({
    key: 'product-groups',
    name: 'Product Groups',
    route: '/ProductGroups/ProductGroupList',
    controller: 'ProductGroup',
    listAction: 'GetProductGroupList',
    createAction: 'CreateProductGroup',
    updateAction: 'UpdateProductGroup',
    deleteAction: 'DeleteProductGroup',
  }),
  simpleModule({
    key: 'unit-measures',
    name: 'Unit Measures',
    route: '/UnitMeasures/UnitMeasureList',
    controller: 'UnitMeasure',
    listAction: 'GetUnitMeasureList',
    createAction: 'CreateUnitMeasure',
    updateAction: 'UpdateUnitMeasure',
    deleteAction: 'DeleteUnitMeasure',
  }),
  {
    key: 'taxs',
    name: 'Taxs',
    route: '/Taxs/TaxList',
    controller: 'Tax',
    listAction: 'GetTaxList',
    createAction: 'CreateTax',
    updateAction: 'UpdateTax',
    deleteAction: 'DeleteTax',
    uniqueField: 'name',
    idField: 'id',
    fields: [
      { label: 'Name', kind: 'text', value: (c) => c.unique },
      { label: 'Percentage', kind: 'number', value: () => 12.5 },
      { label: 'Description', kind: 'textarea', value: () => E2E_DESCRIPTION },
    ],
    rowText: (c) => c.unique,
    editedRowText: (c) => c.edit,
    edit: { label: 'Name', kind: 'text', value: (c) => c.edit },
    apiCreate: (c) => ({ name: c.unique, percentage: 12.5, description: E2E_DESCRIPTION, ...basePayload(c) }),
    apiUpdate: (record, c) => ({ ...updateBase(record, c), name: c.edit, percentage: 12.5, description: E2E_DESCRIPTION }),
    apiDelete: (record, c) => ({ id: record.id, deletedById: c.adminId }),
  },
  {
    key: 'products',
    name: 'Products',
    route: '/Products/ProductList',
    controller: 'Product',
    listAction: 'GetProductList',
    createAction: 'CreateProduct',
    updateAction: 'UpdateProduct',
    deleteAction: 'DeleteProduct',
    uniqueField: 'name',
    idField: 'id',
    prepare: async (api, c) => ({
      group: await createProductGroup(api, c.unique),
      unit: await createUnitMeasure(api, c.unique),
    }),
    fields: [
      { label: 'Name', kind: 'text', value: (c) => c.unique },
      { label: 'Unit Price', kind: 'number', value: () => 199.99 },
      { label: 'Unit Measure', kind: 'dropdown', value: (c) => c.pre.unit.name },
      { label: 'Product Group', kind: 'dropdown', value: (c) => c.pre.group.name },
      { label: 'Is Physical Product?', kind: 'checkbox', value: () => true },
      { label: 'Description', kind: 'textarea', value: () => E2E_DESCRIPTION },
    ],
    rowText: (c) => c.unique,
    editedRowText: (c) => c.edit,
    edit: { label: 'Name', kind: 'text', value: (c) => c.edit },
    apiCreate: (c) => ({
      name: c.unique,
      unitPrice: 199.99,
      physical: true,
      description: E2E_DESCRIPTION,
      productGroupId: c.pre.group.id,
      unitMeasureId: c.pre.unit.id,
      ...basePayload(c),
    }),
    apiUpdate: (record, c) => ({
      ...updateBase(record, c),
      name: c.edit,
      unitPrice: 199.99,
      physical: true,
      description: E2E_DESCRIPTION,
      productGroupId: c.pre.group.id,
      unitMeasureId: c.pre.unit.id,
    }),
    apiDelete: (record, c) => ({ id: record.id, deletedById: c.adminId }),
  },
  titleModule({
    key: 'campaigns',
    name: 'Campaigns',
    route: '/Campaigns/CampaignList',
    controller: 'Campaign',
    listAction: 'GetCampaignList',
    createAction: 'CreateCampaign',
    updateAction: 'UpdateCampaign',
    deleteAction: 'DeleteCampaign',
    keepOpenOnSave: true,
    prepare: async (api, c) => ({ team: await createSalesTeam(api, c.unique) }),
    fields: [
      { label: 'Title', kind: 'text', value: (c) => c.unique },
      { label: 'Start Date', kind: 'date', value: () => DATES.start },
      { label: 'Finish Date', kind: 'date', value: () => DATES.finish },
      { label: 'Target Revenue Amount', kind: 'number', value: () => 5000.5 },
      { label: 'Status', kind: 'dropdown', value: () => 'Draft' },
      { label: 'Sales Team', kind: 'dropdown', value: (c) => c.pre.team.name },
      { label: 'Description', kind: 'textarea', value: () => E2E_DESCRIPTION },
    ],
    apiCreate: (c) => ({
      title: c.unique,
      description: E2E_DESCRIPTION,
      targetRevenueAmount: 5000.5,
      campaignDateStart: DATES.start,
      campaignDateFinish: DATES.finish,
      salesTeamId: c.pre.team.id,
      status: '0',
      ...basePayload(c),
    }),
    apiUpdate: (record, c) => ({
      ...updateBase(record, c),
      title: c.edit,
      description: E2E_DESCRIPTION,
      targetRevenueAmount: 5000.5,
      campaignDateStart: DATES.start,
      campaignDateFinish: DATES.finish,
      salesTeamId: c.pre.team.id,
      status: '0',
    }),
  }),
  titleModule({
    key: 'budgets',
    name: 'Budgets',
    route: '/Budgets/BudgetList',
    controller: 'Budget',
    listAction: 'GetBudgetList',
    createAction: 'CreateBudget',
    updateAction: 'UpdateBudget',
    deleteAction: 'DeleteBudget',
    prepare: async (api, c) => {
      const team = await createSalesTeam(api, c.unique);
      return { team, campaign: await createCampaign(api, c.unique, team) };
    },
    fields: [
      { label: 'Title', kind: 'text', value: (c) => c.unique },
      { label: 'Budget Date', kind: 'date', value: () => DATES.budget },
      { label: 'Amount', kind: 'number', value: () => 1500.75 },
      { label: 'Campaign', kind: 'dropdown', value: (c) => c.pre.campaign.number ?? c.pre.campaign.name },
      { label: 'Status', kind: 'dropdown', value: () => 'Draft' },
      { label: 'Description', kind: 'textarea', value: () => E2E_DESCRIPTION },
    ],
    apiCreate: (c) => ({
      title: c.unique,
      description: E2E_DESCRIPTION,
      budgetDate: DATES.budget,
      amount: 1500.75,
      campaignId: c.pre.campaign.id,
      status: '0',
      ...basePayload(c),
    }),
    apiUpdate: (record, c) => ({
      ...updateBase(record, c),
      title: c.edit,
      description: E2E_DESCRIPTION,
      budgetDate: DATES.budget,
      amount: 1500.75,
      campaignId: c.pre.campaign.id,
      status: '0',
    }),
  }),
  titleModule({
    key: 'expenses',
    name: 'Expenses',
    route: '/Expenses/ExpenseList',
    controller: 'Expense',
    listAction: 'GetExpenseList',
    createAction: 'CreateExpense',
    updateAction: 'UpdateExpense',
    deleteAction: 'DeleteExpense',
    prepare: async (api, c) => {
      const team = await createSalesTeam(api, c.unique);
      return { team, campaign: await createCampaign(api, c.unique, team) };
    },
    fields: [
      { label: 'Title', kind: 'text', value: (c) => c.unique },
      { label: 'Expense Date', kind: 'date', value: () => DATES.expense },
      { label: 'Amount', kind: 'number', value: () => 250.25 },
      { label: 'Campaign', kind: 'dropdown', value: (c) => c.pre.campaign.number ?? c.pre.campaign.name },
      { label: 'Status', kind: 'dropdown', value: () => 'Confirmed' },
      { label: 'Description', kind: 'textarea', value: () => E2E_DESCRIPTION },
    ],
    apiCreate: (c) => ({
      title: c.unique,
      description: E2E_DESCRIPTION,
      expenseDate: DATES.expense,
      amount: 250.25,
      campaignId: c.pre.campaign.id,
      status: '2',
      ...basePayload(c),
    }),
    apiUpdate: (record, c) => ({
      ...updateBase(record, c),
      title: c.edit,
      description: E2E_DESCRIPTION,
      expenseDate: DATES.expense,
      amount: 250.25,
      campaignId: c.pre.campaign.id,
      status: '2',
    }),
  }),
  {
    key: 'leads',
    name: 'Leads',
    route: '/Leads/LeadList',
    controller: 'Lead',
    listAction: 'GetLeadList',
    createAction: 'CreateLead',
    updateAction: 'UpdateLead',
    deleteAction: 'DeleteLead',
    uniqueField: 'title',
    idField: 'id',
    prepare: async (api, c) => {
      const team = await createSalesTeam(api, c.unique);
      const campaign = await createCampaign(api, c.unique, team);
      return { team, campaign };
    },
    fields: [
      { label: 'Title', kind: 'text', value: (c) => c.unique },
      { label: 'Campaign', kind: 'dropdown', value: (c) => c.pre.campaign.name },
      { label: 'Sales Team', kind: 'dropdown', value: (c) => c.pre.team.name },
      { label: 'Company Name', kind: 'text', value: (c) => `${c.unique}-company` },
      { label: 'Company Description', kind: 'textarea', value: () => E2E_DESCRIPTION },
      { label: 'Street', kind: 'text', value: () => '300 E2E Street' },
      { label: 'City', kind: 'text', value: () => 'E2E City' },
      { label: 'State', kind: 'text', value: () => 'E2E State' },
      { label: 'Zip Code', kind: 'text', value: () => '12345' },
      { label: 'Country', kind: 'text', value: () => 'US' },
      { label: 'Phone Number', kind: 'text', value: () => '555-0300' },
      { label: 'Fax Number', kind: 'text', value: () => '555-0301' },
      { label: 'Email', kind: 'text', value: (c) => emailFor(c.unique) },
      { label: 'Website', kind: 'text', value: () => 'https://example.com' },
      { label: 'WhatsApp', kind: 'text', value: () => '555-0302' },
      { label: 'LinkedIn', kind: 'text', value: () => 'e2e-linkedin' },
      { label: 'Facebook', kind: 'text', value: () => 'e2e-facebook' },
      { label: 'Instagram', kind: 'text', value: () => 'e2e-instagram' },
      { label: 'Twitter', kind: 'text', value: () => 'e2e-twitter' },
      { label: 'Budget Score', kind: 'number', value: () => 80 },
      { label: 'Authority Score', kind: 'number', value: () => 70 },
      { label: 'Need Score', kind: 'number', value: () => 90 },
      { label: 'Timeline Score', kind: 'number', value: () => 60 },
      { label: 'Prospecting Date', kind: 'date', value: () => DATES.prospecting },
      { label: 'Estimated Closing Date', kind: 'date', value: () => DATES.closingEstimate },
      { label: 'Actual Closing Date', kind: 'date', value: () => DATES.closingActual },
      { label: 'Targeted Amount', kind: 'number', value: () => 10000 },
      { label: 'Closed Amount', kind: 'number', value: () => 5000 },
      { label: 'Pipeline Stage', kind: 'dropdown', value: () => '1. Prospecting' },
      { label: 'Closing Status', kind: 'dropdown', value: () => 'OnProgress' },
      { label: 'Closing Note', kind: 'textarea', value: () => E2E_DESCRIPTION },
      { label: 'Description', kind: 'textarea', value: () => E2E_DESCRIPTION },
    ],
    rowText: (c) => c.unique,
    editedRowText: (c) => c.edit,
    edit: { label: 'Title', kind: 'text', value: (c) => c.edit },
    apiCreate: (c) => ({
      title: c.unique,
      description: E2E_DESCRIPTION,
      companyName: `${c.unique}-company`,
      companyAddressStreet: '300 E2E Street',
      companyAddressCity: 'E2E City',
      companyAddressState: 'E2E State',
      companyPhoneNumber: '555-0300',
      companyEmail: emailFor(c.unique),
      dateProspecting: DATES.prospecting,
      dateClosingEstimation: DATES.closingEstimate,
      dateClosingActual: DATES.closingActual,
      amountTargeted: 10000,
      amountClosed: 5000,
      budgetScore: 80,
      authorityScore: 70,
      needScore: 90,
      timelineScore: 60,
      pipelineStage: '1',
      closingStatus: '2',
      campaignId: c.pre.campaign.id,
      salesTeamId: c.pre.team.id,
      ...basePayload(c),
    }),
    apiUpdate: (record, c) => ({
      ...updateBase(record, c),
      title: c.edit,
      description: E2E_DESCRIPTION,
      companyName: `${c.unique}-company`,
      companyAddressStreet: '300 E2E Street',
      companyAddressCity: 'E2E City',
      companyAddressState: 'E2E State',
      companyPhoneNumber: '555-0300',
      companyEmail: emailFor(c.unique),
      dateProspecting: DATES.prospecting,
      dateClosingEstimation: DATES.closingEstimate,
      dateClosingActual: DATES.closingActual,
      amountTargeted: 10000,
      amountClosed: 5000,
      budgetScore: 80,
      authorityScore: 70,
      needScore: 90,
      timelineScore: 60,
      pipelineStage: '1',
      closingStatus: '2',
      campaignId: c.pre.campaign.id,
      salesTeamId: c.pre.team.id,
    }),
    apiDelete: (record, c) => ({ id: record.id, deletedById: c.adminId }),
  },
  {
    key: 'lead-contacts',
    name: 'Lead Contacts',
    route: '/LeadContacts/LeadContactList',
    controller: 'LeadContact',
    listAction: 'GetLeadContactList',
    createAction: 'CreateLeadContact',
    updateAction: 'UpdateLeadContact',
    deleteAction: 'DeleteLeadContact',
    uniqueField: 'fullName',
    idField: 'id',
    prepare: async (api, c) => {
      const team = await createSalesTeam(api, c.unique);
      const campaign = await createCampaign(api, c.unique, team);
      return { team, campaign, lead: await createLead(api, c.unique, campaign, team) };
    },
    fields: [
      { label: 'Lead', kind: 'dropdown', value: (c) => c.pre.lead.name },
      { label: 'Full Name', kind: 'text', value: (c) => c.unique },
      { label: 'Description', kind: 'textarea', value: () => E2E_DESCRIPTION },
      { label: 'Street', kind: 'text', value: () => '400 E2E Street' },
      { label: 'City', kind: 'text', value: () => 'E2E City' },
      { label: 'State', kind: 'text', value: () => 'E2E State' },
      { label: 'Zip Code', kind: 'text', value: () => '12345' },
      { label: 'Country', kind: 'text', value: () => 'US' },
      { label: 'Mobile Number', kind: 'text', value: () => '555-0400' },
      { label: 'Phone Number', kind: 'text', value: () => '555-0401' },
      { label: 'Fax Number', kind: 'text', value: () => '555-0402' },
      { label: 'Email', kind: 'text', value: (c) => emailFor(c.unique) },
      { label: 'Website', kind: 'text', value: () => 'https://example.com' },
    ],
    rowText: (c) => c.unique,
    editedRowText: (c) => c.edit,
    edit: { label: 'Full Name', kind: 'text', value: (c) => c.edit },
    apiCreate: (c) => ({
      leadId: c.pre.lead.id,
      fullName: c.unique,
      description: E2E_DESCRIPTION,
      addressStreet: '400 E2E Street',
      addressCity: 'E2E City',
      addressState: 'E2E State',
      mobileNumber: '555-0400',
      email: emailFor(c.unique),
      ...basePayload(c),
    }),
    apiUpdate: (record, c) => ({
      ...updateBase(record, c),
      leadId: c.pre.lead.id,
      fullName: c.edit,
      description: E2E_DESCRIPTION,
      addressStreet: '400 E2E Street',
      addressCity: 'E2E City',
      addressState: 'E2E State',
      mobileNumber: '555-0400',
      email: emailFor(c.unique),
    }),
    apiDelete: (record, c) => ({ id: record.id, deletedById: c.adminId }),
  },
  {
    key: 'lead-activities',
    name: 'Lead Activities',
    route: '/LeadActivities/LeadActivityList',
    controller: 'LeadActivity',
    listAction: 'GetLeadActivityList',
    createAction: 'CreateLeadActivity',
    updateAction: 'UpdateLeadActivity',
    deleteAction: 'DeleteLeadActivity',
    uniqueField: 'summary',
    idField: 'id',
    prepare: async (api, c) => {
      const team = await createSalesTeam(api, c.unique);
      const campaign = await createCampaign(api, c.unique, team);
      return { team, campaign, lead: await createLead(api, c.unique, campaign, team) };
    },
    fields: [
      { label: 'Lead', kind: 'dropdown', value: (c) => c.pre.lead.name },
      { label: 'Summary', kind: 'text', value: (c) => c.unique },
      { label: 'Activity Type', kind: 'dropdown', value: () => 'Phone' },
      { label: 'From Date', kind: 'date', value: () => DATES.activityFrom },
      { label: 'To Date', kind: 'date', value: () => DATES.activityTo },
      { label: 'Description', kind: 'textarea', value: () => E2E_DESCRIPTION },
    ],
    rowText: (c) => c.unique,
    editedRowText: (c) => c.edit,
    edit: { label: 'Summary', kind: 'text', value: (c) => c.edit },
    apiCreate: (c) => ({
      leadId: c.pre.lead.id,
      summary: c.unique,
      description: E2E_DESCRIPTION,
      fromDate: DATES.activityFrom,
      toDate: DATES.activityTo,
      type: '1',
      ...basePayload(c),
    }),
    apiUpdate: (record, c) => ({
      ...updateBase(record, c),
      leadId: c.pre.lead.id,
      summary: c.edit,
      description: E2E_DESCRIPTION,
      fromDate: DATES.activityFrom,
      toDate: DATES.activityTo,
      type: '1',
    }),
    apiDelete: (record, c) => ({ id: record.id, deletedById: c.adminId }),
  },
  {
    key: 'todos',
    name: 'Todos',
    route: '/Todos/TodoList',
    controller: 'Todo',
    listAction: 'GetTodoList',
    createAction: 'CreateTodo',
    updateAction: 'UpdateTodo',
    deleteAction: 'DeleteTodo',
    uniqueField: 'name',
    idField: 'id',
    fields: [
      { label: 'Name', kind: 'text', value: (c) => c.unique },
      { label: 'Description', kind: 'textarea', value: () => E2E_DESCRIPTION },
    ],
    rowText: (c) => c.unique,
    editedRowText: (c) => c.edit,
    edit: { label: 'Name', kind: 'text', value: (c) => c.edit },
    apiCreate: (c) => ({ name: c.unique, description: E2E_DESCRIPTION, ...basePayload(c) }),
    apiUpdate: (record, c) => ({ ...updateBase(record, c), name: c.edit, description: E2E_DESCRIPTION }),
    apiDelete: (record, c) => ({ id: record.id, deletedById: c.adminId }),
  },
  {
    key: 'todo-items',
    name: 'Todo Items',
    route: '/TodoItems/TodoItemList',
    controller: 'TodoItem',
    listAction: 'GetTodoItemList',
    createAction: 'CreateTodoItem',
    updateAction: 'UpdateTodoItem',
    deleteAction: 'DeleteTodoItem',
    uniqueField: 'name',
    idField: 'id',
    prepare: async (api, c) => ({ todo: await createTodo(api, c.unique) }),
    fields: [
      { label: 'Name', kind: 'text', value: (c) => c.unique },
      { label: 'Todo', kind: 'dropdown', value: (c) => c.pre.todo.name },
      { label: 'Description', kind: 'textarea', value: () => E2E_DESCRIPTION },
    ],
    rowText: (c) => c.unique,
    editedRowText: (c) => c.edit,
    edit: { label: 'Name', kind: 'text', value: (c) => c.edit },
    apiCreate: (c) => ({ name: c.unique, description: E2E_DESCRIPTION, todoId: c.pre.todo.id, ...basePayload(c) }),
    apiUpdate: (record, c) => ({
      ...updateBase(record, c),
      name: c.edit,
      description: E2E_DESCRIPTION,
      todoId: c.pre.todo.id,
    }),
    apiDelete: (record, c) => ({ id: record.id, deletedById: c.adminId }),
  },
  {
    key: 'users',
    name: 'Users',
    route: '/Users/UserList',
    controller: 'Security',
    listAction: 'GetUserList',
    createAction: 'CreateUser',
    updateAction: 'UpdateUser',
    deleteAction: 'DeleteUser',
    uniqueField: 'email',
    idField: 'userId',
    softDelete: true,
    fields: [
      { label: 'First Name', kind: 'text', value: (c) => `${c.unique}-First` },
      { label: 'Last Name', kind: 'text', value: () => 'E2E User' },
      { label: 'Email', kind: 'text', value: (c) => emailFor(c.unique) },
      { label: 'Email Confirmed', kind: 'checkbox', value: () => true },
      { label: 'Is Blocked', kind: 'checkbox', value: () => false },
      { label: 'Is Deleted', kind: 'checkbox', value: () => false },
      { label: 'Password', kind: 'text', value: () => USER_PASSWORD },
      { label: 'Confirm Password', kind: 'text', value: () => USER_PASSWORD },
    ],
    rowText: (c) => emailFor(c.unique),
    editedRowText: (c) => emailFor(c.unique),
    edit: { label: 'First Name', kind: 'text', value: (c) => `${c.edit}-First` },
    apiCreate: (c) => ({
      email: emailFor(c.unique),
      password: USER_PASSWORD,
      confirmPassword: USER_PASSWORD,
      firstName: `${c.unique}-First`,
      lastName: 'E2E User',
      emailConfirmed: true,
      isBlocked: false,
      isDeleted: false,
      createdById: c.adminId,
    }),
    apiUpdate: (record, c) => ({
      userId: record.userId ?? record.id,
      firstName: `${c.edit}-First`,
      lastName: 'E2E User',
      emailConfirmed: true,
      isBlocked: false,
      isDeleted: false,
      updatedById: c.adminId,
    }),
    apiDelete: (record, c) => ({ userId: record.userId ?? record.id, deletedById: c.adminId }),
  },
  {
    key: 'sales-orders',
    name: 'Sales Orders',
    route: '/SalesOrders/SalesOrderList',
    controller: 'SalesOrder',
    listAction: 'GetSalesOrderList',
    createAction: 'CreateSalesOrder',
    updateAction: 'UpdateSalesOrder',
    deleteAction: 'DeleteSalesOrder',
    uniqueField: 'description',
    idField: 'id',
    prepare: async (api, c) => {
      const group = await createCustomerGroup(api, c.unique);
      const category = await createCustomerCategory(api, c.unique);
      const customer = await createCustomer(api, c.unique, group, category);
      const tax = await createTax(api, c.unique);
      const productGroup = await createProductGroup(api, c.unique);
      const unit = await createUnitMeasure(api, c.unique);
      const product = await createProduct(api, c.unique, productGroup, unit);
      return { group, category, customer, tax, productGroup, unit, product };
    },
    fields: [
      { label: 'Order Date', kind: 'date', value: () => DATES.order },
      { label: 'Customer', kind: 'dropdown', value: (c) => c.pre.customer.name },
      { label: 'Tax', kind: 'dropdown', value: (c) => c.pre.tax.name },
      { label: 'Order Status', kind: 'dropdown', value: () => 'Draft' },
      { label: 'Description', kind: 'textarea', value: (c) => c.unique },
    ],
    rowText: (c) => c.pre.customer.name,
    editedRowText: (c) => c.pre.customer.name,
    edit: { label: 'Order Status', kind: 'dropdown', value: () => 'Confirmed' },
    apiCreate: (c) => ({
      orderDate: DATES.order,
      description: c.unique,
      orderStatus: '0',
      customerId: c.pre.customer.id,
      taxId: c.pre.tax.id,
      ...basePayload(c),
    }),
    apiUpdate: (record, c) => ({
      ...updateBase(record, c),
      orderDate: DATES.order,
      description: c.unique,
      orderStatus: '2',
      customerId: c.pre.customer.id,
      taxId: c.pre.tax.id,
    }),
    apiDelete: (record, c) => ({ id: record.id, deletedById: c.adminId }),
  },
  {
    key: 'purchase-orders',
    name: 'Purchase Orders',
    route: '/PurchaseOrders/PurchaseOrderList',
    controller: 'PurchaseOrder',
    listAction: 'GetPurchaseOrderList',
    createAction: 'CreatePurchaseOrder',
    updateAction: 'UpdatePurchaseOrder',
    deleteAction: 'DeletePurchaseOrder',
    uniqueField: 'description',
    idField: 'id',
    prepare: async (api, c) => {
      const group = await createVendorGroup(api, c.unique);
      const category = await createVendorCategory(api, c.unique);
      const vendor = await createVendor(api, c.unique, group, category);
      const tax = await createTax(api, c.unique);
      const productGroup = await createProductGroup(api, c.unique);
      const unit = await createUnitMeasure(api, c.unique);
      const product = await createProduct(api, c.unique, productGroup, unit);
      return { group, category, vendor, tax, productGroup, unit, product };
    },
    fields: [
      { label: 'Order Date', kind: 'date', value: () => DATES.order },
      { label: 'Vendor', kind: 'dropdown', value: (c) => c.pre.vendor.name },
      { label: 'Tax', kind: 'dropdown', value: (c) => c.pre.tax.name },
      { label: 'Order Status', kind: 'dropdown', value: () => 'Draft' },
      { label: 'Description', kind: 'textarea', value: (c) => c.unique },
    ],
    rowText: (c) => c.pre.vendor.name,
    editedRowText: (c) => c.pre.vendor.name,
    edit: { label: 'Order Status', kind: 'dropdown', value: () => 'Confirmed' },
    apiCreate: (c) => ({
      orderDate: DATES.order,
      description: c.unique,
      orderStatus: '0',
      vendorId: c.pre.vendor.id,
      taxId: c.pre.tax.id,
      ...basePayload(c),
    }),
    apiUpdate: (record, c) => ({
      ...updateBase(record, c),
      orderDate: DATES.order,
      description: c.unique,
      orderStatus: '2',
      vendorId: c.pre.vendor.id,
      taxId: c.pre.tax.id,
    }),
    apiDelete: (record, c) => ({ id: record.id, deletedById: c.adminId }),
  },
];

export const ORDER_MODULE_KEYS = new Set(['sales-orders', 'purchase-orders']);

export const CRUD_MODULES = MODULES;

export function moduleByKey(key: string): ModuleDef {
  const found = MODULES.find((item) => item.key === key);
  if (!found) {
    throw new Error(`Unknown E2E module: ${key}`);
  }
  return found;
}
