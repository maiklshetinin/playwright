import { test, expect } from "@playwright/test"
test("handling alerts", async ({ page }) => {
  await page.goto("https://www.lambdatest.com/selenium-playground/javascript-alert-box-demo")

  page.on("dialog", async (alert) => {
    // const text = alert.message()
    const text = alert.defaultValue()
    console.log(text);
    // await alert.dismiss()
     await alert.accept("koushik")
  })
  await page.locator("button:has-text('Click Me')").nth(2).click()
  // expect(page.locator("#confirm-demo")).toContainText("Cancel!")
  expect(page.locator("#prompt-demo")).toContainText("'koushik'")


})

test.only("Modal alert", async({page})=>{

  await page.goto("https://www.lambdatest.com/selenium-playground/bootstrap-modal-demo")
  await page.click("//button[@data-target='#myModal']")
  await page.click("(//button[text()='Save Changes'])[1]")
  
})