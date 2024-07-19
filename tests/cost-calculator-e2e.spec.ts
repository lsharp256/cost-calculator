import { test, expect } from '@playwright/test';


test.describe('Calculate Employee Cost', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Accept').click();
        await page.getByRole('button', { name: 'Resources' }).hover();
        await page.getByRole('link', { name: 'Cost Calculator Determine the' }).click();
        await page.getByPlaceholder('Select a country').click();
      });
    test.afterEach(async ({ page }) => {
        await page.close();
    });

    test('test monthly cost calculation', async ({ page }) => {
        await page.getByRole('option', { name: 'Australia (AU)' }).click();
        await page.getByPlaceholder('Select Currency').click();
        await page.getByRole('option', { name: 'AUD' }).click();
        await page.getByRole('spinbutton').fill('10000');
        await page.getByRole('button', { name: 'Get Quote' }).click();
        await page.getByRole('row', { name: 'Employer Estimated Taxes &' }).locator('a').click();
        await expect(page.locator('#react-target')).toContainText('Hiring in Australia');
        await expect(page.getByRole('cell', { name: 'A$ 11,293' })).toBeVisible();
      });
      
      test('test annual cost calculation', async ({page}) => {
        await page.getByRole('option', { name: 'Australia (AU)' }).click();
        await page.getByPlaceholder('Select Currency').click();
        await page.getByRole('option', { name: 'AUD' }).click();
        await page.getByRole('button', { name: 'Annual' }).click();
        await page.getByRole('spinbutton').click();
        await page.getByRole('spinbutton').fill('100000');
        await page.getByRole('button', { name: 'Get Quote' }).click();
        await expect(page.locator('#react-target')).toContainText('Hiring in Australia');
        await expect(page.getByRole('cell', { name: 'A$ 112,927' })).toBeVisible();
      });

      // if salary input is empty, Cost calculation should not be displayed
      test('validation on salary input', async ({page}) => {
        await page.getByText('Australia (AU)').click();
        await page.getByPlaceholder('Select Currency').click();
        await page.getByRole('option', { name: 'AUD' }).click();
        await page.getByRole('spinbutton').fill('');
        await page.locator('div').filter({ hasText: /^Get Quote$/ }).click();
        await expect(page.getByText('Your Quote Will Show Up Here')).toBeVisible();
      });

      test('validation on net salary', async ({page}) => {
        await page.getByText('Australia (AU)').click();
        await page.locator('div:nth-child(3) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root').first().click();
        await page.getByRole('option', { name: 'AUD' }).click();
        await page.locator('a').filter({ hasText: 'Net Salary*' }).click();
        await page.frameLocator('iframe[title="Form 0"]').getByPlaceholder('Business email*').fill('test@gmail.com');
        await expect(page.frameLocator('iframe[title="Form 0"]').getByRole('listitem')).toContainText('Please enter a different email address. This form does not accept addresses from gmail.com.');
        await page.frameLocator('iframe[title="Form 0"]').getByPlaceholder('Business email*').clear();
        await page.frameLocator('iframe[title="Form 0"]').getByRole('button', { name: 'Get In Touch' }).click();
        const errorMessages = page.frameLocator('iframe[title="Form 0"]').getByText('Please complete this required field.');
        const numberOfErrors = await errorMessages.count();
        await expect(numberOfErrors).toBe(3);
      });
      
      test('validation on cost to employer', async ({page}) => {
        await page.getByText('Australia (AU)').click();
        await page.locator('div:nth-child(3) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root').first().click();
        await page.getByRole('option', { name: 'AUD' }).click();
        await page.locator('a').filter({ hasText: 'Cost to Employer*' }).click();
        await page.frameLocator('iframe[title="Form 0"]').getByPlaceholder('Business email*').fill('test@gmail.com');
        await expect(page.frameLocator('iframe[title="Form 0"]').getByRole('listitem')).toContainText('Please enter a different email address. This form does not accept addresses from gmail.com.');
        await page.frameLocator('iframe[title="Form 0"]').getByPlaceholder('Business email*').clear();
        await page.frameLocator('iframe[title="Form 0"]').getByRole('button', { name: 'Get In Touch' }).click();
        const errorMessages = page.frameLocator('iframe[title="Form 0"]').getByText('Please complete this required field.');
        const numberOfErrors = await errorMessages.count();
        await expect(numberOfErrors).toBe(3);
      });
})