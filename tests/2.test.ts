import { chromium, expect, test } from "@playwright/test"

const login = "SHETININM"
const password = "Asdf123$"


test("Авторизоваться под валидными данными пользователя.(test 2)", async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()


  //enter to OIB
  await page.goto("http://172.20.255.251:8080/authWeb/")
  await page.fill("input[placeholder='Логин']", login)
  await page.fill("input[type='password']", password)
  await page.click("//button[@type='button']//span[1]")


  const pagePromise = context.waitForEvent('page'); //ставим обработчик событий на открытие новой страницы
  await page.getByText("ОИБ").click() //клик на вкладку ОИБ в шоколадке
  const OIB_Page = await pagePromise;
  await OIB_Page.waitForLoadState();


  const title = OIB_Page.locator("//h4[text()='Пользователи']")
  await expect(title).toHaveText("Пользователи")

  //закрытие сессии
  await OIB_Page.click("//div[@class='el-dropdown']//div[1]") //user's menu
  await OIB_Page.click("//li[text()='Завершить работу']")
  await OIB_Page.click("(//button[contains(@class,'el-button el-button--default')])[2]")
  await page.click("//div[@class='ivu-poptip-rel']//button[1]")
  await page.click("//button[text()='Выйти']")

})