import { test, expect } from "@playwright/test";
import OIB, { ConnectionLog,  Locators, LOGIN, PASSWORD } from "./OIB";

const hour = String(new Date().getHours())
const date = String(new Date().getDate())
const ms = new Date().getTime()
const fromDate = "01.01.2022 00:00:00"
const beforeDate = "01.02.2022 00:00:00"
const division = "МАДИ"
const userName = "GORSHKOVI"


test("Connection Log (test 9.1, 9.2)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 800,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login(LOGIN, PASSWORD)

  //----------------------------------------------------------------------------------------test1

  //1. На главном экране, в правом верхнем углу, нажать кнопку «Журнал подключений»
  await OIB_Page.click(Locators.BTN_CONNECTION_LOG)
  //1. Откроется окно, в текущей вкладке с выставленными подключениями за последний час.
  //Максимально допустимая выборка в таблице (в том числе и для выгрузки = 40.000 записей).
  await expect(page.locator(ConnectionLog.modal)).toBeVisible()

  //----------------------------------------------------------------------------------------test2
  //   2. Проверить все кнопки с доступным периодом:
  // - За час
  await OIB_Page.click(ConnectionLog.BTN_HOUR)
  await page.waitForLoadState('networkidle')
  // 2. Соответствующая таблица с данными формируется, в зависимости от выставленных параметров периода.
  await OIB_Page.getFirstRow(ConnectionLog.table).getByText(`${hour}:`).highlight()
  await page.waitForTimeout(1000)
  await expect(OIB_Page.getFirstRow(ConnectionLog.table).getByText(`${hour}:`)).toContainText(hour)

  // - Сегодня
  await OIB_Page.click(ConnectionLog.BTN_TODAY)
  await page.waitForLoadState('networkidle')
  // 2. Соответствующая таблица с данными формируется, в зависимости от выставленных параметров периода.
  await OIB_Page.getFirstRow(ConnectionLog.table).getByText(/\d\d\.\d\d\.\d\d\d\d/).highlight()
  await page.waitForTimeout(1000)
  await expect(OIB_Page.getFirstRow(ConnectionLog.table).getByText(/\d\d\.\d\d\.\d\d\d\d/)).toContainText(date)

  // - За сутки
  // - За неделю
  // - За месяц
  // - За год
  // - Все

  //закрытие сессии
  await OIB_Page.shutDown()
})

test("Connection Log (test 9.3)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 800,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login(LOGIN, PASSWORD)

  //----------------------------------------------------------------------------------------test1
  //TODO: некорректный ввод в инпут
  //1. На главном экране, в правом верхнем углу, нажать кнопку «Журнал подключений»
  await OIB_Page.click(Locators.BTN_CONNECTION_LOG)
  //1. Откроется окно, в текущей вкладке с выставленными подключениями за последний час.
  //Максимально допустимая выборка в таблице (в том числе и для выгрузки = 40.000 записей).
  await expect(page.locator(ConnectionLog.modal)).toBeVisible()

  //----------------------------------------------------------------------------------------test3
  // 3. Задать период отображения в ручную, в соответствующем поле выбора интервала даты. Нажать Искать
  await page.fill(ConnectionLog.inputFromDate, fromDate)
  await page.fill(ConnectionLog.inputBeforeDate, beforeDate)
  await page.click(ConnectionLog.BTN_SEARCH)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(3000)

  //3. Формируется список данных, за выставленный период.

  const period = await page.locator(ConnectionLog.table).getByRole("row").getByText(/\d\d\.\d\d\.\d\d\d\d/).all()
  const from = OIB_Page.getNewDate(fromDate)
  const before = OIB_Page.getNewDate(beforeDate)
  for (let i = 0; i < period.length; i++) {
    if (i === 0 || i === period.length - 1) {
      const time = OIB_Page.getNewDate(await period[i].innerText())
      expect(from < time && time < before).toBe(true)
    }
  }

  //закрытие сессии
  await OIB_Page.shutDown()
})

test("Connection Log (test 9.4)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 800,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login(LOGIN, PASSWORD)
  await page.waitForLoadState('networkidle')

  //----------------------------------------------------------------------------------------test1

  //1. На главном экране, в правом верхнем углу, нажать кнопку «Журнал подключений»
  await OIB_Page.click(Locators.BTN_CONNECTION_LOG)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
  //1. Откроется окно, в текущей вкладке с выставленными подключениями за последний час.
  //Максимально допустимая выборка в таблице (в том числе и для выгрузки = 40.000 записей).
  await expect(page.locator(ConnectionLog.modal)).toBeVisible()

  //----------------------------------------------------------------------------------------test4

  // // 4. Выгрузить полученные значения в допустимых форматах и проверить визуально:
  // - csv
  const csv = await Promise.all([
    page.waitForEvent("download"),
    OIB_Page.click(ConnectionLog.BTN_DOWNLOAD_CSV)
  ])

  // - xlsx
  const xlsx = await Promise.all([
    page.waitForEvent("download"),
    OIB_Page.click(ConnectionLog.BTN_DOWNLOAD_XLSX)
  ])

  // - pdf
  const pdf = await Promise.all([
    page.waitForEvent("download"),
    OIB_Page.click(ConnectionLog.BTN_DOWNLOAD_PDF)
  ])

  // 4. Документ формируется и загружается на локальный диск.
  // Данные в документе отображаются в читаемом для пользователя виде.
  // Верстка документа корректная.
  expect(OIB_Page.getExtension(csv[0].suggestedFilename())).toBe("csv")
  expect(OIB_Page.getExtension(xlsx[0].suggestedFilename())).toBe("xlsx")
  expect(OIB_Page.getExtension(pdf[0].suggestedFilename())).toBe("pdf")

  //закрытие сессии
  await OIB_Page.shutDown()
})

test("Connection Log (test 9.5)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 800,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login(LOGIN, PASSWORD)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
  //----------------------------------------------------------------------------------------test1

  //1. На главном экране, в правом верхнем углу, нажать кнопку «Журнал подключений»
  await OIB_Page.click(Locators.BTN_CONNECTION_LOG)
  //1. Откроется окно, в текущей вкладке с выставленными подключениями за последний час.
  //Максимально допустимая выборка в таблице (в том числе и для выгрузки = 40.000 записей).
  expect(page.locator(ConnectionLog.modal)).toBeVisible()

  //----------------------------------------------------------------------------------------test5

  // 5. В поле «Список подразделений», выбрать одно или несколько значение. Нажать Поиск.
  await OIB_Page.click(ConnectionLog.input_list_of_divisions)
  await page.waitForTimeout(500)
  await page.locator(ConnectionLog.ul_list_of_divisions).getByText(division).nth(0).scrollIntoViewIfNeeded()
  await page.locator(ConnectionLog.ul_list_of_divisions).getByText(division).nth(0).click()
  await OIB_Page.click(ConnectionLog.BTN_SEARCH)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)


  await OIB_Page.getFirstRow(ConnectionLog.table).getByText(division).scrollIntoViewIfNeeded()
  await OIB_Page.getFirstRow(ConnectionLog.table).getByText(division).highlight()
  // 5. Будут отображены сеансы пользователей, которые являются сотрудниками соответствующего подразделения.
  expect(OIB_Page.getFirstRow(ConnectionLog.table).getByText(division)).toContainText(division)

  //закрытие сессии
  await OIB_Page.shutDown()
})

test("Журнал подключений (test 9.6)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 800,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login(LOGIN, PASSWORD)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
  //----------------------------------------------------------------------------------------test1

  //1. На главном экране, в правом верхнем углу, нажать кнопку «Журнал подключений»
  await OIB_Page.click(Locators.BTN_CONNECTION_LOG)
  await page.waitForTimeout(500)
  //1. Откроется окно, в текущей вкладке с выставленными подключениями за последний час.
  //Максимально допустимая выборка в таблице (в том числе и для выгрузки = 40.000 записей).
  expect(page.locator(ConnectionLog.modal)).toBeVisible()

  // ----------------------------------------------------------------------------------------test6

  // 6. Выбрать требуемый период времени.
  // В графе «Поиск пользователя» начать вводить логин пользователя.
  await page.type(ConnectionLog.inputFromDate, fromDate)
  await page.type(ConnectionLog.inputBeforeDate, beforeDate)
  await page.type(ConnectionLog.input_search, userName)
  await OIB_Page.click(ConnectionLog.BTN_SEARCH)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(4000)

  //6. Будут показаны все совпадения, за выбранный промежуток времени.

  //----------------------------------------------------------------------------------  //проверка по первой и последней строке

  const msFromDate = OIB_Page.getNewDate(fromDate)
  const msBeforeDate = OIB_Page.getNewDate(beforeDate)
  await page.waitForTimeout(1000)
  const rows = await page.getByRole("row").filter({ hasText: userName }).all()

  await rows[0].getByText(userName).nth(0).highlight()
  await page.waitForTimeout(10)
  expect(rows[0].getByText(userName).nth(0)).toContainText(userName)

  await rows[0].getByText(/\d\d\.\d\d\.\d\d\d\d/).nth(0).highlight()
  await page.waitForTimeout(10)
  const dateFirstRow = await rows[0].getByText(/\d\d\.\d\d\.\d\d\d\d/).nth(0).innerText()
  const msInFirstRow = OIB_Page.getNewDate(dateFirstRow)
  expect(msFromDate < msInFirstRow && msInFirstRow < msBeforeDate).toBe(true)

  await rows[rows.length - 1].scrollIntoViewIfNeeded()
  await rows[rows.length - 1].getByText(userName).nth(0).highlight()
  await expect(rows[rows.length - 1].getByText(userName).nth(0)).toContainText(userName)

  await page.waitForTimeout(10)
  const dateFirstRow2 = await rows[0].getByText(/\d\d\.\d\d\.\d\d\d\d/).nth(0).innerText()
  await rows[rows.length - 1].getByText(/\d\d\.\d\d\.\d\d\d\d/).nth(0).highlight()
  const msInLastRow2 = OIB_Page.getNewDate(dateFirstRow2)
  expect(msFromDate < msInLastRow2 && msInLastRow2 < msBeforeDate).toBe(true)


  //---------------------------------------------------------------------------------- //проверка всех строк

  // for (const row of rows) {
  //   // await row.highlight()
  //   //  await row.getByText(userName).nth(0).highlight()
  //   //  await page.waitForTimeout(30)
  //   console.log(row);
  //   await row.getByText(userName).nth(0).highlight()
  //   await page.waitForTimeout(300)
  //   await row.getByText(/\d\d\.\d\d\.\d\d\d\d/).nth(0).highlight()
  //   // expect( row).toContain(userName)
  //   await page.waitForTimeout(300)
  // }

  //----------------------------------------------------------------------------------

  //закрытие сессии
  await OIB_Page.shutDown()
})









































