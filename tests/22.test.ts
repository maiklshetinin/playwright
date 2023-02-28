import { test, expect } from "@playwright/test";
import OIB, { DivLocators, InputLocators, LAST_NAME, Locators, LOGIN, PASSWORD, SpanLocators, UserCard } from "./OIB";

const login = "SHETININM"
const search = "IV"
const user1 = "IVANOVI"
const user2 = "IVANOVAO"
const role = "newRole"

test("Assigning a Role to selected (group) users. (test 22)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 800,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login(login, PASSWORD)

  //----------------------------------------------------------------------------------------test1

  //1. Активировать чекбокс «Активные». В строке поиска найти требуемых пользователей,
  //если назначение ролей производится группе пользователей или выбрать одного пользователя.
  //TODO:не всегда срабатывает поиск
  await page.waitForTimeout(1000)
  await page.waitForLoadState('networkidle')

  await page.fill(InputLocators.search_user, search)
  await page.waitForLoadState('networkidle')

  //1. Отображаются пользователи, доступные для редактирования.
  expect(page.locator(DivLocators.table_body).getByText(OIB_Page.getRegExp(user1))).toContainText(user1)
  expect(page.locator(DivLocators.table_body).getByText(OIB_Page.getRegExp(user2))).toContainText(user2)

  //----------------------------------------------------------------------------------------test2

  //2. В таблице отображения пользователей, выделить несколько учетных записей, проставив на против них чекбокс.
  await OIB_Page.selectUserCheckbox(user1)
  await OIB_Page.selectUserCheckbox(user2)

  //2. Соответствующие карточки с пользователей выделены, справа отображается последняя из них.
  //находим строку по общему классу selected
  expect(await page.locator("//tr[contains(@class, 'selected')]").getByText(OIB_Page.getRegExp(user1)).innerText()).toBe(user1)
  expect(page.locator("//tr[contains(@class, 'selected')]").getByText(OIB_Page.getRegExp(user2))).toHaveText(user2)
  expect(await page.locator(SpanLocators.login).innerText()).toBe(user2)

  //----------------------------------------------------------------------------------------test3

  //3. Нажать кнопку «Назначить Роль выбранным пользователям».
  await OIB_Page.click(Locators.BTN_ASSIGN_ROLE_TO_SELECTED_USERS)

  //3. Откроется окно выбора созданных ранее Ролей.
  expect(page.locator("//span[text()='Задать роль для выбранных пользователей']")).toBeVisible()

  //----------------------------------------------------------------------------------------test4
  //4. Проставить чекбокс «Включая временные ограничения».
  await OIB_Page.click("//input[@placeholder='Выбрать']")
  await page.locator("(//div[@x-placement='bottom-start']//div)[1]").getByRole('listitem').filter({hasText:role}).highlight()
  await page.waitForTimeout(100)
  await page.locator("(//div[@x-placement='bottom-start']//div)[1]").getByRole('listitem').filter({hasText:role}).click()
  await OIB_Page.click("(//span[@class='el-checkbox__input']//span)[3]")
  await OIB_Page.click(UserCard.BTN_SAVE)

  //4. Временные ограничения, для данной Роли, так же будут применены к выделенным учетным записям пользователей.
  //TODO: уточнить что именно проверять во временных ограничениях(время остаётся неизменным вне зависимости от чекбокса)
  await page.locator(DivLocators.table_body).getByText(OIB_Page.getRegExp(user1)).click()
  expect(await page.locator("//div[@class='list-input']//span[1]").innerText()).toBe(role)

  await page.locator(DivLocators.table_body).getByText(OIB_Page.getRegExp(user2)).click()
  expect(await page.locator("//div[@class='list-input']//span[1]").innerText()).toBe(role)

  //закрытие сессии
  await OIB_Page.shutDown()
})