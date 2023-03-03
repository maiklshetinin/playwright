import { test, expect } from "@playwright/test";
import CASHE, { Card, MainPage } from "./CASHE";

const LOGIN = "SHETININM"
const PASSWORD = "Asdf123$"
const GRZ = 'Н578УН750'
const INN = "7729754577"
const INN_FOR_IP = '772065003180'//ИНН (пример: 772065003180 - для ИП/ФЛ 12 символов)
const OGRN = "1137746980051"
const OGRN_FOR_IP = '320385000018418'//ОГРН[ОГРНИП] (320385000018418 - для ИП)
const SNILS = "55555555555"


test("Изменения типа учетной записи с ФЛ на ИП. (test 17.1)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)
 
  //----------------------------------------------------------------------------------------test1

  //1. Найти ГРЗ указав его в строке поиска.
  await page.fill(MainPage.input_search, GRZ)
  await CASHE_Page.click(MainPage.BTN_SEARCH)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1000)
  //1. Требуемый ГРЗ был найден.
  await expect(page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0)).toContainText(GRZ)

  //----------------------------------------------------------------------------------------test2

  //2. Перейти в карточку редактирования данных, по найденному ГРЗ.
  await page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0).click()
  await page.waitForTimeout(1000)
  await page.waitForLoadState("networkidle")

  await CASHE_Page.click(Card.BTN_EDIT)
  //2. Появится возможность редактирования данных, выбранного ГРЗ.
  await page.locator(Card.owner).scrollIntoViewIfNeeded()
  await CASHE_Page.click(Card.owner)
  await expect(page.locator("(//span[text()='ИНН']/following::input)[1]")).toBeVisible()

  //----------------------------------------------------------------------------------------test3
  //в выпадающем списке выбрать тип ИП и нажать кнопку сохранить
  await page.click(Card.owner_type)
  await page.getByRole('listitem').getByText("Индивидуальный предпрениматель").highlight()
  await page.getByRole('listitem').getByText("Индивидуальный предпрениматель").click()

  await expect(page.locator("//span[text()='Код органа регистрации']")).toBeVisible()
  await expect(page.locator("(//span[text()='Наименование органа регистрации']/following::input)[1]")).toBeVisible()
  await expect(page.locator("//span[text()='Регистрация с']")).toBeVisible()
  await expect(page.locator("//span[text()='По']")).toBeVisible()
  //----------------------------------------------------------------------------------------test4

  //5. Можно заполнить новые поля (или оставить их пустыми), нажать кнопку «Сохранить».
  await page.locator(Card.BTN_SAVE).scrollIntoViewIfNeeded()
  await page.locator(Card.BTN_SAVE).highlight()
  await CASHE_Page.click(Card.BTN_SAVE)
  // //5. Изменения были сохранены. Тип лица изменен на ИП.
  await expect(page.locator("(//div[@role='button']//h4)[2]")).toHaveText('Владелец ИДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ')

  //закрытие сессии
  await CASHE_Page.shutDown()
})

test("Изменения типа учетной записи с ФЛ на ИП(проверка валидации). (test 17.2)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)

  //----------------------------------------------------------------------------------------test1

  //1. Найти ГРЗ указав его в строке поиска.
  await page.fill(MainPage.input_search, GRZ)
  await CASHE_Page.click(MainPage.BTN_SEARCH)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1000)

  //1. Требуемый ГРЗ был найден.
  await expect(page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0)).toContainText(GRZ)

  //----------------------------------------------------------------------------------------test2

  //2. Перейти в карточку редактирования данных, по найденному ГРЗ.
  await page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0).click()
  await page.waitForTimeout(1000)
  await page.waitForLoadState("networkidle")


  await CASHE_Page.click(Card.BTN_EDIT)
  //2. Появится возможность редактирования данных, выбранного ГРЗ.
  await page.locator(Card.owner).scrollIntoViewIfNeeded()
  await CASHE_Page.click(Card.owner)
  await page.locator(Card.owner).scrollIntoViewIfNeeded()
  await expect(page.locator("(//span[text()='ИНН']/following::input)[1]")).toBeVisible()

  //----------------------------------------------------------------------------------------test3

  //3. Отредактировать данные, в пункте Владелец ФЛ. Следующие данные:
  //- ИНН (произвольное значение)
  //- ИНН выдан (любой текст, цифра)
  //- ОГРН[ОГРНИП] (произвольное значение)
  await page.fill("(//span[text()='ИНН']/following::input)[1]", "1")
  await page.click("(//span[text()='ИНН выдан']/following::input)[1]")
  await page.fill("(//span[text()='ИНН выдан']/following::input)[1]", "1")
  await page.fill("(//span[text()='ОГРН']/following::input)[1]", "1")

  //3. При редактировании соответствующих данных, и попыткой ввода произвольных данных, под полями ИНН будет выведено сообщение об ошибке "Значение поля введено неверно",
  // т.к. корректность значения ИНН вычисляется по определенному алгоритму.
  await page.locator("//div[text()='Значение поля введено неверно.']").highlight()
  await expect(page.locator("//div[text()='Значение поля введено неверно.']")).toBeVisible()

  //----------------------------------------------------------------------------------------test4

  //4. Нажать кнопку "Сохранить".
  await CASHE_Page.click(Card.BTN_SAVE)
  //4. Ничего не произойдет, сообщение под полем ИНН не пропадет, т.к. не была исправлена ошибка. Будет показано сообщение: "Неверно заполнены значения".
  //Внесенные изменения не сохранены.
  await page.locator("//div[@class='el-notification right']").highlight()
  await expect(page.locator("//div[@class='el-notification right']")).toContainText('Неверно заполненные поля!')

  await page.waitForTimeout(1000)

  //закрытие сессии
  await CASHE_Page.shutDown()
})

test("Изменения типа учетной записи с ИП на ФЛ. (test 17.3)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)

  //----------------------------------------------------------------------------------------test1

  //1. Найти ГРЗ указав его в строке поиска.
  await page.fill(MainPage.input_search, GRZ)
  await CASHE_Page.click(MainPage.BTN_SEARCH)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(1000)
  //1. Требуемый ГРЗ был найден.
  await expect(page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0)).toContainText(GRZ)

  //----------------------------------------------------------------------------------------test2

  //2. Перейти в карточку редактирования данных, по найденному ГРЗ.
  await page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0).click()
  await page.waitForTimeout(1000)
  await page.waitForLoadState("networkidle")

  await CASHE_Page.click(Card.BTN_EDIT)
  //2. Появится возможность редактирования данных, выбранного ГРЗ.
  await page.locator(Card.owner).scrollIntoViewIfNeeded()
  await CASHE_Page.click(Card.owner)
  await expect(page.locator("(//span[text()='ИНН']/following::input)[1]")).toBeVisible()

  //----------------------------------------------------------------------------------------test3
  
  //в выпадающем списке выбрать тип ИП и нажать кнопку сохранить
  await page.click(Card.owner_type)
  await page.getByRole('listitem').getByText("Физическое лицо").highlight()
  await page.getByRole('listitem').getByText("Физическое лицо").click()

  await expect(page.locator("//span[text()='Код органа регистрации']")).not.toBeVisible()
  await expect(page.locator("(//span[text()='Наименование органа регистрации']/following::input)[1]")).not.toBeVisible()
  await expect(page.locator("//span[text()='Регистрация с']")).not.toBeVisible()
  await expect(page.locator("//span[text()='По']")).not.toBeVisible()
  //----------------------------------------------------------------------------------------test4

  //5. Можно заполнить новые поля (или оставить их пустыми), нажать кнопку «Сохранить».
  await page.locator(Card.BTN_SAVE).scrollIntoViewIfNeeded()
  await page.locator(Card.BTN_SAVE).highlight()
  await CASHE_Page.click(Card.BTN_SAVE)
  // //5. Изменения были сохранены. Тип лица изменен на ИП.
  await expect(page.locator("(//div[@role='button']//h4)[2]")).toHaveText('Владелец ФЛ')

  //закрытие сессии
  await CASHE_Page.shutDown()
})