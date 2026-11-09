import { request } from '@playwright/test';
import { ADMIN_EMAIL, ADMIN_PASSWORD, BASE_URL } from './fixtures/api-client';

const WAIT_TIMEOUT_MS = 180_000;

async function waitForApplication(): Promise<void> {
  const started = Date.now();
  let lastError = '';
  while (Date.now() - started < WAIT_TIMEOUT_MS) {
    try {
      const response = await fetch(`${BASE_URL}/Accounts/Login`);
      if (response.ok) {
        return;
      }
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error(`The CRM application at ${BASE_URL} did not become ready: ${lastError}`);
}

export default async function globalSetup(): Promise<void> {
  await waitForApplication();

  const http = await request.newContext({ baseURL: BASE_URL, timeout: 120_000 });
  try {
    const loginResponse = await http.post('/api/Security/Login', {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });
    const loginBody = await loginResponse.json();
    if (loginBody?.code !== 200 || !loginBody?.content?.data?.accessToken) {
      throw new Error(`Global setup could not log in as ${ADMIN_EMAIL}: ${JSON.stringify(loginBody)}`);
    }

    const headers = { Authorization: `Bearer ${loginBody.content.data.accessToken}` };
    const adminId = loginBody.content.data.userId as string;

    const warmupName = `E2E-Warmup-${Date.now()}`;
    const created = await http.post('/api/CustomerGroup/CreateCustomerGroup', {
      headers,
      data: { name: warmupName, description: 'E2E startup warmup', createdById: adminId },
    });
    const createdBody = await created.json();
    if (createdBody?.code !== 200) {
      throw new Error(`Global setup warmup create failed: ${JSON.stringify(createdBody)}`);
    }
    await http.post('/api/CustomerGroup/DeleteCustomerGroup', {
      headers,
      data: { id: createdBody.content.data.id, deletedById: adminId },
    });
  } finally {
    await http.dispose();
  }
}
