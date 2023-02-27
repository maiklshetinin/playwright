import { test, expect } from "@playwright/test";
import CASHE, { Card, MainPage } from "./CASHE";

const LOGIN = "SHETININM"
const PASSWORD = "Asdf123$"
const GRZ = 'Н578УН750'
const INN = "772065003180"
const OGRN = "320385000018418"

test("Изменения типа учетной записи с ФЛ на ИП. (test 17.1)", async ({ page }) => {
  const CASHE_Page = new CASHE(page)
  await CASHE_Page.login(LOGIN, PASSWORD)

  //----------------------------------------------------------------------------------------test1

  //1. Найти ГРЗ указав его в строке поиска.
  await page.fill(MainPage.input_search, GRZ)
  await CASHE_Page.click(MainPage.BTN_SEARCH)
  await page.waitForLoadState("networkidle")
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
  await page.locator("(//span[text()='ИНН']/following::input)[1]").scrollIntoViewIfNeeded()
  await page.locator("(//span[text()='ИНН']/following::input)[1]").highlight()
  await expect(page.locator("(//span[text()='ИНН']/following::input)[1]")).toBeVisible()

  //----------------------------------------------------------------------------------------test3

  //3. Отредактировать данные, в пункте Владелец ФЛ. Следующие данные:
  //- ИНН (пример: 772065003180 - для ИП/ФЛ 12 символов)
  //- ИНН выдан (любой текст, цифра)
  //- ОГРН[ОГРНИП] (320385000018418 - для ИП)
  await page.fill("(//span[text()='ИНН']/following::input)[1]", INN)
  await page.fill("(//span[text()='ИНН выдан']/following::input)[1]", 'ВЫДАН')
  await page.fill("(//span[text()='ОГРН']/following::input)[1]", OGRN)
  //3. При редактировании соответствующих данных, под надписью «Владелец ФЛ» появится кнопка с надписью «Изменить владельца на индивидуального предпринимателя».
  await expect(page.locator("(//button[contains(@class,'el-button btnChange')])[2]")).toBeVisible()

  //----------------------------------------------------------------------------------------test4

  //4. Нажать кнопку «Изменить владельца на индивидуального предпринимателя».
  await CASHE_Page.click("(//button[contains(@class,'el-button btnChange')])[2]")
  //4. Все данные ФЛ будут сохранены, при этом появятся новые поля, необходимые для ИП.
  // await expect(page.locator("(//span[text()='ИНН']/following::input)[1]")).toHaveText(INN)
  // await expect(page.locator("(//span[text()='ИНН выдан']/following::input)[1]")).toHaveText('ВЫДАН')
  // await expect(page.locator("(//span[text()='ОГРН']/following::input)[1]")).toHaveText(OGRN)

  await expect(page.locator("//span[text()='Код органа регистрации']")).toBeVisible()
  await expect(page.locator("(//span[text()='Наименование органа регистрации']/following::input)[1]")).toBeVisible()
  await expect(page.locator("//span[text()='Регистрация с']")).toBeVisible()
  await expect(page.locator("//span[text()='По']")).toBeVisible()
  //----------------------------------------------------------------------------------------test5

  //5. Можно заполнить новые поля (или оставить их пустыми), нажать кнопку «Сохранить».
  await page.locator(Card.BTN_SAVE).scrollIntoViewIfNeeded()
  await page.locator(Card.BTN_SAVE).highlight()
  // // await CASHE_Page.click(Card.BTN_SAVE)
  // //5. Изменения были сохранены. Тип лица изменен на ИП.
  await expect(page.locator("(//div[@role='button']//h4)[2]")).toHaveText('Владелец ИДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ')
  await page.waitForTimeout(2000)

  //закрытие сессии
  await CASHE_Page.shutDown()
})

test("Изменения типа учетной записи с ФЛ на ИП. (test 17.2)", async ({ page }) => {
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
  await page.locator("(//span[text()='ИНН']/following::input)[1]").scrollIntoViewIfNeeded()
  await page.locator("(//span[text()='ИНН']/following::input)[1]").highlight()
  await expect(page.locator("(//span[text()='ИНН']/following::input)[1]")).toBeVisible()

  //----------------------------------------------------------------------------------------test3

  //3. Отредактировать данные, в пункте Владелец ФЛ. Следующие данные:
  //- ИНН (произвольное значение)
  //- ИНН выдан (любой текст, цифра)
  //- ОГРН[ОГРНИП] (произвольное значение)
  await page.fill("(//span[text()='ИНН']/following::input)[1]", "1")
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