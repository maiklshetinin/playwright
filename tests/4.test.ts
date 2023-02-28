import { test, expect } from "@playwright/test";
import CASHE from "./CASHE";

const login = "SHETININM"
const password = "Asdf123$"


test("Завершение работы.(test 4)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(login, password)
  await page.waitForLoadState('networkidle')

  //----------------------------------------------------------------------------test1
  //1. Кликнуть по кнопке «Завершить работу», в левом нижнем углу.
  await CASHE_Page.shutDown()
  //1. Выход из модуля.
  expect(page.locator("(//input[@class='el-input__inner'])[1]")).toBeVisible()
  expect(page.locator("input[type='password']")).toBeVisible()
  expect(page.locator("//div[@class='logo flex-child']")).toBeVisible()
})




