import { expect, test } from '@playwright/test';
import { ApiClient } from '../../fixtures/api-client';
import { emailFor, uniqueFor, USER_PASSWORD } from '../../fixtures/data-factory';

test.describe.configure({ mode: 'serial' });

let admin: ApiClient;
let adminId: string;
let adminFirstName: string;

let profilesUser: ApiClient;
let profilesUserId: string;
let profilesUserEmail: string;

let usersUser: ApiClient;
let usersUserId: string;

let salesUser: ApiClient;
let salesUserId: string;

async function createUser(label: string): Promise<{ email: string; id: string }> {
  const email = emailFor(uniqueFor(label));
  const response = await admin.postRaw('/api/Security/CreateUser', {
    email,
    password: USER_PASSWORD,
    confirmPassword: USER_PASSWORD,
    firstName: `${label}-First`,
    lastName: 'E2E Authorization',
    emailConfirmed: true,
    isBlocked: false,
    isDeleted: false,
  });
  expect(response.status, `CreateUser ${email}`).toBe(200);

  const users = await admin.list<Record<string, any>>('Security', 'GetUserList');
  const created = users.find((user) => String(user.email).toLowerCase() === email.toLowerCase());
  expect(created, `created user ${email}`).toBeTruthy();
  return { email, id: String(created!.id) };
}

async function loginAs(email: string): Promise<ApiClient> {
  const client = await ApiClient.create();
  const login = await client.login(email, USER_PASSWORD);
  expect(login.roles).toContain('Profiles');
  return client;
}

test.beforeAll(async () => {
  admin = await ApiClient.create();
  const login = await admin.login();
  adminId = login.userId;
  adminFirstName = login.firstName;

  const profilesAccount = await createUser('auth-profile');
  profilesUserEmail = profilesAccount.email;
  profilesUserId = profilesAccount.id;
  profilesUser = await loginAs(profilesUserEmail);

  const usersAccount = await createUser('auth-users');
  usersUserId = usersAccount.id;
  const usersGrant = await admin.postRaw('/api/Security/UpdateUserRole', {
    userId: usersUserId,
    roleName: 'Users',
    accessGranted: true,
  });
  expect(usersGrant.status, 'grant Users role').toBe(200);
  usersUser = await loginAs(usersAccount.email);

  const salesAccount = await createUser('auth-sales');
  salesUserId = salesAccount.id;
  const salesGrant = await admin.postRaw('/api/Security/UpdateUserRole', {
    userId: salesUserId,
    roleName: 'SalesOrders',
    accessGranted: true,
  });
  expect(salesGrant.status, 'grant SalesOrders role').toBe(200);
  salesUser = await loginAs(salesAccount.email);
});

test.afterAll(async () => {
  if (admin?.token) {
    for (const userId of [profilesUserId, usersUserId, salesUserId].filter(Boolean)) {
      try {
        await admin.postRaw('/api/Security/DeleteUser', { userId });
      } catch {
        // Best-effort cleanup; the E2E database is disposable.
      }
    }
  }

  await profilesUser?.dispose();
  await usersUser?.dispose();
  await salesUser?.dispose();
  await admin?.dispose();
});

test('Anonymous requests are rejected with 401', async () => {
  const anonymous = await ApiClient.create();
  try {
    const customer = await anonymous.getRaw('/api/Customer/GetCustomerList');
    expect(customer.status).toBe(401);
    expect(customer.body.code).toBe(401);

    const logout = await anonymous.postRaw('/api/Security/Logout', { userId: 'anonymous' });
    expect(logout.status).toBe(401);
    expect(logout.body.code).toBe(401);
  } finally {
    await anonymous.dispose();
  }
});

test('Profiles-only user is denied CRM and user administration endpoints', async () => {
  const customer = await profilesUser.getRaw('/api/Customer/GetCustomerList');
  expect(customer.status).toBe(403);
  expect(customer.body.code).toBe(403);

  const userList = await profilesUser.getRaw('/api/Security/GetUserList');
  expect(userList.status).toBe(403);

  const create = await profilesUser.postRaw('/api/Security/CreateUser', {
    email: emailFor(uniqueFor('auth-denied')),
    password: USER_PASSWORD,
    confirmPassword: USER_PASSWORD,
    firstName: 'Denied',
    lastName: 'Attempt',
  });
  expect(create.status).toBe(403);

  const remove = await profilesUser.postRaw('/api/Security/DeleteUser', { userId: usersUserId });
  expect(remove.status).toBe(403);

  const selfRole = await profilesUser.postRaw('/api/Security/UpdateUserRole', {
    userId: profilesUserId,
    roleName: 'Users',
    accessGranted: true,
  });
  expect(selfRole.status).toBe(403);

  const resetPassword = await profilesUser.postRaw('/api/Security/UpdatePasswordUser', {
    userId: usersUserId,
    newPassword: `${USER_PASSWORD}-changed`,
  });
  expect(resetPassword.status).toBe(403);
});

test('Profiles-only user only reads and updates its own profile', async () => {
  const profile = await profilesUser.list<Record<string, any>>(
    'Security',
    `GetMyProfileList?userId=${adminId}`,
  );
  expect(profile.length).toBeGreaterThan(0);
  expect(profile[0].id).toBe(profilesUserId);

  const newFirstName = uniqueFor('ProfileFirst');
  const update = await profilesUser.postRaw('/api/Security/UpdateMyProfile', {
    userId: adminId,
    firstName: newFirstName,
    lastName: 'SelfOnly',
    companyName: 'E2E Caller Binding',
  });
  expect(update.status).toBe(200);

  const updatedProfile = await profilesUser.list<Record<string, any>>(
    'Security',
    `GetMyProfileList?userId=${adminId}`,
  );
  expect(updatedProfile[0].id).toBe(profilesUserId);
  expect(updatedProfile[0].firstName).toBe(newFirstName);

  const adminProfile = await admin.list<Record<string, any>>('Security', 'GetMyProfileList');
  expect(adminProfile[0].id).toBe(adminId);
  expect(adminProfile[0].firstName).toBe(adminFirstName);
});

test('Users-role user manages other users but not its own roles or the default admin', async () => {
  const userList = await usersUser.getRaw('/api/Security/GetUserList');
  expect(userList.status).toBe(200);

  const selfRole = await usersUser.postRaw('/api/Security/UpdateUserRole', {
    userId: usersUserId,
    roleName: 'Campaigns',
    accessGranted: true,
  });
  expect(selfRole.status).toBe(403);

  const otherRole = await usersUser.postRaw('/api/Security/UpdateUserRole', {
    userId: profilesUserId,
    roleName: 'Campaigns',
    accessGranted: true,
  });
  expect(otherRole.status).toBe(200);

  const adminReset = await usersUser.postRaw('/api/Security/UpdatePasswordUser', {
    userId: adminId,
    newPassword: `${USER_PASSWORD}-changed`,
  });
  expect(adminReset.status).toBe(403);

  const customer = await usersUser.getRaw('/api/Customer/GetCustomerList');
  expect(customer.status).toBe(403);
});

test('Partial module user keeps page lookups but cannot write or reach other modules', async () => {
  const allowed = [
    '/api/SalesOrder/GetSalesOrderList',
    '/api/Customer/GetCustomerList',
    '/api/Tax/GetTaxList',
    '/api/Product/GetProductList',
  ];
  for (const path of allowed) {
    const result = await salesUser.getRaw(path);
    expect(result.status, `GET ${path}`).toBe(200);
  }

  const denied = [
    '/api/Vendor/GetVendorList',
    '/api/PurchaseOrder/GetPurchaseOrderList',
  ];
  for (const path of denied) {
    const result = await salesUser.getRaw(path);
    expect(result.status, `GET ${path}`).toBe(403);
  }

  const createCustomer = await salesUser.postRaw('/api/Customer/CreateCustomer', {
    name: uniqueFor('DeniedCustomer'),
  });
  expect(createCustomer.status).toBe(403);
});

test('Role grants only take effect after the user signs in again', async () => {
  const beforeGrant = await profilesUser.getRaw('/api/Customer/GetCustomerList');
  expect(beforeGrant.status).toBe(403);

  const grant = await admin.postRaw('/api/Security/UpdateUserRole', {
    userId: profilesUserId,
    roleName: 'Customers',
    accessGranted: true,
  });
  expect(grant.status).toBe(200);

  const staleToken = await profilesUser.getRaw('/api/Customer/GetCustomerList');
  expect(staleToken.status).toBe(403);

  await profilesUser.login(profilesUserEmail, USER_PASSWORD);
  const refreshedToken = await profilesUser.getRaw('/api/Customer/GetCustomerList');
  expect(refreshedToken.status).toBe(200);
});
