import { test, expect } from '@playwright/test';
import { DocumentationPage } from '../src/pages/DocumentationPageRefactored';

test.describe('Documentation', () => {
  test('should open documentation page and display content', async ({ page }) => {
    const documentationPage = new DocumentationPage(page);

    await page.goto('/docs/intro');

    await documentationPage.verifyDocumentationControlReady({expectedHeading: /installation|introduction/i});
  });
});

