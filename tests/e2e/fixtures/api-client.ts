import { APIRequestContext, request } from '@playwright/test';

export const BASE_URL = process.env.CRM_BASE_URL ?? 'http://localhost:5055';
export const ADMIN_EMAIL = process.env.CRM_ADMIN_EMAIL ?? 'admin@root.com';
export const ADMIN_PASSWORD = process.env.CRM_ADMIN_PASSWORD ?? '123456';

export type LoginData = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  accessToken: string;
  refreshToken: string;
  roles: string[];
  menuNavigation: Array<Record<string, unknown>>;
  avatar?: string | null;
};

type Envelope<T> = {
  code?: number;
  message?: string;
  content?: { data?: T };
};

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  token?: string;
  user?: LoginData;

  private constructor(private readonly http: APIRequestContext) {}

  static async create(): Promise<ApiClient> {
    const http = await request.newContext({ baseURL: BASE_URL, timeout: 120_000 });
    return new ApiClient(http);
  }

  get adminId(): string {
    if (!this.user?.userId) {
      throw new Error('ApiClient must be logged in before adminId is used');
    }
    return this.user.userId;
  }

  async login(email = ADMIN_EMAIL, password = ADMIN_PASSWORD): Promise<LoginData> {
    const response = await this.http.post('/api/Security/Login', { data: { email, password } });
    const body = await this.parse<LoginData>(response);
    if (body.code !== 200 || !body.content?.data) {
      throw new ApiError(response.status(), `Login failed for ${email}: ${JSON.stringify(body)}`, body);
    }
    this.user = body.content.data;
    this.token = this.user.accessToken;
    return this.user;
  }

  async loginWithPassword(email: string, password: string): Promise<Envelope<LoginData>> {
    const response = await this.http.post('/api/Security/Login', { data: { email, password } });
    return this.parse<LoginData>(response);
  }

  async get<T>(path: string): Promise<T> {
    const response = await this.http.get(path, { headers: this.headers() });
    return this.unwrap<T>(response);
  }

  async post<T>(path: string, data: unknown): Promise<T> {
    const response = await this.http.post(path, { data, headers: this.headers() });
    return this.unwrap<T>(response);
  }

  async getRaw(path: string) {
    const response = await this.http.get(path, { headers: this.headers() });
    return {
      status: response.status(),
      body: (await this.parse<unknown>(response)) as Envelope<unknown>,
    };
  }

  async postRaw(path: string, data: unknown) {
    const response = await this.http.post(path, { data, headers: this.headers() });
    return {
      status: response.status(),
      body: (await this.parse<unknown>(response)) as Envelope<unknown>,
    };
  }

  async list<T = Record<string, unknown>>(controller: string, action: string): Promise<T[]> {
    const result = await this.get<T[] | { data?: T[] }>(`/api/${controller}/${action}`);
    if (Array.isArray(result)) {
      return result;
    }
    return result?.data ?? [];
  }

  async find<T = Record<string, unknown>>(
    controller: string,
    action: string,
    field: string,
    value: string,
  ): Promise<T | undefined> {
    const rows = await this.list<T>(controller, action);
    return rows.find((row) => String((row as Record<string, unknown>)[field]) === value);
  }

  async dispose(): Promise<void> {
    await this.http.dispose();
  }

  headers(): Record<string, string> {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  private async unwrap<T>(response: Awaited<ReturnType<APIRequestContext['get']>>): Promise<T> {
    const body = await this.parse<T>(response);
    if (body.code !== 200) {
      throw new ApiError(response.status(), `${response.url()} -> ${body.code ?? response.status()}: ${body.message ?? 'unknown error'}`, body);
    }
    return body.content?.data as T;
  }

  private async parse<T>(response: Awaited<ReturnType<APIRequestContext['get']>>): Promise<Envelope<T>> {
    const text = await response.text();
    if (!text) {
      return { code: response.status(), message: response.statusText() };
    }
    try {
      return JSON.parse(text) as Envelope<T>;
    } catch {
      throw new ApiError(response.status(), `Non-JSON response from ${response.url()} (${response.status()}): ${text.slice(0, 300)}`);
    }
  }
}
