import { test, expect } from "@playwright/test";
import OIB, {  Locators, LOGIN, PASSWORD, SpanLocators, UserCard } from "./OIB";

const login = "SHETININM"
const organization = '8Б2ПДПС МО'
const subdivision = "ИАЗ"
const job_title = "321"
const organization_full = "Исполнение административного законодательства. 8 Б 2 П ДПС (южный) ГИБДД ГУ МВД России по Московской области"

test("Создание Сотрудников для выбранных пользователей (test 16)", async ({ page }) => {
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

  await OIB_Page.findUser(login)
  //TODO: заменить метод на загрузку или ответа от сервера бывают проблеммы при поиске
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1000)
  await OIB_Page.selectUserCheckbox(login)

  //1. Отмеченные пользователи будут выделены синим контуром и чекбоксом.
  await expect(page.locator("//tr[contains(@class, 'current')]").getByText(OIB_Page.getRegExp(login))).toHaveText(login)

  //------------------------------------------------------------------------------------------------------------test2

  //2. В правом верхнем углу нажать на кнопку: «Создать сотрудников для выбранных пользователей».
  await OIB_Page.click(Locators.BTN_CREATE_EMPLOYEES_FOR_SELECTED_USERS)

  //2. Откроется окно с добавлением информации по должности и подразделению сотрудника.
  await expect(page.locator("(//div[@class='modal-window']//div)[1]")).toBeVisible()

  //------------------------------------------------------------------------------------------------------------test3

  //3. Выбрать значения в выпадающих списках, соответствующих пунктов. Обязательными являются:
  //- Организация/Подразделение

  await OIB_Page.click("(//span[@class='el-cascader el-cascader--mini']//span)[3]")
  await page.locator("(//ul[@class='el-cascader-menu'])[1]").getByText(OIB_Page.getRegExp(organization)).click()
  await page.locator("(//ul[@class='el-cascader-menu'])[2]").getByText(OIB_Page.getRegExp(subdivision)).click()

  //- Должность
  await OIB_Page.click("(//input[@placeholder='Значение'])[1]")
  await page.locator("(//div[@x-placement='bottom-start']//div)[1]").getByText(OIB_Page.getRegExp(job_title)).nth(0).click()

  //3. В доступных формах выбраны требуемые значениями (достаточно заполнения обязательных форм).
  expect(page.locator("(//span[@class='el-cascader el-cascader--mini']//span)[3]")).toContainText(`${organization} / ${subdivision}`)
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