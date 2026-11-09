import { expect, Locator, Page } from '@playwright/test';
import { escapeRegExp } from '../fixtures/data-factory';
import type { FieldSpec, ModuleDef, ModuleContext } from '../fixtures/modules';

export type SaveOptions = { keepOpen?: boolean };

export class CrudListPage {
  readonly grid: Locator;
  readonly modal: Locator;

  constructor(
    readonly page: Page,
    readonly def: ModuleDef,
  ) {
    this.grid = page.locator('.e-grid').first();
    this.modal = page.locator('#MainModal');
  }

  async goto(): Promise<void> {
    const listResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        response.url().includes(`/api/${this.def.controller}/${this.def.listAction}`),
      { timeout: 60_000 },
    );
    await this.page.goto(this.def.route, { waitUntil: 'domcontentloaded' });
    await listResponse;
    await this.page.waitForFunction(() => !document.querySelector('#app')?.hasAttribute('v-cloak'));
    await expect(this.grid.locator('.e-gridheader')).toBeVisible({ timeout: 60_000 });
    await this.showAllRows();
    await this.waitForModalWidgets();
  }

  async showAllRows(): Promise<void> {
    await this.grid.evaluate((element) => {
      const grid = (
        element as unknown as {
          ej2_instances?: Array<{
            pageSettings?: { pageSize?: number };
            refresh?: () => void;
          }>;
        }
      ).ej2_instances?.[0];
      if (grid?.pageSettings && grid.pageSettings.pageSize && grid.pageSettings.pageSize < 1000) {
        grid.pageSettings.pageSize = 1000;
        grid.refresh?.();
      }
    });
    await this.page.waitForTimeout(300);
  }

  async waitForModalWidgets(): Promise<void> {
    const dropdowns = this.def.fields.filter((field) => field.kind === 'dropdown').length;
    if (dropdowns === 0) {
      return;
    }
    await this.page.waitForFunction(
      (expected) => document.querySelectorAll('#MainModal .e-ddl').length >= expected,
      dropdowns,
      { timeout: 60_000 },
    );
  }

  async openAdd(): Promise<void> {
    await this.page.locator('#AddCustom').click();
    await expect(this.modal).toBeVisible();
    await this.page.waitForTimeout(300);
  }

  async selectRow(text: string): Promise<void> {
    const row = this.grid.locator('.e-row').filter({ hasText: text }).first();
    await expect(row).toBeVisible({ timeout: 30_000 });
    await this.grid.evaluate((element) => {
      const instances = (element as unknown as { ej2_instances?: Array<{ clearSelection?: () => void }> })
        .ej2_instances;
      instances?.[0]?.clearSelection?.();
    });
    await row.click();
    await expect(this.page.locator('#EditCustom')).toBeEnabled({ timeout: 20_000 });
  }

  async openEdit(text: string): Promise<void> {
    await this.selectRow(text);
    await this.page.locator('#EditCustom').click();
    await expect(this.modal).toBeVisible();
    await this.page.waitForTimeout(400);
  }

  async openDelete(text: string): Promise<void> {
    await this.selectRow(text);
    await this.page.locator('#DeleteCustom').click();
    await expect(this.modal).toBeVisible();
    await this.page.waitForTimeout(400);
  }

  async fillFields(fields: FieldSpec[], ctx: ModuleContext): Promise<void> {
    for (const field of fields) {
      const value = field.value(ctx);
      switch (field.kind) {
        case 'text':
        case 'textarea':
          await this.fillText(field.label, String(value));
          break;
        case 'number':
          await this.fillNumber(field.label, Number(value));
          break;
        case 'date':
          await this.fillDate(field.label, String(value));
          break;
        case 'dropdown':
          await this.selectDropdown(field.label, String(value));
          break;
        case 'checkbox':
          await this.setCheckbox(field.label, Boolean(value));
          break;
      }
    }
  }

  async fieldContainer(label: string): Promise<Locator> {
    const labelLocator = this.modal
      .locator('label')
      .filter({ hasText: new RegExp(`^\\s*${escapeRegExp(label)}\\s*$`) })
      .first();
    await expect(labelLocator).toBeVisible({ timeout: 20_000 });

    let container = labelLocator.locator('xpath=..');
    for (let depth = 0; depth < 4; depth += 1) {
      const count = await container
        .locator('input:not([type=hidden]), textarea, .e-input-group')
        .count();
      if (count > 0) {
        return container;
      }
      container = container.locator('xpath=..');
    }
    throw new Error(`Could not find an input container for label "${label}"`);
  }

  private async inputFor(label: string): Promise<Locator> {
    const container = await this.fieldContainer(label);
    return container.locator('input:not([type=hidden]), textarea').first();
  }

  async fillText(label: string, value: string): Promise<void> {
    const input = await this.inputFor(label);
    await input.fill(value);
    await input.press('Tab');
    await input.blur();
    await expect(input).toHaveValue(value, { timeout: 10_000 });
  }

  async fillNumber(label: string, value: number): Promise<void> {
    const input = await this.inputFor(label);
    await input.fill(String(value));
    await input.press('Tab');
    await input.blur();
    await this.page.waitForTimeout(150);
  }

  async fillDate(label: string, value: string): Promise<void> {
    const input = await this.inputFor(label);
    await input.fill(value);
    await input.press('Enter');
    await input.press('Tab');
    await input.blur();
    await expect(input).toHaveValue(value, { timeout: 10_000 });
  }

  async selectDropdown(label: string, optionText: string): Promise<void> {
    const container = await this.fieldContainer(label);
    const input = container.locator('input').first();
    const exact = new RegExp(`^\\s*${escapeRegExp(optionText)}\\s*$`);

    for (let attempt = 0; attempt < 2; attempt += 1) {
      await container.locator('.e-ddl-icon').first().click();
      const popup = this.page.locator('.e-popup.e-popup-open').last();
      await expect(popup).toBeVisible({ timeout: 20_000 });
      await this.page.waitForTimeout(600);

      const item = popup.locator('.e-list-item').filter({ hasText: exact }).first();
      if ((await item.count()) > 0) {
        await item.click();
        await this.page.waitForTimeout(500);
        if ((await input.inputValue()) === optionText) {
          return;
        }
      }

      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(200);
      await container.locator('.e-ddl-icon').first().click();
      await expect(this.page.locator('.e-popup.e-popup-open').last()).toBeVisible({ timeout: 10_000 });
      await this.page.waitForTimeout(300);
      await this.page.keyboard.type(optionText);
      await this.page.waitForTimeout(300);
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(500);
      if ((await input.inputValue()) === optionText) {
        return;
      }
      await this.page.keyboard.press('Escape');
    }

    throw new Error(`Could not select dropdown "${label}" with option "${optionText}"`);
  }

  async setCheckbox(label: string, checked: boolean): Promise<void> {
    const labelLocator = this.modal
      .locator('label')
      .filter({ hasText: new RegExp(`^\\s*${escapeRegExp(label)}\\s*$`) })
      .first();
    await expect(labelLocator).toBeVisible({ timeout: 20_000 });
    const forId = await labelLocator.getAttribute('for');
    const input = forId
      ? this.modal.locator(`#${forId}`)
      : (await this.fieldContainer(label)).locator('input[type=checkbox]').first();
    if (checked) {
      await input.check();
    } else {
      await input.uncheck();
    }
    await expect(input).toBeChecked({ checked });
  }

  async setEditField(label: string, kind: 'text' | 'dropdown', value: string): Promise<void> {
    if (kind === 'dropdown') {
      await this.selectDropdown(label, value);
    } else {
      await this.fillText(label, value);
    }
  }

  async save(expectedTitle: string, options: SaveOptions = {}): Promise<void> {
    await this.installSwalObserver();
    await this.page.evaluate(() => {
      (window as unknown as { __e2eSwalTitles?: string[] }).__e2eSwalTitles = [];
    });

    await this.page.locator('#MainSaveButton').click();
    await this.waitForSwalTitle(expectedTitle);

    if (options.keepOpen) {
      await this.page
        .waitForFunction(() => !document.querySelector('.swal2-popup'), null, { timeout: 30_000 })
        .catch(() => undefined);
      return;
    }

    let closed = false;
    try {
      await this.modal.waitFor({ state: 'hidden', timeout: 8_000 });
      closed = true;
    } catch {
      closed = false;
    }

    if (!closed && (await this.modal.isVisible())) {
      const close = this.modal.locator('.modal-footer button[data-bs-dismiss="modal"]');
      if (await close.isVisible()) {
        await close.click();
      }
    }
    await expect(this.modal).toBeHidden({ timeout: 20_000 });
  }

  async waitForSwalTitle(expectedTitle: string): Promise<void> {
    await this.installSwalObserver();
    await this.page.waitForFunction(
      () => {
        const titles = (window as unknown as { __e2eSwalTitles?: string[] }).__e2eSwalTitles;
        return Array.isArray(titles) && titles.length > 0;
      },
      null,
      { timeout: 120_000 },
    );
    const titles = await this.page.evaluate(
      () => (window as unknown as { __e2eSwalTitles?: string[] }).__e2eSwalTitles ?? [],
    );
    expect(titles.join(' | '), `Expected "${expectedTitle}" but saw: ${titles.join(' | ')}`).toContain(
      expectedTitle,
    );
  }

  async resetSwalTitles(): Promise<void> {
    await this.installSwalObserver();
    await this.page.evaluate(() => {
      (window as unknown as { __e2eSwalTitles?: string[] }).__e2eSwalTitles = [];
    });
  }

  private async installSwalObserver(): Promise<void> {
    await this.page.evaluate(() => {
      const target = window as unknown as {
        __e2eSwalTitles?: string[];
        __e2eSwalObserver?: MutationObserver;
      };
      target.__e2eSwalTitles = target.__e2eSwalTitles ?? [];
      if (target.__e2eSwalObserver) {
        return;
      }
      const record = () => {
        document.querySelectorAll('.swal2-popup').forEach((popup) => {
          const title = popup.querySelector('.swal2-title')?.textContent?.trim();
          const titles = target.__e2eSwalTitles ?? [];
          if (title && !titles.includes(title)) {
            titles.push(title);
          }
          target.__e2eSwalTitles = titles;
        });
      };
      const observer = new MutationObserver(record);
      observer.observe(document.body, { childList: true, subtree: true });
      target.__e2eSwalObserver = observer;
      record();
    });
  }

  async saveKeepOpen(expectedTitle: string): Promise<void> {
    await this.save(expectedTitle, { keepOpen: true });
  }

  async closeModal(): Promise<void> {
    if (await this.modal.isVisible()) {
      const close = this.modal.locator('.modal-footer button[data-bs-dismiss="modal"]');
      if (await close.isVisible()) {
        await close.click();
      }
    }
    await expect(this.modal).toBeHidden({ timeout: 20_000 });
  }

  async expectRow(text: string): Promise<void> {
    await expect(
      this.grid.locator('.e-row').filter({ hasText: text }),
      `Expected a grid row containing "${text}"`,
    ).toHaveCount(1, { timeout: 30_000 });
  }

  async expectNoRow(text: string): Promise<void> {
    await expect(
      this.grid.locator('.e-rowcell').filter({ hasText: new RegExp(`^\\s*${escapeRegExp(text)}\\s*$`) }),
      `Expected no grid cell with the exact text "${text}"`,
    ).toHaveCount(0, { timeout: 30_000 });
  }
}
