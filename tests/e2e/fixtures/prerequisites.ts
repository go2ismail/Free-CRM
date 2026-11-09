import type { ApiClient } from './api-client';
import { DATES, E2E_DESCRIPTION, emailFor } from './data-factory';

export type Prereq = {
  id: string;
  name: string;
  number?: string;
  controller: string;
  action: string;
  idField?: 'id' | 'userId';
};

export type PrereqMap = Record<string, Prereq>;

export async function createSalesTeam(api: ApiClient, seed: string): Promise<Prereq> {
  const name = `${seed}-team`;
  const data = await api.post<{ id: string }>('/api/SalesTeam/CreateSalesTeam', {
    name,
    description: E2E_DESCRIPTION,
    createdById: api.adminId,
  });
  return { id: data.id, name, controller: 'SalesTeam', action: 'DeleteSalesTeam' };
}

export async function createCustomerGroup(api: ApiClient, seed: string): Promise<Prereq> {
  const name = `${seed}-group`;
  const data = await api.post<{ id: string }>('/api/CustomerGroup/CreateCustomerGroup', {
    name,
    description: E2E_DESCRIPTION,
    createdById: api.adminId,
  });
  return { id: data.id, name, controller: 'CustomerGroup', action: 'DeleteCustomerGroup' };
}

export async function createCustomerCategory(api: ApiClient, seed: string): Promise<Prereq> {
  const name = `${seed}-category`;
  const data = await api.post<{ id: string }>('/api/CustomerCategory/CreateCustomerCategory', {
    name,
    description: E2E_DESCRIPTION,
    createdById: api.adminId,
  });
  return { id: data.id, name, controller: 'CustomerCategory', action: 'DeleteCustomerCategory' };
}

export async function createCustomer(
  api: ApiClient,
  seed: string,
  group: Prereq,
  category: Prereq,
): Promise<Prereq> {
  const name = `${seed}-customer`;
  const data = await api.post<{ id: string }>('/api/Customer/CreateCustomer', {
    name,
    description: E2E_DESCRIPTION,
    street: '100 E2E Street',
    city: 'E2E City',
    state: 'E2E State',
    zipCode: '12345',
    country: 'US',
    phoneNumber: '555-0100',
    emailAddress: emailFor(`${seed}-customer`),
    customerGroupId: group.id,
    customerCategoryId: category.id,
    createdById: api.adminId,
  });
  return { id: data.id, name, controller: 'Customer', action: 'DeleteCustomer' };
}

export async function createVendorGroup(api: ApiClient, seed: string): Promise<Prereq> {
  const name = `${seed}-group`;
  const data = await api.post<{ id: string }>('/api/VendorGroup/CreateVendorGroup', {
    name,
    description: E2E_DESCRIPTION,
    createdById: api.adminId,
  });
  return { id: data.id, name, controller: 'VendorGroup', action: 'DeleteVendorGroup' };
}

export async function createVendorCategory(api: ApiClient, seed: string): Promise<Prereq> {
  const name = `${seed}-category`;
  const data = await api.post<{ id: string }>('/api/VendorCategory/CreateVendorCategory', {
    name,
    description: E2E_DESCRIPTION,
    createdById: api.adminId,
  });
  return { id: data.id, name, controller: 'VendorCategory', action: 'DeleteVendorCategory' };
}

export async function createVendor(
  api: ApiClient,
  seed: string,
  group: Prereq,
  category: Prereq,
): Promise<Prereq> {
  const name = `${seed}-vendor`;
  const data = await api.post<{ id: string }>('/api/Vendor/CreateVendor', {
    name,
    description: E2E_DESCRIPTION,
    street: '200 E2E Street',
    city: 'E2E City',
    state: 'E2E State',
    zipCode: '12345',
    country: 'US',
    phoneNumber: '555-0200',
    emailAddress: emailFor(`${seed}-vendor`),
    vendorGroupId: group.id,
    vendorCategoryId: category.id,
    createdById: api.adminId,
  });
  return { id: data.id, name, controller: 'Vendor', action: 'DeleteVendor' };
}

export async function createProductGroup(api: ApiClient, seed: string): Promise<Prereq> {
  const name = `${seed}-pgroup`;
  const data = await api.post<{ id: string }>('/api/ProductGroup/CreateProductGroup', {
    name,
    description: E2E_DESCRIPTION,
    createdById: api.adminId,
  });
  return { id: data.id, name, controller: 'ProductGroup', action: 'DeleteProductGroup' };
}

export async function createUnitMeasure(api: ApiClient, seed: string): Promise<Prereq> {
  const name = `${seed}-unit`;
  const data = await api.post<{ id: string }>('/api/UnitMeasure/CreateUnitMeasure', {
    name,
    description: E2E_DESCRIPTION,
    createdById: api.adminId,
  });
  return { id: data.id, name, controller: 'UnitMeasure', action: 'DeleteUnitMeasure' };
}

export async function createTax(api: ApiClient, seed: string): Promise<Prereq> {
  const name = `${seed}-tax`;
  const data = await api.post<{ id: string }>('/api/Tax/CreateTax', {
    name,
    percentage: 10,
    description: E2E_DESCRIPTION,
    createdById: api.adminId,
  });
  return { id: data.id, name, controller: 'Tax', action: 'DeleteTax' };
}

export async function createProduct(
  api: ApiClient,
  seed: string,
  productGroup: Prereq,
  unitMeasure: Prereq,
): Promise<Prereq> {
  const name = `${seed}-product`;
  const data = await api.post<{ id: string }>('/api/Product/CreateProduct', {
    name,
    description: E2E_DESCRIPTION,
    unitPrice: 199.99,
    physical: true,
    productGroupId: productGroup.id,
    unitMeasureId: unitMeasure.id,
    createdById: api.adminId,
  });
  return { id: data.id, name, controller: 'Product', action: 'DeleteProduct' };
}

export async function createCampaign(api: ApiClient, seed: string, team: Prereq): Promise<Prereq> {
  const name = `${seed}-campaign`;
  const data = await api.post<{ id: string; number?: string }>('/api/Campaign/CreateCampaign', {
    title: name,
    description: E2E_DESCRIPTION,
    targetRevenueAmount: 5000,
    campaignDateStart: DATES.start,
    campaignDateFinish: DATES.finish,
    salesTeamId: team.id,
    status: '2',
    createdById: api.adminId,
  });
  return { id: data.id, name, number: data.number, controller: 'Campaign', action: 'DeleteCampaign' };
}

export async function createLead(
  api: ApiClient,
  seed: string,
  campaign: Prereq,
  team: Prereq,
): Promise<Prereq> {
  const title = `${seed}-lead`;
  const data = await api.post<{ id: string }>('/api/Lead/CreateLead', {
    title,
    description: E2E_DESCRIPTION,
    companyName: `${seed}-company`,
    companyAddressStreet: '300 E2E Street',
    companyAddressCity: 'E2E City',
    companyAddressState: 'E2E State',
    companyPhoneNumber: '555-0300',
    companyEmail: emailFor(`${seed}-lead`),
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
    campaignId: campaign.id,
    salesTeamId: team.id,
    createdById: api.adminId,
  });
  return { id: data.id, name: title, controller: 'Lead', action: 'DeleteLead' };
}

export async function createTodo(api: ApiClient, seed: string): Promise<Prereq> {
  const name = `${seed}-todo`;
  const data = await api.post<{ id: string }>('/api/Todo/CreateTodo', {
    name,
    description: E2E_DESCRIPTION,
    createdById: api.adminId,
  });
  return { id: data.id, name, controller: 'Todo', action: 'DeleteTodo' };
}

export async function cleanupPrerequisites(api: ApiClient, pre: PrereqMap): Promise<void> {
  const entries = Object.values(pre).reverse();
  for (const item of entries) {
    try {
      await api.post(`/api/${item.controller}/${item.action}`, {
        id: item.id,
        deletedById: api.adminId,
      });
    } catch {
      // Best-effort cleanup. The disposable E2E database is reset between runs.
    }
  }
}
