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

test("Источники (в логах). (test 10)", async ({ page }) => {
  test.slow()
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1000)
  //----------------------------------------------------------------------------------------test1

  //1. На главном экране, в поле Источники кликнуть в поле "Выберите источник актуализации".
  await CASHE_Page.click(MainPage.input_sources)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1000)

  //1. Откроется выпадающий список, в котором можно выбрать следующие параметры: LIST
  const arr = await page.locator("//ul[@class='el-scrollbar__view el-select-dropdown__list']").getByRole("listitem").all()
  arr.forEach(async (li, i) => await expect(li).toHaveText(LIST[i]))

  //----------------------------------------------------------------------------------------test2

  //2. Выбрать один или несколько источников (например: Реестр ТС и Редактор ТС).
  await page.getByText(LIST[0]).nth(0).click()
  await page.getByText(LIST[1]).nth(0).click()
  await CASHE_Page.click("//i[contains(@class,'el-select__caret el-input__icon')]")
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(5000)


  //2. По выбранным параметрам сразу начнется поиск и будут выведены доступные результаты.
  //В поле Время последней актуализации и Источники можно увидеть время обновления и названия источника обновления.


  //highlight----------------------------------------------------
  await page.locator(MainPage.table).getByText(LIST[0]).nth(0).highlight()
  await page.waitForTimeout(50)
  await page.locator(MainPage.table).getByText(LIST[1]).nth(0).highlight()
  //highlight----------------------------------------------------


  await expect(page.locator(MainPage.table).getByText(LIST[0]).nth(0)).toContainText(LIST[0])
  await expect(page.locator(MainPage.table).getByText(LIST[1]).nth(0)).toContainText(LIST[1])

  //----------------------------------------------------------------------------------------test3
  //3. Выбрать одну из отобранных записей (открыть карточку) и перейти в блок ЛОГ.
  await page.locator(MainPage.item_line).nth(0).click()
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1000)
  await CASHE_Page.click(Card.BTN_LOG)
  //3. Отобразится окно Логов, записанных в процессе работы с карточкой или актуализации данных где будут указаны более
  // подробные данные о источнике обновления, времени и обновленных данных в случае, если такие будут.
  // Если после получения ответа из внешнего источника не было необходимости вносить изменения(все сведения остались прежними),
  // то в ЛОГе прописывается строка о том, когда был получен ответ из внешнего источника, но без возможности раскрыть запись.




  //???????????????????????????????





  //закрытие сессии
  await CASHE_Page.shutDown()
})