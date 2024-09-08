import {test, expect} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import { faker } from '@faker-js/faker'

test.beforeEach(async({page}) => {
    await page.goto('/')
})

test('navigate to form page', async({page}) => {

    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
    await pm.navigateTo().smartTablePage()
    
})

test('parametrized methods', async({page}) => {

    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
    //make and save a screenshot
    await page.screenshot({path: 'screenshots/formsLayoutsPage.png'})
    //make a screenshot and save it as a binary to send it to 3d party etc
    const buffer = await page.screenshot()
    console.log(buffer.toString('base64'))
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
    //make a screenshot of particular area
    await page.locator('nb-card', {hasText: 'Inline form'}).screenshot({path: 'screenshots/inlineForm.png'})
    await pm.navigateTo().datepickerPage()
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(100)
    await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(1, 14)
})

test.only('testing with ci', async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
})