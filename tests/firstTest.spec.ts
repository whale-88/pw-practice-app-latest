import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto('/')
    await page.getByText('Forms').click()
await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', ({page}) => {
    //by Tag name
    page.locator('input')

    //by ID
    page.locator('#inputEmail1')

    //by Class
    page.locator('.shape-rectangle')

    //by Attribute
    page.locator('[placeholder="Email"]')

    //by Class FULL value
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //by combining different selector
    page.locator('input[laceholder="Email"] [nbinput]')

    //by XPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]')

    //by Partial Text match
    page.locator(':text("Using")')

    //by Exact Text match
    page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async({page}) => {
    // await page.getByRole('radio', {name: "Option 1"}).click()

    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').nth(0).click()
    
    await page.getByPlaceholder('Jane Doe').click()
    
    await page.getByText('Option 1').click()
    
    await page.getByTitle('IoT Dashboard').click()
})

test('Locating child elements', async({page}) => {
   await page.locator('nb-card nb-radio :text("Option 1")').click()
   await page.locator('nb-card').locator('nb-radio').locator(':text("Option 2")').click()
   await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()
   await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('Locating parent elements', async({page}) =>{
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {hasText: "Inline form"}).locator('[class="custom-checkbox"]').click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click() 
})

test('Reusing the locators', async({page}) => {

    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Pass123')
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')
})

test('Extracting values', async({page}) =>{
    //single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.getByRole('button').textContent()
    expect(buttonText).toEqual('Submit')

    //all text values
    const allRadioLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioLabels).toContain("Option 1")

    //input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

test('Assertions', async({page}) =>{
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('button')

    //General assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual('Submit')

    //Locator assertion
    await expect(basicFormButton).toHaveText('Submit')

    //Soft assertion
    await expect.soft(basicFormButton).toHaveText('Submit5')
    await basicFormButton.click()
})