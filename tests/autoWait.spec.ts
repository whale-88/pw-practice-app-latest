import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto(process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click()
})

test('auto wait1', async({page}) => {
    const successMessage = page.locator('.bg-success');

    await successMessage.waitFor({state: "attached"})
    const txt = await successMessage.allTextContents()

    expect(txt).toContain('Data loaded with AJAX get request.')
})

test('auto wait2', async({page}) => {
    const successMessage = page.locator('.bg-success');

    await expect(successMessage).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test('alternative waits', async({page}) => {
    const successMessage = page.locator('.bg-success');

    //wait for element
    // await page.waitForSelector('.bg-success')

    // wait for particular response
    // await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // wait for network calls to be completed (NOT RECOMMENDED)
    await page.waitForLoadState('networkidle')
})