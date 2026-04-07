import { expect, Locator, Page } from '@playwright/test';

export interface DocumentationPageOptions {
  expectedUrlPattern?: RegExp;
  expectedHeading?: string | RegExp;
  requireTableOfContents?: boolean;
  requireBreadcrumbs?: boolean;
}

/**
 * Page object for documentation pages.
 *
 * Important:
 * - This object validates only the documentation page contract.
 * - It intentionally does NOT validate the global navigation menu.
 * - Header / main nav checks should live in a dedicated Navigation component/page object.
 */
export class DocumentationPage {
  readonly page: Page;
  readonly main: Locator;
  readonly primaryHeading: Locator;
  readonly article: Locator;
  readonly breadcrumbs: Locator;
  readonly tableOfContents: Locator;

  constructor(page: Page) {
    this.page = page;
    this.main = page.locator('main');
    this.primaryHeading = page.getByRole('heading', { level: 1 }).first();
    this.article = page.locator('article').first();
    this.breadcrumbs = page.getByRole('navigation', { name: /breadcrumb/i });
    this.tableOfContents = page.getByRole('navigation', { name: /on this page|contents/i });
  }

  async verifyDocumentationControlReady(options: DocumentationPageOptions = {}): Promise<void> {
    const {
      expectedUrlPattern = /\/docs\//,
      expectedHeading,
      requireTableOfContents = false,
      requireBreadcrumbs = false,
    } = options;

    await expect(this.page).toHaveURL(expectedUrlPattern);
    await expect(this.main).toBeVisible();
    await expect(this.primaryHeading).toBeVisible();

    if (expectedHeading !== undefined) {
      await expect(this.primaryHeading).toContainText(expectedHeading);
    }

    // Article is optional on some docs implementations, so verify it only if present.
    if (await this.article.count()) {
      await expect(this.article).toBeVisible();
    }

    if (requireBreadcrumbs) {
      await expect(this.breadcrumbs).toBeVisible();
    }

    if (requireTableOfContents) {
      await expect(this.tableOfContents).toBeVisible();
    }
  }

  async open(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async verifyHeading(expectedHeading: string | RegExp): Promise<void> {
    await expect(this.primaryHeading).toBeVisible();
    await expect(this.primaryHeading).toContainText(expectedHeading);
  }

  async verifyMainContentContains(text: string | RegExp): Promise<void> {
    await expect(this.main).toBeVisible();
    await expect(this.main).toContainText(text);
  }
}