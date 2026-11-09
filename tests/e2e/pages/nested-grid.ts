import { expect, Locator, Page } from '@playwright/test';
import { escapeRegExp } from '../fixtures/data-factory';
import type { CrudListPage } from './crud-list-page';

export class NestedGrid {
  constructor(
    private readonly page: Page,
    private readonly root: Locator,
    private readonly owner: CrudListPage,
  ) {}

  row(productName: string): Locator {
    return this.root.locator('.e-row').filter({ hasText: productName }).first();
  }

  private toolbarItem(label: string): Locator {
    return this.root
      .locator('.e-toolbar-item')
      .filter({ hasText: new RegExp(`^\\s*${escapeRegExp(label)}\\s*$`) })
      .locator('button')
      .first();
  }

  private async clearSelection(): Promise<void> {
    await this.root.evaluate((element) => {
      const instances = (element as unknown as { ej2_instances?: Array<{ clearSelection?: () => void }> })
        .ej2_instances;
      instances?.[0]?.clearSelection?.();
    });
  }

  async selectRow(productName: string): Promise<void> {
    const row = this.row(productName);
    await expect(row).toBeVisible({ timeout: 30_000 });
    await this.clearSelection();
    await row.click();
    await expect(this.toolbarItem('Edit')).toBeEnabled({ timeout: 20_000 });
  }

  async expectRow(productName: string): Promise<void> {
    await expect(
      this.root.locator('.e-row').filter({ hasText: productName }),
      `Expected a nested grid row containing "${productName}"`,
    ).toHaveCount(1, { timeout: 30_000 });
  }

  async expectNoRow(productName: string): Promise<void> {
    await expect(
      this.root.locator('.e-row').filter({ hasText: productName }),
      `Expected no nested grid row containing "${productName}"`,
    ).toHaveCount(0, { timeout: 30_000 });
  }

  private async selectProduct(editRow: Locator, productName: string): Promise<void> {
    const dropdownIcon = editRow.locator('.e-ddl-icon').first();
    await expect(dropdownIcon).toBeVisible({ timeout: 20_000 });
    await this.page.waitForTimeout(600);

    let popup = this.page.locator('.e-popup.e-popup-open').last();
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await dropdownIcon.click();
      if (await popup.isVisible().catch(() => false)) {
        break;
      }
      const dropdownInput = editRow.locator('input.e-dropdownlist').first();
      await dropdownInput.click({ force: true }).catch(() => undefined);
      await this.page.keyboard.press('ArrowDown');
      await this.page.waitForTimeout(400);
      if (await popup.isVisible().catch(() => false)) {
        break;
      }
      await this.page.waitForTimeout(500);
    }
    await expect(popup).toBeVisible({ timeout: 20_000 });
    await this.page.waitForTimeout(600);
    const item = popup
      .locator('.e-list-item')
      .filter({ hasText: new RegExp(`^\\s*${escapeRegExp(productName)}\\s*$`) })
      .first();
    await expect(item).toBeVisible({ timeout: 20_000 });
    await item.click();
    await this.page.waitForTimeout(800);
    await expect(editRow.locator('input.e-dropdownlist')).toHaveValue(productName, { timeout: 10_000 });
    await expect(editRow.locator('input.e-numerictextbox').first()).not.toHaveValue('0.00', {
      timeout: 10_000,
    });
  }

  private async setQuantity(editRow: Locator, quantity: number): Promise<void> {
    const input = editRow.locator('input.e-numerictextbox').nth(1);
    await input.click();
    await input.press('Control+a');
    await input.pressSequentially(String(quantity));
    await input.press('Tab');
    await input.blur();
    await this.page.waitForTimeout(300);
    await expect(input).toHaveValue(new RegExp(`^${quantity}(\\.0+)?$`), { timeout: 10_000 });
  }

  private async waitForAction(expectedTitle: string): Promise<void> {
    await this.owner.waitForSwalTitle(expectedTitle);
    await this.page
      .waitForFunction(() => !document.querySelector('.swal2-popup'), null, { timeout: 30_000 })
      .catch(() => undefined);
  }

  async addItem(productName: string, quantity: number): Promise<void> {
    await this.toolbarItem('Add').click();
    const editRow = this.root.locator('.e-row.e-addedrow, .e-row.e-editedrow').last();
    await expect(editRow).toBeVisible({ timeout: 20_000 });
    await this.page.waitForTimeout(500);
    await this.selectProduct(editRow, productName);
    await this.setQuantity(editRow, quantity);
    await this.owner.resetSwalTitles();
    await this.toolbarItem('Update').click();
    await this.waitForAction('Save Successful');
    await this.expectRow(productName);
  }

  async editItem(productName: string, quantity: number): Promise<void> {
    await this.selectRow(productName);
    await this.toolbarItem('Edit').click();
    const editRow = this.root.locator('.e-row.e-editedrow').last();
    await expect(editRow).toBeVisible({ timeout: 20_000 });
    await this.page.waitForTimeout(500);
    await this.setQuantity(editRow, quantity);
    await this.owner.resetSwalTitles();
    await this.toolbarItem('Update').click();
    await this.waitForAction('Save Successful');
    await this.expectRow(productName);
  }

  async deleteItem(productName: string): Promise<void> {
    await this.selectRow(productName);
    await this.toolbarItem('Delete').click();
    const dialog = this.page.locator('.e-dialog:visible').last();
    await expect(dialog).toBeVisible({ timeout: 20_000 });
    await this.owner.resetSwalTitles();
    await dialog.getByRole('button', { name: 'OK', exact: true }).click();
    await this.waitForAction('Delete Successful');
    await this.expectNoRow(productName);
  }
}
