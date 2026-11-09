import { expect, test } from '@playwright/test';
import { ADMIN_EMAIL, ADMIN_PASSWORD, ApiClient } from '../../fixtures/api-client';

test.describe.configure({ mode: 'serial' });

test('Login returns a JWT, refresh token, roles and menu navigation', async () => {
  const api = await ApiClient.create();
  try {
    const data = await api.login();
    expect(data.accessToken.split('.')).toHaveLength(3);
    expect(data.refreshToken.length).toBeGreaterThan(10);
    expect(data.email).toBe(ADMIN_EMAIL);
    expect(data.roles).toContain('Users');
    expect(data.menuNavigation.length).toBeGreaterThan(0);
  } finally {
    await api.dispose();
  }
});

test('ValidateToken accepts a fresh access token', async () => {
  const api = await ApiClient.create();
  try {
    await api.login();
    const response = await api.postRaw('/api/Security/ValidateToken', {});
    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
  } finally {
    await api.dispose();
  }
});

test('Protected endpoints reject anonymous calls', async () => {
  const api = await ApiClient.create();
  try {
    const response = await api.getRaw('/api/CustomerGroup/GetCustomerGroupList');
    expect(response.status).toBe(401);
    expect(response.body.code).toBe(401);
  } finally {
    await api.dispose();
  }
});

test('RefreshToken issues a new access token', async () => {
  const api = await ApiClient.create();
  try {
    const login = await api.login();
    const refresh = await api.postRaw('/api/Security/RefreshToken', { refreshToken: login.refreshToken });
    expect(refresh.status).toBe(200);
    expect(refresh.body.code).toBe(200);
    const data = refresh.body.content?.data as { accessToken?: string } | undefined;
    expect(data?.accessToken).toBeTruthy();
    expect(data?.accessToken).not.toBe(login.accessToken);
  } finally {
    await api.dispose();
  }
});

test('Logout succeeds for the signed-in user', async () => {
  const api = await ApiClient.create();
  try {
    const login = await api.login();
    const logout = await api.postRaw('/api/Security/Logout', { userId: login.userId });
    expect(logout.status).toBe(200);
    expect(logout.body.code).toBe(200);
  } finally {
    await api.dispose();
  }
});

test('Invalid credentials are rejected', async () => {
  const api = await ApiClient.create();
  try {
    const response = await api.loginWithPassword(ADMIN_EMAIL, `${ADMIN_PASSWORD}-wrong`);
    expect(response.code).not.toBe(200);
    expect(response.message ?? '').toContain('Invalid login credentials');
  } finally {
    await api.dispose();
  }
});
