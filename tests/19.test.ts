import { test, expect } from "@playwright/test";
import OIB, {InputLocators, Locators, LOGIN, PASSWORD, SpanLocators, UserCard } from "./OIB";

test("Создание новой Роли. (test 19)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 1080,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login(LOGIN, PASSWORD)
  await page.waitForLoadState('networkidle')
  //1. Нажать « (+) » (Добавить новую роль).
  await OIB_Page.click(Locators.BTN_ADD_A_NEW_ROLE)
  await page.waitForTimeout(1000)
  //1. Открывается окно для внесения новых данных.
  await expect(page.locator("div.pl18.pr12")).toBeVisible()

  //2. Указать название Роли, например Тест.
  await page.fill(InputLocators.role, "Test")

  //2. Кнопка Создать станет подсвечена.
  expect(UserCard.BTN_CREATE).not.toHaveProperty("disabled", "disabled")

  //3. В Списке прав, выставить параметры доступа для создаваемой Роли, например: АРМ — ВФ, активировать чекбокс «АРМ ВФ».
  await OIB_Page.click("//div[text()='ВФ']")
  await OIB_Page.click("(//span[@class='el-checkbox__input']//span)[3]")

  //3. Право для Роли Тест выставлено.
  await expect(page.locator("(//input[@value='334'])[1]")).toBeChecked()

  //4. Нажать кнопку Создать.
  await OIB_Page.click("//span[text()='Создать']")

  //4. Роль с заданным названием и параметрами создана и отображается в общем списке ролей.
  await expect(page.locator(SpanLocators.role)).toContainText("Test")
  await expect(page.locator("//div[contains(@class,'arm-list flex-child')]").getByText("ВФ").nth(0)).toHaveText("ВФ")

  //закрытие сессии
  await OIB_Page.shutDown()
})