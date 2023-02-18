import { test } from "@playwright/test"

test("handling dropdown", async ({ page }) => {

    await page.goto("https://www.lambdatest.com/selenium-playground/select-dropdown-demo")
    await page.selectOption("#select-demo", {
        // label: "Tuesday"
        // value:"Friday"
        index: 5
    })




    await page.waitForTimeout(3000)

    await page.selectOption("#multi-select", [
        {
            label: "Texas"
        }, {
            index: 2
        }, {
            value: "Washington"
        }
    ])

})

test("Bootstrap dropdown", async ({ page }) => {
    await page.goto("https://www.lambdatest.com/selenium-playground/jquery-dropdown-search-demo")
    await selectCountry("Denmark")
    await selectCountry("India")
    await selectCountry("South Africa")
    async function selectCountry(countryName:string) {

        await page.click("#country+span")
        await page.locator("ul#select2-country-results")
            .locator("li", {
                hasText: countryName
            }).click()
    }

})