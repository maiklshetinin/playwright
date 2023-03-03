import { test, expect } from "@playwright/test";
import CASHE, { Card, MainPage } from "./CASHE";

const LOGIN = "SHETININM"
const PASSWORD = "Asdf123$"
const GRZ = 'Р332СТ71'
const BRAND = 'ЛЕКСУС'
const MODEL = '470'
const FIRST_NAME = 'ИВАН'
const LAST_NAME = 'ИВАНОВ'
const REGION = 'АЛТАЙСКИЙ КРАЙ'
const AREA = 'АЛЕЙСКИЙ Р-Н'

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


test("Проверка сохранения изменений в карточке. (test 13.2)", async ({ page }) => {
  test.slow()
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)

  //----------------------------------------------------------------------------------------test1
  //1. Нажать на найденную запись
  await page.fill(MainPage.input_search, GRZ)
  await CASHE_Page.click(MainPage.BTN_SEARCH)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1000)

  await page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0).click()
  await page.waitForTimeout(1000)
  //1. Откроется карточка ГРЗ в правом углу.
  await expect(page.locator(Card.card)).toBeVisible()
  // await page.waitForTimeout(1000)
  //----------------------------------------------------------------------------------------test2

  //2. Нажать на кнопку Редактировать
  await CASHE_Page.click(Card.BTN_EDIT)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1000)
  // //3. Внести изменения в любые поля в группе АМТС / Владелец / Адрес регистрации.
  // //3. Введенные значения сохранились в соответствующих полях. 
  await page.click("(//span[text()='Марка']/following::input)[1]")
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1000)
  await page.type("(//span[text()='Марка']/following::input)[1]", BRAND)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1000)
  await page.getByText(CASHE_Page.getRegExp(BRAND)).click()
  await page.waitForTimeout(1000)
  await expect(page.locator("(//span[text()='Марка']/following::input)[1]")).toHaveValue(BRAND)

  await page.type("(//span[text()='Модель']/following::input)[1]", MODEL)
  await page.waitForTimeout(1000)
  await page.getByText(CASHE_Page.getRegExp(MODEL)).click()
  await expect(page.locator("(//span[text()='Модель']/following::input)[1]")).toHaveValue(MODEL)

  await page.locator(Card.owner).scrollIntoViewIfNeeded()
  await CASHE_Page.click(Card.owner)

  await page.fill("(//span[text()='Фамилия']/following::input)[1]", LAST_NAME)
  await page.fill("(//span[text()='Имя']/following::input)[1]", FIRST_NAME)
  await expect(page.locator("(//span[text()='Фамилия']/following::input)[1]")).toHaveValue(LAST_NAME)
  await expect(page.locator("(//span[text()='Имя']/following::input)[1]")).toHaveValue(FIRST_NAME)

  await CASHE_Page.click(Card.address)
  await page.locator(Card.BTN_SAVE).scrollIntoViewIfNeeded()
  await page.waitForTimeout(1000)

  await page.type("(//span[text()='Регион']/following::input)[1]", REGION)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1000)
  await page.locator("(//div[@x-placement='bottom-start']//div)[1]").getByText(REGION).click()

  await page.click("(//span[text()='Район']/following::input)[1]")
  await page.waitForTimeout(1000)
  await page.type("(//span[text()='Район']/following::input)[1]", AREA)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1000)
  await page.getByText(CASHE_Page.getRegExp(AREA)).click()
  await page.waitForTimeout(1000)

  expect(await page.locator("(//span[text()='Регион']/following::input)[1]").inputValue()).toContain(REGION)
  await expect(page.locator("(//span[text()='Район']/following::input)[1]")).toHaveValue(AREA)

  //Кнопка Сохранить активна (не была нажата) подсвечена синим.
  await expect(page.locator(Card.BTN_SAVE)).toHaveClass("el-button el-button--success el-button--small")

  //----------------------------------------------------------------------------------------test3

  //4. Нажать на кнопку Сохранить
  await CASHE_Page.click(Card.BTN_SAVE)
  //4. Убедиться, что после нажатия на кнопку Сохранить все внесенные данные в карточке сохранились и отображаются.
  await page.locator("(//span[@class='text-only multilinespan'])[3]").scrollIntoViewIfNeeded()
  await expect(page.locator("(//span[@class='text-only multilinespan'])[3]")).toContainText(BRAND)
  await expect(page.locator("(//div[@class='list-input']//span)[2]")).toContainText(MODEL)

  await expect(page.locator("//span[text()='Фамилия']/following-sibling::div")).toContainText(LAST_NAME)
  await expect(page.locator("//span[text()='Имя']/following-sibling::div")).toContainText(FIRST_NAME)

  await page.locator("//span[text()='Регион']/following-sibling::div").scrollIntoViewIfNeeded()
  await expect(page.locator("//span[text()='Регион']/following-sibling::div")).toContainText(REGION)
  await expect(page.locator("//span[text()='Район']/following-sibling::div")).toContainText(AREA)

  //закрытие сессии
  await CASHE_Page.shutDown()
})




//----------------------------------------------------------------------------------------test2

//3. Внести изменения в любые поля в группе АМТС / Владелец / Адрес регистрации.

//3. Введенные значения сохранились в соответствующих полях. Кнопка Сохранить активна (не была нажата) подсвечена синим.