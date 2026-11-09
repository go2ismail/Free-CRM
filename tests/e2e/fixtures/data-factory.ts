export const RUN_ID = `${new Date()
  .toISOString()
  .replace(/[-:.TZ]/g, '')
  .slice(0, 14)}-${Math.random().toString(36).slice(2, 6)}`;

let sequence = 0;

export function uniqueFor(module: string): string {
  sequence += 1;
  return `E2E-${module}-${RUN_ID}-${sequence}`;
}

export function emailFor(value: string): string {
  return `${value.toLowerCase()}@example.com`;
}

export const E2E_DESCRIPTION = 'Created by the automated E2E suite';

export const DATES = {
  start: '2026-11-01',
  finish: '2026-12-31',
  budget: '2026-11-02',
  expense: '2026-11-03',
  prospecting: '2026-11-05',
  closingEstimate: '2026-12-15',
  closingActual: '2026-12-20',
  activityFrom: '2026-11-06',
  activityTo: '2026-11-07',
  order: '2026-11-08',
};

export const USER_PASSWORD = 'E2Epass123!';

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
