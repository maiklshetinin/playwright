import { test, expect } from "@playwright/test";
import CASHE, { UserMenu } from "./CASHE";

const login = "SHETININM"
const password = "Asdf123$"

test("Выбор темы оформления.", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(login, password)

  //----------------------------------------------------------------------------------------test1

  //1. Открыть меню пользователя.Выбрать «Темную тему».
  await CASHE_Page.click(UserMenu.BTN_USER_MENU)
  await CASHE_Page.click(UserMenu.theme_dark)
  //1. Сразу отображается темная тема интерфейса.
  await expect(page.locator("//div[@id='app']")).toHaveClass("theme-dark")

  //----------------------------------------------------------------------------------------test2

  //2. Выбрать «Светлую тему».
  await CASHE_Page.click(UserMenu.BTN_USER_MENU)
  await CASHE_Page.click(UserMenu.theme_light)
  //2. Тема интерфейса переключается на светлую.
  await expect(page.locator("//div[@id='app']")).toHaveClass("theme-light")

  //закрытие сессии
  await CASHE_Page.shutDown()
})

