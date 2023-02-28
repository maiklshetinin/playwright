import { test, expect } from "@playwright/test";
import CASHE, { Card, MainPage } from "./CASHE";

const LOGIN = "SHETININM"
const PASSWORD = "Asdf123$"
const LIST = [
  'Реестр ТС',
  'Редактор ТС',
  'Реестр ТС (АСУР)',
  'ФНС (ЕГРЮЛ/ЕГРИП)',
  'Реестр ТС (БД)',
  'Адрес в ВФ',
  'Иностранные документы',
  'Иностранцы (ФТС)'
]

test("Источники (в карточке). (test 9)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)

  //----------------------------------------------------------------------------------------test1

  //1. На главном экране, в поле Источники кликнуть в поле "Выберите источник актуализации".
  await CASHE_Page.click(MainPage.input_sources)
  await page.waitForLoadState("networkidle")
  //1. Откроется выпадающий список, в котором можно выбрать следующие параметры: LIST
  const arr = await page.locator("//ul[@class='el-scrollbar__view el-select-dropdown__list']").getByRole("listitem").all()
  arr.forEach(async (li, i) => await expect(li).toHaveText(LIST[i]))

  //----------------------------------------------------------------------------------------test2

  //2. Выбрать один или несколько источников (например: Реестр ТС и Редактор ТС).
  await page.getByText(LIST[0]).nth(0).click()
  await page.getByText(LIST[1]).nth(0).click()
  await CASHE_Page.click("//i[contains(@class,'el-select__caret el-input__icon')]")
  await page.waitForLoadState("networkidle")
  await page.waitForLoadState("domcontentloaded")

  //2. По выбранным параметрам сразу начнется поиск и будут выведены доступные результаты.
  //В поле Время последней актуализации и Источники можно увидеть время обновления и названия источника обновления.
  await page.waitForTimeout(5000)

  //highlight----------------------------------------------------
  await page.locator(MainPage.table).getByText(LIST[0]).nth(0).highlight()
  await page.waitForTimeout(50)
  await page.locator(MainPage.table).getByText(LIST[1]).nth(0).highlight()
  //highlight----------------------------------------------------


  await expect(page.locator(MainPage.table).getByText(LIST[0]).nth(0)).toContainText(LIST[0])
  await expect(page.locator(MainPage.table).getByText(LIST[1]).nth(0)).toContainText(LIST[1])

  //----------------------------------------------------------------------------------------test3
  //3. Выбрать одну из отобранных записей (открыть карточку).
  await page.locator(MainPage.item_line).nth(0).click()
  await page.waitForLoadState("domcontentloaded")
  await page.waitForTimeout(1000)


  //3. В карточке будет выведена таблица с источником обновления и временем последней актуализации записи.
  // await page.waitForTimeout(2000)
  const rows = await page.locator(Card.table).getByRole("row").all()
  for (let i = 0; i < rows.length; i++) {
    if (i === 0) continue

    //highlight----------------------------------------------------
    await rows[i].getByText(/^\D/).highlight()
    await page.waitForTimeout(200)
    await rows[i].getByText(/\d\d:\d\d:\d\d/).highlight()
    await page.waitForTimeout(200)
    //highlight----------------------------------------------------

    const source = await rows[i].getByText(/^\D/).innerText()
    const time = CASHE_Page.getNewDate(await rows[i].getByText(/\d\d:\d\d:\d\d/).innerText())

    expect(LIST.includes(source)).toBe(true)
    expect(typeof time.getTime() === 'number').toBe(true)
  }

  //закрытие сессии
  await CASHE_Page.shutDown()
})