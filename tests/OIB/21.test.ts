import { test, expect } from "@playwright/test";
import OIB, { DivLocators, InputLocators, LAST_NAME, Locators, LOGIN, PASSWORD, SpanLocators, UserCard } from "./OIB";

test("Edit role.", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 800,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login("SHETININM", PASSWORD)

  //1. Проставить чекбокс Активные и Роль, в графе поиска, вбить название роли, созданной в в пункте 19.
  await page.click("(//span[@class='el-checkbox__inner'])[3]")
  await page.waitForTimeout(2000)
  //1. Появится список всех созданных активных Ролей.
  expect(await page.locator("//table[@role='grid']//tbody[1]").getByRole("row").all()).not.toHaveLength(0)

  //2. Перейти в карточку роли. Нажать Редактировать.
  //TODO:сначала кликаем на строку чтобы добавить класс current, потом кликаем по чекбоксу
  await page.locator("//table[@role='grid']//tbody[1]").getByText("test123").nth(0).click()
  await page.locator("//tr[contains(@class, 'current')]//td[1]").click()
  await OIB_Page.click(UserCard.BTN_EDIT)

  //2. Появится все активные поля, доступные для редактирования.
  expect(page.locator("//div[contains(@class,'pl18 pr12')]")).toBeVisible()

  //3. Внести изменения в запись, например, изменить название, добавить или убрать какое-либо право.
  //Нажать Сохранить 

  await page.fill(InputLocators.role, "test12345")
  await page.locator("//div[contains(@class,'arm-list flex-child')]").getByText(/^ВФ$/).click()
  await page.locator("(//div[@aria-label='checkbox-group'])[1]").getByTitle("АРМ ВФ").click()
  await OIB_Page.click(UserCard.BTN_SAVE)

  //3. Внесенные изменения были применены к соответствующей карточке роли.
  expect(page.locator(SpanLocators.role)).toContainText("test12345")
  await page.locator("//div[contains(@class,'arm-list flex-child')]").getByText(/^ВФ$/).click()
  expect(page.locator("(//div[@aria-label='checkbox-group'])[1]").getByTitle("АРМ ВФ")).toHaveAttribute("class", "el-checkbox is-checked")

  //3. Внести изменения в запись, например, изменить название, добавить или убрать какое-либо право.
  //Нажать Отмена.
  await OIB_Page.click(UserCard.BTN_EDIT)
  await page.fill(InputLocators.role, "test123456789")
  await page.locator("//div[contains(@class,'arm-list flex-child')]").getByText(/^ВФ$/).click()
  await page.locator("(//div[@aria-label='checkbox-group'])[1]").getByTitle("ВФ. Контролер ЦОДД").click()
  await OIB_Page.click(UserCard.BTN_CANCEL)

  //В случае, отмены изменений, изменения не будут сохранены.
  expect(page.locator(SpanLocators.role)).not.toContainText("test123456789")
  await page.locator("//div[contains(@class,'arm-list flex-child')]").getByText(/^ВФ$/).click()
  expect(page.locator("(//div[@aria-label='checkbox-group'])[1]").getByTitle("ВФ. Контролер ЦОДД")).not.toHaveAttribute("aria-checked", "true")


  //сброс значений---------------------------------------------------------------------------
  await OIB_Page.click(UserCard.BTN_EDIT)
  await page.fill(InputLocators.role, "test123")
  await page.locator("//div[contains(@class,'arm-list flex-child')]").getByText(/^ВФ$/).click()
  await page.locator("(//div[@aria-label='checkbox-group'])[1]").getByTitle("АРМ ВФ").click()
  await OIB_Page.click(UserCard.BTN_SAVE)

  await page.waitForTimeout(3000)
  //закрытие сессии
  await OIB_Page.shutDown()
})