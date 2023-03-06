import OIB, { DivLocators, InputLocators, Locators, LOGIN, PASSWORD, SpanLocators, UserCard } from './OIB';
import { test, expect, chromium } from "@playwright/test";


let newUserLogin = ""
const newUserLastName = "Иванова"
const newUserFirstName = "Ира"
const organization = '8Б2ПДПС МО'
const subdivision = "ИАЗ"
const job_title = "321"
const organization_full = "Исполнение административного законодательства. 8 Б 2 П ДПС (южный) ГИБДД ГУ МВД России по Московской области"
const department = '321'
const organization_full_job_title = 'Комитет по транспорту - 321'



test.only("Создание новой учетной записи пользователя. (test 10)", async ({ page }) => {
  const OIB_Page = new OIB(page)
  await OIB_Page.login(LOGIN, PASSWORD)

  //----------------------------------------------------------------------------------------test1

  //Нажать «+» в правом верхнем углу.
  await OIB_Page.click(Locators.BTN_ADD_A_NEW_USER)
  //1. Создается пустая карточка для заполнения данными учетной записи.
  await expect(page.locator(UserCard.userCard)).toBeVisible()

  //----------------------------------------------------------------------------------------test2

  // Заполнить (обязательные поля) Фамилию и Логин сотрудника.
  await page.waitForTimeout(1000)
  await page.fill(InputLocators.firstName, newUserFirstName)
  await page.fill(InputLocators.lastName, newUserLastName)
  await page.click(UserCard.BTN_GENERATE_LOGIN_BY_NAME)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
  newUserLogin = await page.locator(InputLocators.login).inputValue()
  //Кнопка Создать подсвечена.
  await expect(page.locator(UserCard.BTN_CREATE)).not.toHaveAttribute("disabled", "disabled")

  //----------------------------------------------------------------------------------------test3
  //Нажать кнопку Создать.
  await OIB_Page.click(UserCard.BTN_CREATE)
  //3. Пользователь создан.
  await expect(OIB_Page.getFirstRow(DivLocators.table_body).getByText(newUserLastName).nth(0)).toHaveText(`${newUserLastName} ${newUserFirstName[0]}.`)

  //закрытие сессии
  await OIB_Page.shutDown()
})



test.only("Создание Сотрудников для выбранных пользователей (test 16)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 1080,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login(LOGIN, PASSWORD)

  //------------------------------------------------------------------------------------------------------------test1

  //1. Найти и отметить чекбоксом, напротив каждой записи, необходимых пользователей.
  //отключение чекбокса Активные
  await page.click("(//span[@class='el-checkbox__inner'])[1]")
  await page.waitForLoadState("networkidle")

  await OIB_Page.findUser(newUserLogin)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1000)
  await OIB_Page.selectUserCheckbox(newUserLogin)

  //1. Отмеченные пользователи будут выделены синим контуром и чекбоксом.
  expect(page.locator("//tr[contains(@class, 'current')]").getByText(OIB_Page.getRegExp(newUserLogin))).toHaveText(newUserLogin)

  //------------------------------------------------------------------------------------------------------------test2

  //2. В правом верхнем углу нажать на кнопку: «Создать сотрудников для выбранных пользователей».
  await OIB_Page.click(Locators.BTN_CREATE_EMPLOYEES_FOR_SELECTED_USERS)

  //2. Откроется окно с добавлением информации по должности и подразделению сотрудника.
  await expect(page.locator("(//div[@class='modal-window']//div)[1]")).toBeVisible()

  //------------------------------------------------------------------------------------------------------------test3

  //3. Выбрать значения в выпадающих списках, соответствующих пунктов. Обязательными являются:
  //- Организация/Подразделение

  await OIB_Page.click("(//span[@class='el-cascader el-cascader--mini']//span)[3]")
  await page.waitForTimeout(1000)
  await page.locator("(//ul[@class='el-cascader-menu'])[1]").getByText(OIB_Page.getRegExp(organization)).click()
  await page.waitForTimeout(1000)
  await page.locator("(//ul[@class='el-cascader-menu'])[2]").getByText(OIB_Page.getRegExp(subdivision)).click()

  //- Должность
  await OIB_Page.click("(//input[@placeholder='Значение'])[1]")
  await page.waitForTimeout(1000)
  await page.locator("(//div[@x-placement='bottom-start']//div)[1]").getByText(OIB_Page.getRegExp(job_title)).nth(0).click()

  //3. В доступных формах выбраны требуемые значениями (достаточно заполнения обязательных форм).
  await expect(page.locator("(//span[@class='el-cascader el-cascader--mini']//span)[3]")).toContainText(`${organization} / ${subdivision}`)
  expect(await page.locator("(//input[@placeholder='Значение'])[1]").inputValue()).toBe(job_title)

  //------------------------------------------------------------------------------------------------------------test4

  //4. Нажать кнопку Создать(Cохранить).
  await OIB_Page.click(UserCard.BTN_SAVE)
  //4. У выбранного пользователя будет назначен Сотрудник, с заданными параметрами.
  //Важно, чтобы у выбранных пользователей, во вкладке «Права» были указаны «Имя» и «Фамилия»,
  //иначе будет получено сообщение об ошибке.

  const firstName = await page.locator(SpanLocators.firstName).innerText()
  const lastName = await page.locator(SpanLocators.lastName).innerText()

  await expect(page.locator("//h2[text()='Успех!']")).toContainText("Успех")
  await OIB_Page.click(UserCard.BTN_EMPLOYER)
  await expect(page.locator(SpanLocators.firstName)).toHaveText(firstName)
  await expect(page.locator(SpanLocators.lastName)).toHaveText(lastName)
  await expect(page.getByText(organization_full).last()).toContainText(organization_full)
  await expect(page.getByText(OIB_Page.getRegExp(job_title)).last()).toHaveText(job_title)

  //закрытие сессии
  await OIB_Page.shutDown()
})



test.only("Откомандировать в новый отдел (test 17)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 1080,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login(LOGIN, PASSWORD)

  //1. Зайти в карточку пользователя, перейти во вкладку «Сотрудник».
  //Нажать кнопку «Откомандировать в новый отдел».
  await OIB_Page.getUserCard(newUserLogin)
  await page.waitForTimeout(1000)

  await OIB_Page.click(UserCard.BTN_EMPLOYER)
  await page.waitForTimeout(1000)
  await OIB_Page.click(Locators.BTN_EMPLOYER_DELEGATE_TO_A_NEW_DEPARTMENT)

  //1. Откроется карточка сотрудника, с выделенными обязательными полями для заполнения.
  //- Организация / Подразделение
  await expect(page.locator("(//div[@class='auto-input required'])[1]")).toHaveClass("auto-input required")
  //- Должность
  await expect(page.locator("(//div[@class='auto-input required'])[2]")).toHaveClass("auto-input required")

  // 2. Заполнить обязательные поля. Нажать «Откомандировать».

  await page.waitForTimeout(1000)
  await OIB_Page.click("(//div[@class='auto-input required'])[1]")
  await page.getByRole("menuitem").filter({ hasText: 'КТ' }).click()
  await page.locator("div#pane-employee>div>div>div:nth-of-type(7)").click()

  await page.getByTitle(department).click()
  await OIB_Page.click(Locators.BTN_EMPLOYER_SEND_ON_A_SECONDMENT)


  //2. Появится уведомление «Данные успешно сохранены».
  await expect(page.locator("//div[@class='el-notification right']")).toContainText('Данные сохранили успешно')
  //В выпадающем списке «Текущий отдел», можно посмотреть все доступные подразделения, в которые был откомандирован сотрудник.
  //Можно использовать этот список для повторного возвращения сотрудника в первоначальный отдел.
  await page.click("(//span[text()='Текущий отдел']/following::input)[1]")
  await page.waitForTimeout(1000)
  await page.getByText(organization_full_job_title).highlight()
  await expect(page.getByText(organization_full_job_title)).toContainText(organization_full_job_title)

  //закрытие сессии
  await OIB_Page.shutDown()
})

