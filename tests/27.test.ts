import { test, expect } from "@playwright/test";
import CASHE, { Card, MainPage } from "./CASHE";

const LOGIN = "SHETININM"
const PASSWORD = "Asdf123$"
const GRZ = 'Е662НР750'
const OKPO = '93326504'
const OKPO_ARR = [
  '0',               //3.1. Все нули (1 символов). Сохранить.
  '1234567890',      //3.2. произвольные цифры (10 символов). Сохранить.
  '12345',           //3.3. Произвольные цифры (5 символов). Сохранить.
  '12345678',        //3.4. Произвольные цифры (8 символов). Сохранить.
  '*?:;№:"!??',      //3.5. Специальные символы (*?:;№:"!??). Сохранить.
  'укенгш рпам',     //3.6. Произвольный текст (укенгш рпам). Сохранить.
]



test("ЮЛ Контроль при вводе значений ОКПО (test 27)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)

  //----------------------------------------------------------------------------------------test1
  //1. Авторизоваться в модуле Владельцев ТС. //1. Авторизация успешна.
  await expect(page.getByText('УспехАвторизация прошла успешно')).toBeVisible()
  //----------------------------------------------------------------------------------------test2

  //2. Отобрать карточку с типом Владельца ИП -> Редактирование карточки (карандаш).
  await page.fill(MainPage.input_search, GRZ)
  await CASHE_Page.click(MainPage.BTN_SEARCH)
  await page.waitForLoadState("networkidle")
  await page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0).click()
  await page.waitForTimeout(1000)
  await page.waitForLoadState("networkidle")
  await CASHE_Page.click(Card.BTN_EDIT)

  //2. В таблице отображается список карточек ГРЗ. Владелец отобранной карточки Индивидуальный предприниматель.
  //Открылся режим редактирования данных. Кнопка "Сохранить" - не активна.
  await expect(page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0)).toContainText(GRZ)
  await expect(page.locator(Card.owner)).toContainText('Владелец ЮЛ')
  await expect(page.locator(Card.BTN_SAVE)).toHaveAttribute('disabled', 'disabled')

  //----------------------------------------------------------------------------------------test3

  //3. В поле ОКПО ввести одно из значений: 93326504 / 00040778 / 56330100 / 17514186
  await page.locator(Card.owner).scrollIntoViewIfNeeded()
  await CASHE_Page.click(Card.owner)
  await page.locator("(//span[text()='ОКПО']/following::input)[1]").scrollIntoViewIfNeeded()
  await page.waitForTimeout(1000)
  await page.fill("(//span[text()='ОКПО']/following::input)[1]", OKPO)
  //3. ОКПО введен в поле, кнопка Сохранить стала доступна (подсвечена желтым).
  await expect(page.locator(Card.BTN_SAVE)).toHaveClass('el-button el-button--success el-button--small')

  //----------------------------------------------------------------------------------------test4
  //4. Нажать Сохранить.
  await CASHE_Page.click(Card.BTN_SAVE)
  //4. Внесенный ОКПО успешно сохранен. О чем сигнализирует сообщение в правом верхнем углу: "Данные сохранили успешно".
  await expect(page.locator("//div[@class='el-notification right']")).toContainText('Данные сохранили успешно')

  //очистка ОКПО
  await CASHE_Page.click(Card.BTN_EDIT)
  await page.locator(Card.owner).scrollIntoViewIfNeeded()
  // await CASHE_Page.click(Card.owner)
  await page.fill("(//span[text()='ОКПО']/following::input)[1]", '')
  await CASHE_Page.click(Card.BTN_SAVE)
  //проверка очистки
  await expect(page.locator("//div[@class='el-notification right']")).toContainText('Данные сохранили успешно')


  //закрытие сессии
  await CASHE_Page.shutDown()
})

test("ЮЛ Контроль при вводе значений ОКПО  (валидация) (test 27.1)", async ({ page }) => {
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
  await expect(page.locator(Card.owner)).toContainText('Владелец ЮЛ')
  await expect(page.locator(Card.BTN_SAVE)).toHaveAttribute('disabled', 'disabled')

  //----------------------------------------------------------------------------------------test3

  //3. В поле ОКПО ввести значения: 
  //3.1. Все нули (1 символов). Сохранить.
  //3.2. произвольные цифры (10 символов). Сохранить.
  //3.3. Произвольные цифры (5 символов). Сохранить.
  //3.4. Произвольные цифры (8 символов). Сохранить.
  //3.5. Специальные символы (*?:;№:"!??). Сохранить.
  //3.6. Произвольный текст (укенгш рпам). Сохранить.

  //3. ОКПО введен в поле, кнопка Сохранить стала доступна (подсвечена желтым).
  //Во всех пунктах (3.1., 3.2., 3.3., 3.4., 3.5., 3.6.) - выводится сообщение под полем ввода об ошибке: "Значение поля введено неверно."
  //Выводится всплывающее сообщение: "Неверно заполненные поля!" (при нажатии Сохранить).
  //Внесенные изменения сохранены не были.
  //Режим редактирования активен.
  await page.locator(Card.owner).scrollIntoViewIfNeeded()
  await CASHE_Page.click(Card.owner)
  await page.locator(Card.BTN_SAVE).scrollIntoViewIfNeeded()


  for (const okpo of OKPO_ARR) {
    await page.click("(//span[text()='ОКПО']/following::input)[1]")
    await page.fill("(//span[text()='ОКПО']/following::input)[1]", okpo)
    await page.click("(//span[text()='ИНН']/following::input)[1]")
    await page.waitForTimeout(1000)
    await expect(page.locator("//div[text()='Значение поля введено неверно.']")).toBeVisible()
    await CASHE_Page.click(Card.BTN_SAVE)

    await page.locator("//div[@class='el-notification right']").last().highlight()

    await expect(page.locator("//div[@class='el-notification right']").last()).toContainText("Неверно заполненные поля!")

    await page.fill("(//span[text()='ОКПО']/following::input)[1]", '')
  }

  await expect(page.locator(Card.BTN_SAVE)).toBeVisible()

  //закрытие сессии
  await CASHE_Page.shutDown()
})