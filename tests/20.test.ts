import { test, expect } from "@playwright/test";
import OIB, { InputLocators, Locators, SpanLocators, UserCard } from "./OIB";
const LOGIN = "SHETININM"
const PASSWORD = "Asdf123$"

test("Creation of a new Role. (test 20)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 1080,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login(LOGIN, PASSWORD)

  //1. Проставить чекбокс Активные и Роль, в графе поиска, вбить название роли, созданной в в пункте 19.
  await page.click("(//span[@class='el-checkbox__inner'])[3]")
  await page.waitForTimeout(1000)
  //1. Появится список всех созданных активных Ролей.
  //Если у роли закончился период активности, назначить такую роль на пользователя нельзя.
  expect(await page.locator("//table[@role='grid']//tbody[1]").getByRole("row").all()).not.toHaveLength(0)

  //2. Выделить нужную запись и проставить чекбокс.
  //TODO:сначала кликаем на строку чтобы добавить класс current, потом кликаем по чекбоксу
  await page.locator("//table[@role='grid']//tbody[1]").getByText(OIB_Page.getRegExp("Test")).nth(0).click()
  await page.locator("//tr[contains(@class, 'current')]//td[1]").click()

  //2. Справа появится карточка выделенной роли.
  expect(page.locator("div.pl18.pr12")).toBeVisible()

  //3. Нажать кнопку Копировать выбранного пользователя/роль.
  await OIB_Page.click(Locators.BTN_COPY_SELECTED_USER)

  //3. Появится окно для внесения данных для нового пользователя, с правами доступа от копируемой карточки Роли.
  await page.locator("//div[contains(@class,'arm-list flex-child')]").getByText(/^ВФ$/).click()
  await expect(page.locator("(//input[@value='334'])[1]")).toBeChecked()

  //4. Заполнить новое название Роли.
  await page.fill(InputLocators.role, "test123")
  //4. Введенные данные будут отображаться в соответствующем поле. Кнопка Создать станет активной.
  expect(page.locator(InputLocators.role)).toHaveValue("test123")
  expect(UserCard.BTN_CREATE).not.toHaveProperty("disabled", "disabled")

  //5. Нажать Создать
  await OIB_Page.click(UserCard.BTN_CREATE)

  //5. Если у пользователя были права на делегирование выставленных прав, Создается новая роль. В противном случае, Появится окно с ошибкой.
  expect(page.locator(SpanLocators.role)).toContainText("test123")
  expect(await page.locator("//table[@role='grid']//tbody[1]").getByText("test123").all()).not.toHaveLength(0)

  await page.waitForTimeout(1000)

  //закрытие сессии
  await OIB_Page.shutDown()
})