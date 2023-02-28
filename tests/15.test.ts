import { test, expect } from "@playwright/test";
import OIB, { DivLocators, InputLocators, Locators,  SpanLocators, UserCard } from "./OIB";

const login="SHETININM"
const userLogin ="SHETININM"
const password = "Asdf123$"
const inputLogin = "IVANOV111"
const inputFirstName = "Ivan111"
const inputLastName = "Ivanov111"


test("Copying a user card (test 15)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 1080,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login(login, password)

  //1. Выделить нужную учетную запись.
  await OIB_Page.getUserCard(userLogin)
  // await page.waitForTimeout(1000)
  await page.waitForLoadState('networkidle')
  //1. Справа появится карточка выделенного пользователя.
  expect(page.locator(DivLocators.userCard)).toBeVisible()

  //2. В правом верхнем углу, нажать кнопку Копировать выбранного пользователя/роль.
  await OIB_Page.click(Locators.BTN_COPY_SELECTED_USER)
  await page.waitForTimeout(1000)
  //2. Появится окно для внесения данных для нового пользователя, с правами доступа от копируемого пользователя.
  expect(page.locator(DivLocators.userCard)).toBeVisible()
  expect(await page.locator(InputLocators.lastName).inputValue()).toBe('')
  expect(await page.locator(InputLocators.login).inputValue()).toBe('')//часто падает тест

  const container_checkboxes = "(//div[@class='flex-parent'])[2]"

  await OIB_Page.click("//div[text()='Адм.практика']")
  for (const checkbox of await page.locator(container_checkboxes).getByRole("checkbox").all())
    expect(checkbox).toBeChecked()

  await OIB_Page.click("//div[text()='Аналитика']")
  for (const checkbox of await page.locator(container_checkboxes).getByRole("checkbox").all())
    expect(checkbox).toBeChecked()

  await OIB_Page.click("//div[text()='Владельцы ТС']")
  for (const checkbox of await page.locator(container_checkboxes).getByRole("checkbox").all())
    expect(checkbox).toBeChecked()

  await OIB_Page.click("//div[text()='Внешняя отчетность']")
  for (const checkbox of await page.locator(container_checkboxes).getByRole("checkbox").all())
    expect(checkbox).toBeChecked()

  await OIB_Page.click("//div[text()='ВФ']")
  for (const checkbox of await page.locator(container_checkboxes).getByRole("checkbox").all())
    expect(checkbox).toBeChecked()

  await OIB_Page.click("//div[text()='Диспетчерский центр']")
  for (const checkbox of await page.locator(container_checkboxes).getByRole("checkbox").all())
    expect(checkbox).toBeChecked()

  await OIB_Page.click("//div[text()='Контроль КВФ']")
  for (const checkbox of await page.locator(container_checkboxes).getByRole("checkbox").all())
    expect(checkbox).toBeChecked()

  await OIB_Page.click("//div[text()='Обращения']")
  for (const checkbox of await page.locator(container_checkboxes).getByRole("checkbox").all())
    expect(checkbox).toBeChecked()

  await OIB_Page.click("//div[text()='Обход']")
  for (const checkbox of await page.locator(container_checkboxes).getByRole("checkbox").all())
    expect(checkbox).toBeChecked()

  await OIB_Page.click("//div[text()='Обходчик']")
  for (const checkbox of await page.locator(container_checkboxes).getByRole("checkbox").all())
    expect(checkbox).toBeChecked()

  await OIB_Page.click("//div[text()='ОИБ. Управл. доступо']")
  for (const checkbox of await page.locator(container_checkboxes).getByRole("checkbox").all())
    expect(checkbox).toBeChecked()

  await OIB_Page.click("//div[text()='Ориентировки']")
  for (const checkbox of await page.locator(container_checkboxes).getByRole("checkbox").all())
    expect(checkbox).toBeChecked()

  await OIB_Page.click("//div[text()='Перехват']")
  for (const checkbox of await page.locator(container_checkboxes).getByRole("checkbox").all())
    expect(checkbox).toBeChecked()

  await OIB_Page.click("//div[text()='Сервис КВФ']")
  for (const checkbox of await page.locator(container_checkboxes).getByRole("checkbox").all())
    expect(checkbox).toBeChecked()

  await OIB_Page.click("//div[text()='Ситуационный центр']")
  for (const checkbox of await page.locator(container_checkboxes).getByRole("checkbox").all())
    expect(checkbox).toBeChecked()

  await OIB_Page.click("//div[text()='Учет специальных ТС']")
  for (const checkbox of await page.locator(container_checkboxes).getByRole("checkbox").all())
    expect(checkbox).toBeChecked()

  //3. Заполнить необходимые поля: ФИО, Логин.
  await page.fill(InputLocators.login, inputLogin)
  await page.fill(InputLocators.firstName, inputFirstName)
  await page.fill(InputLocators.lastName, inputLastName)

  //3. Введенные данные будут отображаться в соответствующем поле.
  expect(await page.locator(InputLocators.login).inputValue()).toBe(inputLogin)
  expect(await page.locator(InputLocators.firstName).inputValue()).toBe(inputFirstName)
  expect(await page.locator(InputLocators.lastName).inputValue()).toBe(inputLastName)

//4. Нажать Сохранить
//TODO:как не дублировать аккаунты?
//  await page.locator(UserCard.BTN_CREATE).highlight()
//  await page.locator(UserCard.BTN_CREATE).click()
  // await page.waitForTimeout(3000)
  //закрытие сессии
  await OIB_Page.shutDown()
})