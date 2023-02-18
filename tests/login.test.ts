import { chromium, test } from "@playwright/test"

test("Login test demo", async () => {
  const browser = await chromium.launch({
    headless: false//режим визуального отображения
  }) //запуск браузера

  const context = await browser.newContext() //создание нового контекста браузера в режиме инкогнито
  const page = await context.newPage()//новая вкладка браузера

  await page.goto("https://ecommerce-playground.lambdatest.io/")
  await page.hover("//a[@data-toggle='dropdown']//span[contains(.,'My account')]")
  // await page.click("text=Login")
  await page.click("'Login'")

  await page.fill("input[name='email']","koushik350@gmail.com")
  await page.fill("input[name='password']", "Pass123$")
  await page.click("input[value='Login']")

  await page.waitForTimeout(5000)

  const newContext = await browser.newContext()//создание нового контекста браузера в режиме инкогнито

  const newPage = await newContext.newPage()//новая вкладка браузера
  newPage.goto("https://ecommerce-playground.lambdatest.io/index.php?route=account/login")

  await newPage.waitForTimeout(5000)

})