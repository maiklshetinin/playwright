import { test, expect } from "@playwright/test";
import CASHE, { Card, MainPage } from "./CASHE";

const LOGIN = "SHETININM"
const PASSWORD = "Asdf123$"
const GRZ = 'Р332СТ71'
const INN = "7729754577"
const OGRN = "1137746980051"
const SNILS = "55555555555"

test("Изменение типа учетной записи с ФЛ / ИП на Юр. Лицо. (test 18)", async ({ page }) => {
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

  //3. Отредактировать данные, в блоке Владелец ФЛ / ИП. Следующие данные:
  //- ИНН (пример: 7729754577 - для ЮЛ 10 символов)
  //- ИНН выдан (любой текст)
  //- ОГРН (1137746980051 для ЮЛ)
  //-СНИЛС ()

  await page.fill("(//span[text()='ИНН']/following::input)[1]", INN)
  await page.fill("(//span[text()='ИНН выдан']/following::input)[1]", 'ВЫДАН')
  await page.fill("(//span[text()='ОГРН']/following::input)[1]", OGRN)
  await page.fill("(//span[text()='СНИЛС']/following::input)[1]", SNILS)

  //3. При редактировании соответствующих данных, под надписью «Владелец ФЛ / ИП» появится кнопка с надписью «Изменить владельца на юридическое лицо».
  //Кликнуть на свободном месте, под полем ИНН подсветится предупреждение: "Значение поля введено неверно." - это корректно, т.к. ИНН ЮЛ имеет 10 а не 12 символов.
  await CASHE_Page.click("//div[@class='h-full p-scrollbar']")
  await page.locator("//div[text()='Значение поля введено неверно.']").nth(0).highlight()
  await expect(page.locator("//div[text()='Значение поля введено неверно.']").nth(0)).toBeVisible()

  //----------------------------------------------------------------------------------------test4,5

  //4. Нажать кнопку «Изменить владельца на юридическое лицо».
  await CASHE_Page.click("(//button[contains(@class,'el-button btnChange')])[1]")

  //5. Во всплывающем окне нажать "Да". (актуально только при смене владельца на ЮЛ)
  await CASHE_Page.click("(//button[contains(@class,'el-button el-button--default')])[2]")
  //5. Появится предупреждение, что при смене типа владельца на ЮЛ будут очищены все поля блока Владелец и Адрес регистрации.
  await expect(page.locator("//p[text()='Изменение типа собственника очистит все ранее введенные значения. Удалить введенные значения?']")).toBeVisible()

  //4. Все данные ФЛ / ИП будут удалены, при этом появятся новые поля, необходимые для ЮЛ.
  await expect(page.locator("(//span[text()='ОКПО']/following::input)[1]")).toBeVisible()
  await expect(page.locator("(//span[text()='КПП']/following::input)[1]")).toBeVisible()
  await expect(page.locator("(//span[text()='ИНН']/following::input)[1]")).toHaveValue('')
  await expect(page.locator("(//span[text()='ОГРН']/following::input)[1]")).toHaveValue('')

  //----------------------------------------------------------------------------------------test6

  //6. Можно заполнить новые поля (или оставить их пустыми), нажать кнопку «Сохранить».
  await CASHE_Page.click(Card.BTN_SAVE)
  //6. Изменения были сохранены. Тип лица изменен на ЮЛ.
  await expect(page.locator("//h4[text()='Владелец ЮЛ']")).toBeVisible()


  await page.waitForTimeout(1000)

  //закрытие сессии
  await CASHE_Page.shutDown()
})

test("Изменение типа учетной записи с ЮЛ на ФЛ. (test 19)", async ({ page }) => {
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
  await expect(page.locator("(//span[text()='ИНН']/following::input)[1]")).toBeVisible()

  //----------------------------------------------------------------------------------------test3

  //3. Удалить следующие данные, в блоке Владелец ЮЛ:
  //- ИНН
  //- ОГРН
  //- ОКПО
  //- КПП

  await page.fill("(//span[text()='ИНН']/following::input)[1]", '')
  await page.fill("(//span[text()='ОГРН']/following::input)[1]", '')
  await page.fill("(//span[text()='ОКПО']/following::input)[1]", '')
  await page.fill("(//span[text()='КПП']/following::input)[1]", '')

  //3. При удалении соответствующих данных, под надписью «Владелец ЮЛ» появится кнопка с надписью «Изменить владельца на Физическое лицо».
  await expect(page.locator("//button[contains(@class,'el-button btnChange')]")).toContainText("Изменить владельца на физическое лицо")


  // //----------------------------------------------------------------------------------------test4,5

  //4. Нажать кнопку «Изменить владельца на юридическое лицо».
  await CASHE_Page.click("(//button[contains(@class,'el-button btnChange')])[1]")

  //5. Во всплывающем окне нажать "Да". (актуально только при смене владельца на ЮЛ)
  await CASHE_Page.click("(//button[contains(@class,'el-button el-button--default')])[2]")
  //5. Появится предупреждение, что при смене типа владельца на ЮЛ будут очищены все поля блока Владелец и Адрес регистрации.
  await expect(page.locator("//p[text()='Изменение типа собственника очистит все ранее введенные значения. Удалить введенные значения?']")).toBeVisible()

  //4. Все данные ФЛ / ИП будут удалены, при этом появятся новые поля, необходимые для ФЛ.
  await expect(page.locator("(//span[text()='ИНН']/following::input)[1]")).toBeVisible()
  await expect(page.locator("(//span[text()='ИНН выдан']/following::input)[1]")).toBeVisible()
  await expect(page.locator("(//span[text()='ОГРН']/following::input)[1]")).toBeVisible()

  // //----------------------------------------------------------------------------------------test6

  //6. Можно заполнить новые поля (или оставить их пустыми), нажать кнопку «Сохранить».
  await CASHE_Page.click(Card.BTN_SAVE)
  //6. Изменения были сохранены. Тип лица изменен на ФЛ.
  await expect(page.locator("//h4[text()='Владелец ФЛ']")).toBeVisible()

  //закрытие сессии
  await CASHE_Page.shutDown()
})

