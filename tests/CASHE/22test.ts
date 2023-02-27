import { test, expect } from "@playwright/test";
import CASHE, { Card, MainPage } from "./CASHE";

const LOGIN = "SHETININM"
const PASSWORD = "Asdf123$"
const GRZ = 'Р332СТ71'
const SNILS = '015-624-507 26'
const SNILS_ARR = [
  '00000000000',    //3.1. Все нули (11 символов)
  '12345678901',    //3.2. Произвольные цифры (11 символов)
  '123456',         //3.3. Произвольные цифры (6 символов)
  '1',              //3.4. Произвольные цифры (1 символ)
  '*?:;№:"!%:???:?', //3.5. Специальные символы (*?:;№:"!%:???:?)
  'йцукенгшрпамыпа', //3.6. Произвольный текст (йцукенгшрпамыпа)
]



test("ИП Контроль при вводе значений ИНН(test 21)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)
  await page.waitForLoadState("networkidle")

  //----------------------------------------------------------------------------------------test1
  //1. Авторизоваться в модуле Владельцев ТС. //1. Авторизация успешна.
  await expect(page.getByText('УспехАвторизация прошла успешно')).toBeVisible()
  //----------------------------------------------------------------------------------------test2

  //2. Отобрать карточку с типом Владельца ФЛ -> Редактирование карточки (карандаш).
  await page.fill(MainPage.input_search, GRZ)
  await CASHE_Page.click(MainPage.BTN_SEARCH)
  await page.waitForLoadState("networkidle")
  await page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0).click()
  await page.waitForTimeout(1000)
  await page.waitForLoadState("networkidle")
  await CASHE_Page.click(Card.BTN_EDIT)


  //2. В таблице отображается список карточек ГРЗ. Владелец отобранной карточки Физическое Лицо.
  //Открылся режим редактирования данных. Кнопка "Сохранить" - не активна.
  await expect(page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0)).toContainText(GRZ)
  await expect(page.locator(Card.owner)).toContainText('Владелец ФЛ')
  await expect(page.locator(Card.BTN_SAVE)).toHaveAttribute('disabled', 'disabled')

  //----------------------------------------------------------------------------------------test3

  //3. В поле СНИЛС ввести одно из значений: 015-624-507 26 / 562-857-324 23 / 001-666-018 06 / 504-326-589 64
  await page.locator(Card.owner).scrollIntoViewIfNeeded()
  await CASHE_Page.click(Card.owner)
  await page.fill("(//span[text()='СНИЛС']/following::input)[1]", SNILS)

  //3. СНИЛС введен в поле, кнопка Сохранить стала доступна (подсвечена желтым).
  await expect(page.locator("(//span[text()='СНИЛС']/following::input)[1]")).toHaveValue(SNILS)
  await expect(page.locator(Card.BTN_SAVE)).toHaveClass('el-button el-button--success el-button--small')

  //----------------------------------------------------------------------------------------test4
  //4. Нажать Сохранить.
  await CASHE_Page.click(Card.BTN_SAVE)
  //4. Внесенный СНИЛС успешно сохранен. О чем сигнализирует сообщение в правом верхнем углу: "Данные сохранили успешно".
  await expect(page.locator("//div[@class='el-notification right']")).toContainText('Данные сохранили успешно')

  //закрытие сессии
  await CASHE_Page.shutDown()
})