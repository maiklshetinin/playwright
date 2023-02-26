import { test, expect } from "@playwright/test";
import CASHE, { Card, MainPage } from "./CASHE";

const LOGIN = "SHETININM"
const PASSWORD = "Asdf123$"
const GRZ = 'Р332СТ71'
const BRAND = 'ЛЕКСУС'
const MODEL = '470'
const FIRST_NAME = 'ИВАН'
const LAST_NAME = 'ИВАНОВ'
const REGION = 'КИРЕЕВСКИЙ'
const STREET = 'ПУШКИНА'

test("Проверка сохранения изменений в карточке. (test 13.1)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)

  //----------------------------------------------------------------------------------------test1
  //1. Нажать на найденную запись
  await page.fill(MainPage.input_search, GRZ)
  await CASHE_Page.click(MainPage.BTN_SEARCH)
  await page.waitForLoadState("networkidle")

  //^highlight----------------------------------------------------------------------
  await page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0).highlight()
  await page.waitForTimeout(50)
  //^highlight----------------------------------------------------------------------
  await page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0).click()
  //1. Откроется карточка ГРЗ в правом углу.
  await expect(page.locator(Card.card)).toBeVisible()
  await page.waitForTimeout(1000)

  //----------------------------------------------------------------------------------------test2

  //2. Нажать на кнопку Редактировать
  await CASHE_Page.click(Card.BTN_EDIT)
  //2. Все поля станут доступны для редактирования. Кнопка Сохранить не активна, пока не вносились какие-либо изменения.
  await expect(page.locator("(//span[text()='Марка']/following::input)[1]")).toBeVisible()
  await expect(page.locator("(//span[text()='Модель']/following::input)[1]")).toBeVisible()

  await page.locator(Card.owner).scrollIntoViewIfNeeded()
  await CASHE_Page.click(Card.owner)

  await expect(page.locator("(//span[text()='Фамилия']/following::input)[1]")).toBeVisible()
  await expect(page.locator("(//span[text()='Имя']/following::input)[1]")).toBeVisible()

  await page.locator(Card.address).scrollIntoViewIfNeeded()
  await CASHE_Page.click(Card.address)

  await expect(page.locator("(//span[text()='Регион']/following::input)[1]")).toBeVisible()
  await expect(page.locator("(//span[text()='Улица']/following::input)[1]")).toBeVisible()

  await expect(page.locator(Card.BTN_SAVE)).toHaveAttribute("disabled", "disabled")


  //закрытие сессии
  await CASHE_Page.shutDown()
})


test.only("Проверка сохранения изменений в карточке. (test 13.2)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)

  //----------------------------------------------------------------------------------------test1
  //1. Нажать на найденную запись
  await page.fill(MainPage.input_search, GRZ)
  await CASHE_Page.click(MainPage.BTN_SEARCH)
  await page.waitForLoadState("networkidle")

  //^highlight----------------------------------------------------------------------
  await page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0).highlight()
  await page.waitForTimeout(50)
  //^highlight----------------------------------------------------------------------
  await page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0).click()
  //1. Откроется карточка ГРЗ в правом углу.
  await expect(page.locator(Card.card)).toBeVisible()
  await page.waitForTimeout(1000)

  //----------------------------------------------------------------------------------------test2

  //2. Нажать на кнопку Редактировать
  await CASHE_Page.click(Card.BTN_EDIT)
  //3. Внести изменения в любые поля в группе АМТС / Владелец / Адрес регистрации.
  //3. Введенные значения сохранились в соответствующих полях. Кнопка Сохранить активна (не была нажата) подсвечена синим.
  await page.type("(//span[text()='Марка']/following::input)[1]", BRAND)
  await page.getByText(CASHE_Page.getRegExp(BRAND)).highlight()
  await page.getByText(CASHE_Page.getRegExp(BRAND)).click()

  await expect(page.locator("(//span[text()='Марка']/following::input)[1]")).toHaveValue(BRAND)

  await page.type("(//span[text()='Модель']/following::input)[1]", MODEL)
  await page.getByText(CASHE_Page.getRegExp(MODEL)).highlight()
  await page.getByText(CASHE_Page.getRegExp(MODEL)).click()

  await expect(page.locator("(//span[text()='Модель']/following::input)[1]")).toHaveValue(MODEL)






  await page.locator(Card.owner).scrollIntoViewIfNeeded()
  await CASHE_Page.click(Card.owner)

  await page.fill("(//span[text()='Фамилия']/following::input)[1]", '')
  await page.fill("(//span[text()='Имя']/following::input)[1]", '')

  await page.fill("(//span[text()='Фамилия']/following::input)[1]", LAST_NAME)
  await page.fill("(//span[text()='Имя']/following::input)[1]", FIRST_NAME)
  await expect(page.locator("(//span[text()='Фамилия']/following::input)[1]")).toHaveValue(LAST_NAME)
  await expect(page.locator("(//span[text()='Имя']/following::input)[1]")).toHaveValue(FIRST_NAME)

  await page.locator(Card.address).scrollIntoViewIfNeeded()
  await CASHE_Page.click(Card.address)



  await page.fill("(//span[text()='Регион']/following::input)[1]", '')
  await page.locator("(//span[text()='Регион']/following::input)[1]").scrollIntoViewIfNeeded()
  await page.fill("(//span[text()='Улица']/following::input)[1]", '')
  await page.fill("(//span[text()='Регион']/following::input)[1]", REGION)
  await page.fill("(//span[text()='Улица']/following::input)[1]", STREET)
  await expect(page.locator("(//span[text()='Регион']/following::input)[1]")).toHaveValue(REGION)
  await expect(page.locator("(//span[text()='Улица']/following::input)[1]")).toHaveValue(STREET)

  await expect(page.locator(Card.BTN_SAVE)).toHaveClass("//button[contains(@class,'el-button el-button--success')]")
  await page.waitForTimeout(3000)

  //закрытие сессии
  await CASHE_Page.shutDown()
})




//----------------------------------------------------------------------------------------test2

//3. Внести изменения в любые поля в группе АМТС / Владелец / Адрес регистрации.

//3. Введенные значения сохранились в соответствующих полях. Кнопка Сохранить активна (не была нажата) подсвечена синим.