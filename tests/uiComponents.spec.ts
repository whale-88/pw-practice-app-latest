import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:4200/')
})

test.describe.only('Form Layouts page', () =>{
    test.describe.configure({retries: 2})

    test.beforeEach(async({page}) =>{
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('radio buttons', async({page}) =>{
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
})

test('checkboxes', async({page}) =>{
    await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()

        await page.getByRole('checkbox', {name: 'Hide on click'}).click({force: true})
        await page.getByRole('checkbox', {name: 'Hide on click'}).check({force: true})
        await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force: true})

        const allCheckboxes = page.getByRole('checkbox')
        for(const box of await allCheckboxes.all()){ //adding .all() to convert it to array
            await box.check({force: true})

            await expect(box).toBeChecked()
            expect(await box.isChecked()).toBeTruthy
        }
})

test('dropdowns & lists', async({page}) => {
    const dropdownMenu = page.locator('ngx-header nb-select')
    await dropdownMenu.click()

    page.getByRole('list') //for UL tag - represents parent container for entire list
    page.getByRole('listitem') //for li tag - represents all the items from the list (array/list of items)

    // const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('ul nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText: "Cosmic"}).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dropdownMenu.click()
    for(const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color != "Corporate")
            await dropdownMenu.click()
    }
})

test('tooltips', async({page}) =>{
    
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    //use F8 to pause browser and search for tooltip
    const tooltipPlacements = page.locator('nb-card', {hasText: "Tooltip Placements"})
    await tooltipPlacements.getByRole('button', {name: "Top"}).hover()
    const tooltip = page.locator('nb-tooltip', {hasText: "This is a tooltip"})
    await expect(tooltip).toHaveText("This is a tooltip")
})

test('dialog box', async({page}) =>{
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    await page.locator('table tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    const rows = page.locator('table tr')
    for(const row of await rows.all()){
        await expect(row).not.toContainText('mdo@gmail.com')
    }
})

test('web tables', async({page}) =>{
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //get row by any text in the row
    const targetRow = page.getByRole('row', {name: "mdo@gmail.com"})
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()

    //get row based on the value in the specific column
    await page.locator('.ng2-smart-pagination').getByText('2').click()
    const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    //to filte set of values in a table and loop through all raws returned and asssert the value
    const ages = ["20", "30", "40", "100"]

    for(let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')

        for(let row of await ageRows.all()){
            const cellValue = await row.locator('td').last().textContent()

            if(age == "100"){
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            } else {
                expect(cellValue).toEqual(age)
            }
        }
    }
})

test('datepicker', async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarField = page.getByPlaceholder('Form Picker')
    await calendarField.click()

    let date = new Date()
    date.setDate(date.getDate() + 0)
    const expectedDate = date.getDate().toString()

    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`

    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
    await expect(calendarField).toHaveValue(dateToAssert)
})

test('sliders with Update attributes', async({page}) =>{

    //Update attribute
    const tempSlider = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempSlider.evaluate(sliderCoordinates => {
        sliderCoordinates.setAttribute('cx', '232.63098833543773')
        sliderCoordinates.setAttribute('cy', '232.63098833543773')
    })
    await tempSlider.click()
})

test('sliders with mouse movement', async({page}) =>{
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    // to set mouse in the middle of the box
    const x = box.x + box.width / 2
    const y = box.y + box.width / 2

    //to move mouse in either direction
    await page.mouse.move(x, y)
    // mouse.down() & up() used to click and release mouse button
    await page.mouse.down()
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')

})




