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

  //в выпадающем списке выбрать тип ЮЛ и нажать кнопку сохранить
  await page.click(Card.owner_type)
  await page.getByRole('listitem').getByText("Юридическое лицо").highlight()
  await page.getByRole('listitem').getByText("Юридическое лицо").click()



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
  await page.locator("(//span[text()='КПП']/following::input)[1]").scrollIntoViewIfNeeded()
  await expect(page.locator("(//span[text()='ИНН']/following::input)[1]")).toBeVisible()

  //----------------------------------------------------------------------------------------test3

  //в выпадающем списке выбрать тип ИП и нажать кнопку сохранить
  await page.click(Card.owner_type)
  await page.getByRole('listitem').getByText("Физическое лицо").highlight()
  await page.getByRole('listitem').getByText("Физическое лицо").click()


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

