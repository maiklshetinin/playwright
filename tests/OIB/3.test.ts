import { test, expect } from "@playwright/test";
import OIB, { UserMenu } from "./OIB";

const login = "SHETININM"
const password = "Asdf123$"

test("Selecting an interface theme 3", async ({ page }) => {

  const OIB_Page = new OIB(page)
  await OIB_Page.login(login, password)

  //----------------------------------------------------------------------------------------test1

  //1. Открыть меню пользователя.Выбрать «Темную тему».
  await OIB_Page.click(UserMenu.BTN_USER_MENU)
  await OIB_Page.click(UserMenu.theme_dark)
  //1. Сразу отображается темная тема интерфейса.
  expect(page.locator("//div[@id='app']")).toHaveClass("theme-dark")

  //----------------------------------------------------------------------------------------test2

  //2. Выбрать «Светлую тему».
  await OIB_Page.click(UserMenu.BTN_USER_MENU)
  await OIB_Page.click(UserMenu.theme_light)
  //2. Тема интерфейса переключается на светлую.
  expect(page.locator("//div[@id='app']")).toHaveClass("theme-light")

  //----------------------------------------------------------------------------------------test3

  //3. Выбрать пункт «Исходная тема».
  await OIB_Page.click(UserMenu.BTN_USER_MENU)
  await OIB_Page.click(UserMenu.theme_default)
  //3. По умолчанию будет отображаться тема, выбранная по умолчанию.
  expect(page.locator("//div[@id='app']")).toHaveClass("theme-mixed")


  await page.waitForTimeout(1000)
  //закрытие сессии
  await OIB_Page.shutDown()
})

