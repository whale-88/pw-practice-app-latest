import {test, expect} from '@playwright/test'

test('radio buttons', async({page}, testInfo) =>{

    await page.goto('/')
    if(testInfo.project.name == 'mobile'){
        await page.locator('.sidebar-toggle').click()
    }
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    if(testInfo.project.name == 'mobile'){
        await page.locator('.sidebar-toggle').click()
    }

    const gridForm = await page.locator('nb-card', {hasText: "Using the Grid"})

    // await gridForm.getByLabel('Option 1').check({force: true})
    await gridForm.getByRole('radio', {name: 'Option 1'}).check({force: true})
    const radioStatus = await gridForm.getByRole('radio', {name: 'Option 1'}).isChecked()
    expect(radioStatus).toBeTruthy()
    
    //same as above but for locator
    await expect(gridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked()

    await gridForm.getByRole('radio', {name: 'Option 2'}).check({force: true})
    expect(await gridForm.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy()
    expect(await gridForm.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy()
    // expect(true).toEqual(false)
})