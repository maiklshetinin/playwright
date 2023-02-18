import { test, expect } from "@playwright/test";
import OIB, {  Locators, UserCard } from "./OIB";

const login = "SHETININM"
const password = "Asdf123$"
const userLogin="IVANOVAO"

test("Delegate to a new department", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 1080,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login(login, password)

  //1. Зайти в карточку пользователя, перейти во вкладку «Сотрудник».
  //Нажать кнопку «Откомандировать в новый отдел».
  await OIB_Page.getUserCard(userLogin)
  await OIB_Page.click(UserCard.BTN_EMPLOYER)
  await page.waitForTimeout(1000)
  await OIB_Page.click(Locators.BTN_EMPLOYER_DELEGATE_TO_A_NEW_DEPARTMENT)

  //1. Откроется карточка сотрудника, с выделенными обязательными полями для заполнения.
  //- Организация / Подразделение
  expect(page.locator("(//div[@class='auto-input required'])[1]")).toHaveClass("auto-input required")
  //- Должность
  expect(page.locator("(//div[@class='auto-input required'])[2]")).toHaveClass("auto-input required")

  //2. Заполнить обязательные поля. Нажать «Откомандировать».
  await OIB_Page.click("(//div[@class='auto-input required'])[1]")
  await page.getByRole("menuitem").filter({ hasText: 'КТ' }).click()
  await page.locator("div#pane-employee>div>div>div:nth-of-type(7)").click()
  await page.getByTitle("Test1").click()
  await OIB_Page.click(Locators.BTN_EMPLOYER_SEND_ON_A_SECONDMENT)

  //2. Появится уведомление «Данные успешно сохранены».
  //В выпадающем списке «Текущий отдел», можно посмотреть все доступные подразделения, в которые был откомандирован сотрудник. 
  //Можно использовать этот список для повторного возвращения сотрудника в первоначальный отдел.


  await page.waitForTimeout(1000)

  //закрытие сессии
  await OIB_Page.shutDown()
})