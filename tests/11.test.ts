import { test, expect } from "@playwright/test";
import CASHE, { Card, MainPage } from "./CASHE";

const LOGIN = "SHETININM"
const PASSWORD = "Asdf123$"
const GRZ = ['Е928СР36', 'М089ХК750', 'Н321ОК777']


test("Проверка поиска по ГРЗ ТС. (test 11.1)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)

  //----------------------------------------------------------------------------------------test1

  //1. Ввести в поле Поиск по ГРЗ один из номеров из списка (можно ввести свой ГРЗ)
  // Е928СР36
  // М089ХК750
  // Н321ОК777
  for (const regno of GRZ) {
    await page.fill(MainPage.input_search, regno)
    //1. ГРЗ отобразился в поле ввода.
    await expect(page.locator(MainPage.input_search)).toHaveValue(regno)
  }

  //----------------------------------------------------------------------------------------test2

  //2. Нажать на кнопку Искать
  for (const regno of GRZ) {
    await page.fill(MainPage.input_search, regno)
    await CASHE_Page.click(MainPage.BTN_SEARCH)
    await page.waitForLoadState("networkidle")
    //2. Убедиться, что поиск произошел и появилась запись с данными по ТС которое введено в п.1 тест кейса.
    await page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(regno)).nth(0).highlight()
    await page.waitForTimeout(100)
    await expect(page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(regno)).nth(0)).toContainText(regno)
  }

  //----------------------------------------------------------------------------------------test3

  //3. Кликнуть по одному из найденных результатов.
  await page.locator(MainPage.item_line).nth(0).highlight()
  await page.locator(MainPage.item_line).nth(0).click()

  //3. С правой стороны отобразится окно с подробной информацией по найденному ГРЗ.
  await page.locator(Card.card).getByText(GRZ[2]).highlight()
  await expect(page.locator(Card.card).getByText(GRZ[2])).toContainText(GRZ[2])

  //----------------------------------------------------------------------------------------test4

  //4. Кликнуть на карандаш в правом верхнем углу карточки.
  await CASHE_Page.click(Card.BTN_EDIT)
  //4. Карточка станет доступна для редактирования.

  //^highlight----------------------------------------------------------------------
  await page.locator("(//span[text()='Марка']/following::input)[1]").highlight()
  await page.waitForTimeout(100)
  await page.locator("(//span[text()='Модель']/following::input)[1]").highlight()
  await page.waitForTimeout(100)
  //^highlight----------------------------------------------------------------------

  await expect(page.locator("(//span[text()='Марка']/following::input)[1]")).toBeVisible()
  await expect(page.locator("(//span[text()='Модель']/following::input)[1]")).toBeVisible()

  await page.locator(Card.owner).scrollIntoViewIfNeeded()
  await CASHE_Page.click(Card.owner)

  //^highlight----------------------------------------------------------------------
  await page.locator("(//span[text()='Фамилия']/following::input)[1]").highlight()
  await page.waitForTimeout(100)
  await page.locator("(//span[text()='Имя']/following::input)[1]").scrollIntoViewIfNeeded()
  await page.locator("(//span[text()='Имя']/following::input)[1]").highlight()
  await page.waitForTimeout(100)
  //^highlight----------------------------------------------------------------------

  await expect(page.locator("(//span[text()='Фамилия']/following::input)[1]")).toBeVisible()
  await expect(page.locator("(//span[text()='Имя']/following::input)[1]")).toBeVisible()

  await page.locator(Card.address).scrollIntoViewIfNeeded()
  await CASHE_Page.click(Card.address)

  //^highlight----------------------------------------------------------------------
  await page.locator("(//span[text()='Регион']/following::input)[1]").highlight()
  await page.waitForTimeout(100)
  await page.locator("(//span[text()='Улица']/following::input)[1]").scrollIntoViewIfNeeded()
  await page.locator("(//span[text()='Улица']/following::input)[1]").highlight()
  await page.waitForTimeout(100)
  //^highlight----------------------------------------------------------------------

  await expect(page.locator("(//span[text()='Регион']/following::input)[1]")).toBeVisible()
  await expect(page.locator("(//span[text()='Улица']/following::input)[1]")).toBeVisible()

  //----------------------------------------------------------------------------------------test5

  //5. В правом углу строки поиска кликнуть по кнопку в виде крестика
  await page.locator(MainPage.input_search).hover()
  await page.locator('.el-input__suffix-inner > .el-input__icon').first().click();
  //5. Введенный ранее грз в строке поиска будет очищен, при этом информация о найденных карточках и открытая справа карточка не пропадут.
  await expect(page.locator(MainPage.input_search)).toHaveValue('')
  expect(await page.locator(MainPage.item_line).all()).not.toHaveLength(0)
  await expect(page.locator(Card.card)).toBeVisible()
  await CASHE_Page.click(Card.BTN_CANCEL)

  //----------------------------------------------------------------------------------------test6

  //6. Нажать крестик в правом углу открытой карточки.
  await CASHE_Page.click(Card.BTN_CLOSE_CARD)
  //6. Карточка ГРЗ будет закрыта.
  await expect(page.locator(Card.card)).not.toBeVisible()

  //----------------------------------------------------------------------------------------test7

  //7. Не вводя ГРЗ в строку поиска, нажать на кнопку Искать.
  await CASHE_Page.click(MainPage.BTN_SEARCH)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(3000)
  //7. Произойдет поиск и вывод всех доступных результатов в Редакторе КЕШа.
  expect(page.locator("//div[@class='flex-child txt-bold']")).toContainText("Найдено: 10000 записей")

  //закрытие сессии
  await CASHE_Page.shutDown()
})


test("Проверка поиска по ГРЗ ТС (при вводе некорректных данных). (test 11.2)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)
  await page.waitForLoadState("networkidle")

  //----------------------------------------------------------------------------------------test1

  //1. В поле Поиск по ГРЗ ввести произвольные символы, например: !")(*?:%;№
  await page.locator(MainPage.input_search).highlight()
  await page.waitForTimeout(1000)

  await page.fill(MainPage.input_search, `!")(*?:%;№`)
  //1. Результатом такого запроса должно быть сообщение на месте результирующей таблицы: "В таблице отсутствуют данные".


  //----------------------------------------------------------------------------------------test2

  await page.waitForTimeout(5000)

  //закрытие сессии
  await CASHE_Page.shutDown()
})