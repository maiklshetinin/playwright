import { test, expect } from "@playwright/test";
import CASHE, { Card, MainPage } from "./CASHE";

const LOGIN = "SHETININM"
const PASSWORD = "Asdf123$"
const GRZ = [
  'Р332СТ71', //киррилица
  'P332CТ71', //Р и С - лат., Т - кирл.
  'P332CT71'  //латиница 
]

test("Проверка поиска по ГРЗ с латинским и кириллическим написанием. (test 12.1)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)

  //----------------------------------------------------------------------------------------test1
  // часть символов на противоположные (латинские на кириллицу, кириллицу на латиницу, например: P332CТ71 где, Р и С - лат., Т - кирл.)
  //4. скопировать ГРЗ в строку поиска КЕШа и нажать поиск.

  await page.fill(MainPage.input_search, GRZ[1])
  await CASHE_Page.click(MainPage.BTN_SEARCH)
  await page.waitForLoadState("networkidle")

  //^highlight----------------------------------------------------------------------
  await page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ[0])).nth(0).highlight()
  await page.waitForTimeout(50)
  //^highlight----------------------------------------------------------------------

  //4. Из всех результатов останется только искомый ГРЗ.
  await expect(page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ[0])).nth(0)).toContainText(GRZ[0])

  //закрытие сессии
  await CASHE_Page.shutDown()
})


test("Проверка поиска по ГРЗ с латинским и кириллическим написанием. (test 12.2)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)

  //----------------------------------------------------------------------------------------test1

  //5. Заменить все символы ГРЗ на латиницу. Проверить на сайте. Очистить поле поиска КЕШа. Нажать поиск. Вставить измененный ГРЗ. Осуществить поиск
  await page.fill(MainPage.input_search, GRZ[2])
  await CASHE_Page.click(MainPage.BTN_SEARCH)
  await page.waitForLoadState("networkidle")
  //2. Убедиться, что поиск произошел и появилась запись с данными по ТС которое введено в п.1 тест кейса.
  //^highlight----------------------------------------------------------------------
  await page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ[0])).nth(0).highlight()
  await page.waitForTimeout(50)
  //^highlight----------------------------------------------------------------------
  await expect(page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ[0])).nth(0)).toContainText(GRZ[0])
  //5. В правом углу строки поиска кликнуть по кнопку в виде крестика
  await page.locator(MainPage.input_search).hover()
  await page.locator('.el-input__suffix-inner > .el-input__icon').first().click();
  await CASHE_Page.click(MainPage.BTN_SEARCH)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(2000)
  //Подтянулись все карточки(10 000).
  expect(page.locator("//div[@class='flex-child txt-bold']")).toContainText("Найдено: 10000 записей")

  //закрытие сессии
  await CASHE_Page.shutDown()
})

test("Проверка поиска по ГРЗ с латинским и кириллическим написанием. (test 12.3)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)

  //----------------------------------------------------------------------------------------test1

  // Заменить все символы ГРЗ на кириллицу, повторить шаги из пункта 5. Произвести поиск по искомому ГРЗ.
  await page.fill(MainPage.input_search, GRZ[2])
  await CASHE_Page.click(MainPage.BTN_SEARCH)
  await page.waitForLoadState("networkidle")
  //2. Убедиться, что поиск произошел и появилась запись с данными по ТС которое введено в п.1 тест кейса.
  //^highlight----------------------------------------------------------------------
  await page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ[0])).nth(0).highlight()
  await page.waitForTimeout(50)
  //^highlight----------------------------------------------------------------------
  //5. Символы заменены. Результат проверен.
  await expect(page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ[0])).nth(0)).toContainText(GRZ[0])
  //5. В правом углу строки поиска кликнуть по кнопку в виде крестика
  await page.locator(MainPage.input_search).hover()
  await page.locator('.el-input__suffix-inner > .el-input__icon').first().click();
  await CASHE_Page.click(MainPage.BTN_SEARCH)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(2000)
  //Подтянулись все карточки(10 000).
  expect(page.locator("//div[@class='flex-child txt-bold']")).toContainText("Найдено: 10000 записей")

  //закрытие сессии
  await CASHE_Page.shutDown()
})


