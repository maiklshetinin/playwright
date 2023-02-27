import { test, expect } from "@playwright/test";
import OIB, { CheckboxLocators, DivLocators, InputLocators, LAST_NAME, Locators, LOGIN, PASSWORD, SpanLocators, UserCard } from "./OIB";

const login = "SHETININM"
const password = "Asdf123$"
const abc_search = ["А", "Б", "I", "S"]
const today = new Date()
const fromDate = "01.01.2021"
const beforeDate = "01.01.2027"
const findUserBYLastName = "Иванов"
const findUserByLogin = "IVANOVI"
const right = "Ввод грубых статей"
const division = "Testtest"

test("Search records, search filters (test 8.1, 8.2)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 800,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login(login, password)

  //----------------------------------------------------------------------------------------test1

  //1. Прокликать в алфавитном указателе, с лева, несколько значений, Например: *, А, Б, R, L.
  //1. Группировка и отображение записей в зависимости от выбранного параметра.

  await page.locator(DivLocators.abc_search).getByText(abc_search[0]).click()
  await page.waitForLoadState('networkidle')
  const lastName1 = await OIB_Page.getTdInnerText(OIB_Page.getFirstRowInTable(), abc_search[0])
  expect(lastName1[0]).toBe(abc_search[0])

  await page.locator(DivLocators.abc_search).getByText(abc_search[1]).click()
  await page.waitForLoadState('networkidle')
  const lastName2 = await OIB_Page.getTdInnerText(OIB_Page.getFirstRowInTable(), abc_search[1])
  expect(lastName2[0]).toBe(abc_search[1])

  await page.locator(DivLocators.abc_search).getByText(abc_search[2]).click()
  await page.waitForLoadState('networkidle')
  const lastName3 = await OIB_Page.getTdInnerText(OIB_Page.getFirstRowInTable(), abc_search[2])
  expect(lastName3[0]).toBe(abc_search[2])

  await page.locator(DivLocators.abc_search).getByText(abc_search[3]).click()
  await page.waitForLoadState('networkidle')
  const lastName4 = await OIB_Page.getTdInnerText(OIB_Page.getFirstRowInTable(), abc_search[3])
  expect(lastName4[0]).toBe(abc_search[3])

  //----------------------------------------------------------------------------------------test2
  //2. Проставить чекбоксы в соответствующих значениях: Активные, Сотрудники, Роль.
  await page.locator(CheckboxLocators.employer).click()
  await page.waitForLoadState('networkidle')
  await page.locator(CheckboxLocators.role).highlight()

  //2. Записи соответствующие чекбоксу сразу отображаются в области отображения записей.
  // Пользователи, у которых в карточке, заполнены данные сотрудника, в поле «СОТР» - имеют зеленную галочку.
  await page.locator(DivLocators.abc_search).getByText(abc_search[3]).click()
  await page.waitForLoadState('networkidle')

  await OIB_Page.getAllRowsInTable().locator("//td//div[contains(@class, 'common_icon_filter marked_circle_green')]").nth(0).click()
  await OIB_Page.click(UserCard.BTN_EMPLOYER)
  await OIB_Page.click(Locators.BTN_EMPLOYER_EDIT)
  expect(await page.locator(InputLocators.EMPLOYER_firstName).inputValue()).not.toBe('')
  expect(await page.locator(InputLocators.EMPLOYER_lastName).inputValue()).not.toBe('')
  expect(new Date(await page.locator(InputLocators.EMPLOYER_date_of_dismissal).inputValue()) > today).toBe(true)

  // Если срок активности сотрудника истек, будет отображаться красный крестик (Х).
  await OIB_Page.getAllRowsInTable().locator("//td//div[contains(@class, 'common_icon_filter marked_circle_red')]").nth(0).click()
  await OIB_Page.click(UserCard.BTN_EMPLOYER)
  await OIB_Page.click(Locators.BTN_EMPLOYER_EDIT)
  expect(new Date(await page.locator(InputLocators.EMPLOYER_date_of_dismissal).inputValue()) > today).toBe(false)

  // Если сотрудник для данного пользователя вовсе не создавался, данное поле будет пустым.
  //TODO:уточнить как проверить пустой див

  // Так же, в центре, над таблицей отображаемых записей, отображается общее количество записей в таблице, в данный момент.
  const countRowsInDiv = parseInt((await page.locator(DivLocators.count_rows).innerText()).replace(/[^\d]/g, ''))
  const countRowsInTable = await OIB_Page.getTableLength()
  expect(countRowsInDiv).toBe(countRowsInTable)

  await page.waitForTimeout(1000)
  //закрытие сессии
  await OIB_Page.shutDown()
})


test("Search records, search filters (test 8.3, 8.4)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 800,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login(login, password)

  //----------------------------------------------------------------------------------------test3
  //   3. В области ввода «Окончание доступа». Первое поле обозначает «От», второе поле даты – «До».
  // - Выбрать и проверить отображение ввода из календаря промежутка даты.
  // - Проверить ввод и отображение данных, при установки промежутка даты вручную.
  //TODO:уточнить как работает и что проверять
  // await page.locator(CheckboxLocators.employer).click()
  // await page.fill(InputLocators.end_of_access_from, fromDate)
  // await page.fill(InputLocators.end_of_access_before, beforeDate)

  // 3. Отображает записи за выбранный период времени, у которых ОКАНЧИВАЕТСЯ доступ к ресурсу.
  // При этом, при отсутствии установленной даты в первом поле поиск осуществляется по маске «От текущей даты До установленной
  // или От установленной, До текущей.


  //----------------------------------------------------------------------------------------test4

  //4. Область «Поиск пользователей» начать вводить:
  // - ФИО
  await OIB_Page.findUser(findUserBYLastName)
  await page.waitForLoadState('networkidle')
  //4. Отображает контекстный поиск по введенному значению.
  expect(OIB_Page.getFirstRowInTable().getByText(findUserBYLastName)).toContainText(findUserBYLastName)

  // - Дата начала доступа
  //TODO:уточнить как именно должно работать

  // - Логин
  await OIB_Page.findUser(findUserByLogin)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  await OIB_Page.getAllRowsInTable().getByText(OIB_Page.getRegExp(findUserByLogin)).highlight()
  await page.waitForTimeout(1000)
  //4. Отображает контекстный поиск по введенному значению.
  expect(OIB_Page.getAllRowsInTable().getByText(OIB_Page.getRegExp(findUserByLogin))).toContainText(findUserByLogin)
  await page.fill(InputLocators.search_user,'')

  await page.waitForTimeout(1000)
  //закрытие сессии
  await OIB_Page.shutDown()
})


test("Search records, search filters (test 8.5, 8.6)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 800,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login(login, password)

 //----------------------------------------------------------------------------------------test5
  // 5. В выпадающем списке поля «Список прав» прав доступа у пользователей в отображаемой таблице,
  //выбрать одно или несколько значений. Нажать Искать.

  await OIB_Page.click(InputLocators.list_of_rights)
  await page.locator("(//div[@x-placement='bottom-start']//div)[1]").getByText(right).click()
  await OIB_Page.click(Locators.BTN_SEARCH)
  await page.waitForLoadState('networkidle')
  await OIB_Page.getFirstRowInTable().click()
  await OIB_Page.click(UserCard.BTN_RIGHTS)
  await page.locator("//div[contains(@class,'rights-list flex-child')]").getByText(right).highlight()

  // 5. Пользователи будут отсортированы в соответствии с выбранным списком прав, соответственно,
  // будут отображаться только те пользователи, у которых эти (выбранные) права есть.
  expect(page.locator("//div[contains(@class,'rights-list flex-child')]").getByText(right)).toContainText(right)
  await page.locator(InputLocators.list_of_rights).locator("(//i[@class='el-tag__close el-icon-close'])[1]").click()

  //----------------------------------------------------------------------------------------test6
  //6. В выпадающем списке поля «Список подразделений», выбрать одно или несколько значений (у известных пользователей).
  //Нажать Искать.
  await OIB_Page.click(InputLocators.list_of_divisions)
  // await page.waitForLoadState('networkidle')
  await page.getByText(division).highlight()
  await page.getByText(division).click()
  await OIB_Page.click(Locators.BTN_SEARCH)
  await page.waitForLoadState('networkidle')
  await OIB_Page.getFirstRowInTable().click()
  //6. Пользователи будут отсортированы в соответствии с выбранным подразделением.
  await page.locator(DivLocators.department_employee).highlight()
  expect(page.locator(DivLocators.department_employee)).toContainText(division)

  await page.waitForTimeout(1000)
  //закрытие сессии
  await OIB_Page.shutDown()
})


test("Search records, search filters (test 8.7, 8.8)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 800,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login(login, password)
  await page.waitForLoadState('networkidle')

 //----------------------------------------------------------------------------------------test7

  // 7. Сформировав результат в таблице, требуется проверить выгрузку данных.
  // Нажать на кнопки (в левом верхнем углу):
  // - csv
  const csv = await Promise.all([
    page.waitForEvent("download"),
    OIB_Page.click(Locators.BTN_DOWNLOAD_CSV)
  ])

  // - xlsx
  const xlsx = await Promise.all([
    page.waitForEvent("download"),
    OIB_Page.click(Locators.BTN_DOWNLOAD_XLSX)
  ])

  // - pdf
  const pdf = await Promise.all([
    page.waitForEvent("download"),
    OIB_Page.click(Locators.BTN_DOWNLOAD_PDF)
  ])

  //   7. Таблица, отображаемая пользователю будет скачана в соответствующих форматах.
  expect(OIB_Page.getExtension(csv[0].suggestedFilename())).toBe("csv")
  expect(OIB_Page.getExtension(xlsx[0].suggestedFilename())).toBe("xlsx")
  expect(OIB_Page.getExtension(pdf[0].suggestedFilename())).toBe("pdf")
  //TODO:делать ли проверку в документах?
  // Проверить, что документ скачивается и отображение данных в сформированных документах корректное.

  //----------------------------------------------------------------------------------------test8

  // 8. В главном окне программы, при открытой таблице пользователей произвести сортировку записей,
  // нажав на соответствующее название поля столбца таблицы.



  // 8. При сортировки записей таблицы (по возрастанию или по убыванию), соответственно меняется значок в виде стрелочки,
  // указывая направление вверх или вниз.


  await page.waitForTimeout(1000)
  //закрытие сессии
  await OIB_Page.shutDown()
})



















































