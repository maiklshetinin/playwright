import OIB, { DivLocators, InputLocators, LAST_NAME, Locators, LOGIN, UserCard } from './OIB';
import { test, expect, chromium } from "@playwright/test";

const login = "SHETININM"
const password = "Asdf123$"
const newUserLogin = "IVANOVI6"
const newUserLastName = "Ivanov"


test("Create a new user account.", async ({ page }) => {
  const OIB_Page = new OIB(page)
  await OIB_Page.login("SHETININM", password)

  //----------------------------------------------------------------------------------------test1

  //Нажать «+» в правом верхнем углу.
  await OIB_Page.click(Locators.BTN_ADD_A_NEW_USER)
  //1. Создается пустая карточка для заполнения данными учетной записи.
  expect(page.locator(UserCard.userCard)).toBeVisible()

  //----------------------------------------------------------------------------------------test2

  // Заполнить (обязательные поля) Фамилию и Логин сотрудника.
  await page.fill(InputLocators.lastName, newUserLastName)
  await page.fill(InputLocators.login, newUserLogin)
  //Кнопка Создать подсвечена.
  expect(page.locator(UserCard.BTN_CREATE)).not.toHaveAttribute("disabled", "disabled")

  //----------------------------------------------------------------------------------------test3
  //Нажать кнопку Создать.
  await OIB_Page.click(UserCard.BTN_CREATE)
  //3. Пользователь создан.
  expect(OIB_Page.getFirstRow(DivLocators.table_body).getByText(newUserLastName).nth(0)).toHaveText(newUserLastName)

  await page.waitForTimeout(3000)
  //закрытие сессии
  await OIB_Page.shutDown()
})

