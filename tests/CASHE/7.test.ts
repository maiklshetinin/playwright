import { test, expect } from "@playwright/test";
import CASHE, { UserMenu } from "./CASHE";

const LOGIN = "SHETININM"
const PASSWORD = "Asdf123$"



test("Руководство пользователя. (test 7)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)

  //----------------------------------------------------------------------------------------test1
  //1. Кликнуть на изображение пользователя.
  await CASHE_Page.click(UserMenu.BTN_USER_MENU)
  await CASHE_Page.click(UserMenu.manual)
  await page.waitForLoadState("networkidle")
  //Руководство пользователя открывается во всплывающем окне, формата PDF, с элементами управления режимами отображения / просмотра руководства.
  //Версия Руководства является актуальной.
  await page.locator("//span[text()='×']").highlight()
  await page.waitForTimeout(2000)
  await expect(page.locator("//span[text()='×']")).toBeVisible()
  await page.click("//span[text()='×']")
  //закрытие сессии
  await CASHE_Page.shutDown()
})