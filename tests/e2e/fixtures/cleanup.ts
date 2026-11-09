import type { ApiClient } from './api-client';
import { emailFor } from './data-factory';
import type { ModuleDef, ModuleContext } from './modules';

export function uniqueValueFor(def: ModuleDef, ctx: ModuleContext): string {
  if (def.key === 'users') {
    return emailFor(ctx.unique);
  }
  return ctx.unique;
}

export async function findRecordByValue(
  api: ApiClient,
  def: ModuleDef,
  value: string,
): Promise<Record<string, any> | undefined> {
  const rows = await api.list<Record<string, any>>(def.controller, def.listAction);
  return rows.find((row) => String(row[def.uniqueField]) === value);
}

export async function findRecord(
  api: ApiClient,
  def: ModuleDef,
  ctx: ModuleContext,
): Promise<Record<string, any> | undefined> {
  return findRecordByValue(api, def, uniqueValueFor(def, ctx));
}

export async function cleanupRecord(api: ApiClient, def: ModuleDef, ctx: ModuleContext): Promise<void> {
  const candidates = Array.from(new Set([uniqueValueFor(def, ctx), ctx.edit]));
  for (const value of candidates) {
    try {
      const record = await findRecordByValue(api, def, value);
      if (!record) {
        continue;
      }
      if (def.softDelete && record.isDeleted) {
        continue;
      }
      await api.post(`/${def.controller}/${def.deleteAction}`, def.apiDelete(record, ctx));
    } catch {
      // Best-effort cleanup. The disposable E2E database is reset between runs.
    }
  }
}
