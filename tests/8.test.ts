import { test, expect } from "@playwright/test";
import CASHE, { MainPage } from "./CASHE";

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

test("Источники (на главном экране). (test 8)", async ({ page }) => {
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
  await page.waitForTimeout(1000)
  const itemLine = await page.locator(MainPage.item_line).all()
  for (let i = 0; i < itemLine.length; i++) { 
    //проверяем первое значение, и в конце видимого списка 
    if (i === 0 ||  i === itemLine.length - 1) {
      const time = CASHE_Page.getNewDate(await itemLine[i].getByText(/\d\d:\d\d:\d\d/).innerText())
      //highlight----------------------------------------------------
      await itemLine[i].getByText(/\d\d:\d\d:\d\d/).highlight()
      await itemLine[i].getByText(/\d\d:\d\d:\d\d/).scrollIntoViewIfNeeded()
      await itemLine[i].getByText(LIST[0] || LIST[1]).highlight()
      //highlight----------------------------------------------------

      await expect(itemLine[i].getByText(LIST[0] || LIST[1])).toContainText(LIST[0] || LIST[1])
      expect(typeof time.getTime() === 'number').toBe(true)
    }
  }

  //закрытие сессии
  await CASHE_Page.shutDown()
})