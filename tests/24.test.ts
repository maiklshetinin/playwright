import { test, expect } from "@playwright/test";
import CASHE, { Card, MainPage } from "./CASHE";

const LOGIN = "SHETININM"
const PASSWORD = "Asdf123$"
const GRZ = 'С897ХН777'
const INN = "7729754577"
const INN_FOR_IP = '772065003180'//ИНН (пример: 772065003180 - для ИП/ФЛ 12 символов)
const OGRN = "1137746980051"
const OGRN_FOR_IP = '320385000018418'//ОГРН[ОГРНИП] (320385000018418 - для ИП)
const SNILS = "55555555555"
const SNILS_FOR_IP = '945-688-152 69'
const SNILS_ARR = [
  '12345678901', //3.1. Все произвольный цифры (11 символов)
  '1234567890',  //3.2. произвольные цифры (10 символов)
  '00000000000', //3.3. Ввести все нули (11 символов).
  '*?:;№:"!%:?', //3.4. Специальные символы (*?:;№:"!%:?)
  'йцукенг шопа',//3.5. Произвольный текст (йцукенг шопа)
  '          ',  //3.6. Ввести пробелы
]


test("ИП Контроль при вводе значений СНИЛС (test 24)", async ({ page }) => {
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
  await expect(page.locator(Card.owner)).toContainText('Владелец ИДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ')
  await expect(page.locator(Card.BTN_SAVE)).toHaveAttribute('disabled', 'disabled')

  //----------------------------------------------------------------------------------------test3

  //3. В поле ОГРН ввести одно из значений: 320385000018418 / 304770000044610 / 318774600244590 / 316774600208322
  await page.locator(Card.owner).scrollIntoViewIfNeeded()
  await CASHE_Page.click(Card.owner)
  await page.locator("(//span[text()='СНИЛС']/following::input)[1]").scrollIntoViewIfNeeded()
  await page.waitForTimeout(1000)
  await page.fill("(//span[text()='СНИЛС']/following::input)[1]", SNILS_FOR_IP)
  //3. ИНН введен в поле, кнопка Сохранить стала доступна (подсвечена желтым).
  await expect(page.locator(Card.BTN_SAVE)).toHaveClass('el-button el-button--success el-button--small')

  //----------------------------------------------------------------------------------------test4
  //4. Нажать Сохранить.
  await CASHE_Page.click(Card.BTN_SAVE)
  //4. Внесенный ИНН успешно сохранен. О чем сигнализирует сообщение в правом верхнем углу: "Данные сохранили успешно".
  await expect(page.locator("//div[@class='el-notification right']")).toContainText('Данные сохранили успешно')

  //закрытие сессии
  await CASHE_Page.shutDown()
})

test("ИП Контроль при вводе значений СНИЛС (валидация) (test 24.1)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)

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
  await expect(page.locator(Card.owner)).toContainText('Владелец ИДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ')
  await expect(page.locator(Card.BTN_SAVE)).toHaveAttribute('disabled', 'disabled')

  //----------------------------------------------------------------------------------------test3
  //3. В поле СНИЛС ввести значения: 
  //3.1. Все произвольный цифры (11 символов). Сохранить.
  //3.2. произвольные цифры (10 символов). Сохранить.
  //3.3. Ввести все нули (11 символов). Сохранить.
  //3.4. Специальные символы (*?:;№:"!%:?). Сохранить.
  //3.5. Произвольный текст (йцукенг шопа). Сохранить.
  //3.6. Ввести пробелы. Сохранить.

  //3. СНИЛС введен в поле, кнопка Сохранить стала доступна для нажатия (подсвечена желтым).
  //*В пунктах (3.1., 3.2., 3.3.) - выводится сообщение под полем ввода об ошибке: "Значение поля введено неверно."
  //Выводится всплывающее сообщение: "Неверно заполненные поля!" (при нажатии Сохранить).
  //Внесенные изменения сохранены не были.
  //Режим редактирования активен.
  //*В пунктах (3.4., 3.5., 3.6.) - при попытке ввести предложенные значения, ничего не происходит, поле ввода остается пустым. Сообщений об ошибках нет.
  await page.locator(Card.owner).scrollIntoViewIfNeeded()
  await CASHE_Page.click(Card.owner)

  for (let i = 0; i < SNILS_ARR.length; i++) {
    if(i<3){
      await page.click("(//span[text()='СНИЛС']/following::input)[1]")
      await page.fill("(//span[text()='СНИЛС']/following::input)[1]", SNILS_ARR[i])
      await page.click("(//span[text()='ИНН выдан']/following::input)[1]")
      await page.waitForTimeout(1000)
      await expect(page.locator("//div[text()='Значение поля введено неверно.']")).toBeVisible()
      await CASHE_Page.click(Card.BTN_SAVE)
  
      await page.locator("//div[@class='el-notification right']").last().highlight()
      await expect(page.locator("//div[@class='el-notification right']").last()).toContainText("Неверно заполненные поля!")

      await page.click("(//span[text()='СНИЛС']/following::input)[1]")
      await page.fill("(//span[text()='СНИЛС']/following::input)[1]", '')

    }else{
      await page.click("(//span[text()='СНИЛС']/following::input)[1]")
      await page.fill("(//span[text()='СНИЛС']/following::input)[1]", SNILS_ARR[i])
      await page.click("(//span[text()='ИНН выдан']/following::input)[1]")
      await expect(page.locator("//div[text()='Значение поля введено неверно.']")).not.toBeVisible()
    }
  }

  await expect(page.locator(Card.BTN_SAVE)).toBeVisible()

  //закрытие сессии
  await CASHE_Page.shutDown()
})