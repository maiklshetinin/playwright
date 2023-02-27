import { test, expect, chromium } from "@playwright/test";
import OIB, { UserMenu } from "./OIB";

const login = "SHETININM"
const password = "Asdf123$"

test("Change user password (test 4.1)", async ({ page }) => {

  const OIB_Page = new OIB(page)
  await OIB_Page.login(login, password)

  //----------------------------------------------------------------------------------------test1

  //1. Открыть меню пользователя. Выбрать  пункт «Сменить пароль».
  await OIB_Page.click(UserMenu.BTN_USER_MENU)
  await OIB_Page.click(UserMenu.change_password)
  //1. Откроется окно для обновления текущего пароля
  expect(page.getByText("Изменение пароля")).toBeVisible()

  //----------------------------------------------------------------------------------------test2

  //   2. Заполнить все доступные поля:
  // - старый пароль
  await page.fill("input[placeholder='старый пароль']", password)
  // - новый пароль
  await page.fill("(//span[text()='Новый пароль:']/following::input)[1]", `${password}$`)
  // - повтор нового пароля
  await page.fill("//span[text()='Повторите новый пароль:']/following::input", `${password}$`)
  // Нажать «Изменить».
  await page.click("//span[text()='Изменить']")

  //2. Пароль пользователя будет изменен.
  //закрытие сессии
  await OIB_Page.shutDown()

  await OIB_Page.login(login, `${password}$`)
  expect(page.locator("//h4[text()='Пользователи']")).toBeVisible()

  //закрытие сессии
  await OIB_Page.shutDown()
})


test ("Login to chocolate (test 4.2)",async()=>{
//3. Авторизоваться в шоколадке с новым паролем и перейти в модуль ОИБ.
  const browser2 = await chromium.launch()
  const context2 = await browser2.newContext()
  const page2 = await context2.newPage()

  //enter to OIB
  await page2.goto("http://172.20.255.251:8080/authWeb/")
  await page2.fill("input[placeholder='Логин']", login)
  await page2.fill("input[type='password']", `${password}$`)
  await page2.click("//button[@type='button']//span[1]")

  const pagePromise2 = context2.waitForEvent('page'); //ставим обработчик событий на открытие новой страницы
  await page2.click("div#container>main>div>div:nth-of-type(7)") //клик на вкладку ОИБ в шоколадке
  const OIB_Page2 = await pagePromise2;
  await OIB_Page2.waitForLoadState();

  //3. Авторизация с новым паролем успешна.
  expect(OIB_Page2.locator("//h4[text()='Пользователи']")).toBeVisible()
  //закрытие сессии
  await OIB_Page2.click("//div[@class='el-dropdown']//div[1]") //user's menu
  await OIB_Page2.click("//li[text()='Завершить работу']")
  await OIB_Page2.click("(//button[contains(@class,'el-button el-button--default')])[2]")

})


test("return old user password (test 4.3)", async ({ page }) => {
  const OIB_Page = new OIB(page)
  await OIB_Page.login(login, `${password}$`)

  await OIB_Page.click(UserMenu.BTN_USER_MENU)
  await OIB_Page.click(UserMenu.change_password)
  await page.fill("input[placeholder='старый пароль']", `${password}$`)
  await page.fill("(//span[text()='Новый пароль:']/following::input)[1]", password)
  await page.fill("//span[text()='Повторите новый пароль:']/following::input", password)
  await page.click("//span[text()='Изменить']")

  //закрытие сессии
  await OIB_Page.shutDown()
})