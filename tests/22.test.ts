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
const INN_ARR = [
  '000000000000',    //3.1. Все нули (12 символов)
  '000000000000000', //3.2. Все нули (15 символов)
  '0000000000',    //3.3. Все нули (10 символов)
  '1234567890',      //3.4. произвольные цифры (10 символов)
  '123456789012',    //3.5. Произвольные цифры (12 символов)
  '123456789012345', //3.6. Произвольные цифры (15 символов)
  '*?:;№:"!%:???:?', //3.7. Специальные символы (*?:;№:"!%:???:?)
  'йцукенгшрпамыпа', //3.8. Произвольный текст (йцукенгшрпамыпа)
]

//при условии если пользователь не ИП расскоментировать Изменение типа учетной записи

// test("Изменение типа учетной записи с ФЛ / ИП на Юр. Лицо. (test 18)", async ({ page }) => {
//   const CASHE_Page = new CASHE(page)
//   await CASHE_Page.login(LOGIN, PASSWORD)

//   //----------------------------------------------------------------------------------------test1

//   //1. Найти ГРЗ указав его в строке поиска.
//   await page.fill(MainPage.input_search, GRZ)
//   await CASHE_Page.click(MainPage.BTN_SEARCH)
//   await page.waitForLoadState("networkidle")
//   //1. Требуемый ГРЗ был найден.
//   await expect(page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0)).toContainText(GRZ)

//   //----------------------------------------------------------------------------------------test2

//   //2. Перейти в карточку редактирования данных, по найденному ГРЗ.
//   await page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0).click()
//   await page.waitForTimeout(1000)
//   await page.waitForLoadState("networkidle")


//   await CASHE_Page.click(Card.BTN_EDIT)
//   //2. Появится возможность редактирования данных, выбранного ГРЗ.
//   await page.locator(Card.owner).scrollIntoViewIfNeeded()
//   await CASHE_Page.click(Card.owner)
//   await page.locator("(//span[text()='ИНН']/following::input)[1]").scrollIntoViewIfNeeded()
//   await page.locator("(//span[text()='ИНН']/following::input)[1]").highlight()
//   await expect(page.locator("(//span[text()='ИНН']/following::input)[1]")).toBeVisible()

//   //----------------------------------------------------------------------------------------test3

//   //3. Отредактировать данные, в блоке Владелец ФЛ / ИП. Следующие данные:
//   //- ИНН (пример: 7729754577 - для ЮЛ 10 символов)
//   //- ИНН выдан (любой текст)
//   //- ОГРН (1137746980051 для ЮЛ)
//   //-СНИЛС ()

//   await page.fill("(//span[text()='ИНН']/following::input)[1]", INN)
//   await page.fill("(//span[text()='ИНН выдан']/following::input)[1]", 'ВЫДАН')
//   await page.fill("(//span[text()='ОГРН']/following::input)[1]", OGRN)
//   await page.fill("(//span[text()='СНИЛС']/following::input)[1]", SNILS)

//   //3. При редактировании соответствующих данных, под надписью «Владелец ФЛ / ИП» появится кнопка с надписью «Изменить владельца на юридическое лицо».
//   //Кликнуть на свободном месте, под полем ИНН подсветится предупреждение: "Значение поля введено неверно." - это корректно, т.к. ИНН ЮЛ имеет 10 а не 12 символов.
//   await CASHE_Page.click("//div[@class='h-full p-scrollbar']")
//   await page.locator("//div[text()='Значение поля введено неверно.']").nth(0).highlight()
//   await expect(page.locator("//div[text()='Значение поля введено неверно.']").nth(0)).toBeVisible()

//   //----------------------------------------------------------------------------------------test4,5

//   //4. Нажать кнопку «Изменить владельца на юридическое лицо».
//   await CASHE_Page.click("(//button[contains(@class,'el-button btnChange')])[1]")

//   //5. Во всплывающем окне нажать "Да". (актуально только при смене владельца на ЮЛ)
//   await CASHE_Page.click("(//button[contains(@class,'el-button el-button--default')])[2]")
//   //5. Появится предупреждение, что при смене типа владельца на ЮЛ будут очищены все поля блока Владелец и Адрес регистрации.
//   await expect(page.locator("//p[text()='Изменение типа собственника очистит все ранее введенные значения. Удалить введенные значения?']")).toBeVisible()

//   //4. Все данные ФЛ / ИП будут удалены, при этом появятся новые поля, необходимые для ЮЛ.
//   await expect(page.locator("(//span[text()='ОКПО']/following::input)[1]")).toBeVisible()
//   await expect(page.locator("(//span[text()='КПП']/following::input)[1]")).toBeVisible()
//   await expect(page.locator("(//span[text()='ИНН']/following::input)[1]")).toHaveValue('')
//   await expect(page.locator("(//span[text()='ОГРН']/following::input)[1]")).toHaveValue('')

//   //----------------------------------------------------------------------------------------test6

//   //6. Можно заполнить новые поля (или оставить их пустыми), нажать кнопку «Сохранить».
//   await CASHE_Page.click(Card.BTN_SAVE)
//   //6. Изменения были сохранены. Тип лица изменен на ЮЛ.
//   await expect(page.locator("//h4[text()='Владелец ЮЛ']")).toBeVisible()

//   //закрытие сессии
//   await CASHE_Page.shutDown()
// })

// test("Изменение типа учетной записи с ЮЛ на ФЛ. (test 19)", async ({ page }) => {
//   const CASHE_Page = new CASHE(page)
//   await CASHE_Page.login(LOGIN, PASSWORD)

//   //----------------------------------------------------------------------------------------test1

//   //1. Найти ГРЗ указав его в строке поиска.
//   await page.fill(MainPage.input_search, GRZ)
//   await CASHE_Page.click(MainPage.BTN_SEARCH)
//   await page.waitForLoadState("networkidle")
//   //1. Требуемый ГРЗ был найден.
//   await expect(page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0)).toContainText(GRZ)

//   //----------------------------------------------------------------------------------------test2

//   //2. Перейти в карточку редактирования данных, по найденному ГРЗ.
//   await page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0).click()
//   await page.waitForTimeout(1000)
//   await page.waitForLoadState("networkidle")


//   await CASHE_Page.click(Card.BTN_EDIT)
//   //2. Появится возможность редактирования данных, выбранного ГРЗ.
//   await page.locator(Card.owner).scrollIntoViewIfNeeded()
//   await CASHE_Page.click(Card.owner)
//   await page.locator("(//span[text()='ИНН']/following::input)[1]").scrollIntoViewIfNeeded()
//   await expect(page.locator("(//span[text()='ИНН']/following::input)[1]")).toBeVisible()

//   //----------------------------------------------------------------------------------------test3

//   //3. Удалить следующие данные, в блоке Владелец ЮЛ:
//   //- ИНН
//   //- ОГРН
//   //- ОКПО
//   //- КПП

//   await page.fill("(//span[text()='ИНН']/following::input)[1]", '')
//   await page.fill("(//span[text()='ОГРН']/following::input)[1]", '')
//   await page.fill("(//span[text()='ОКПО']/following::input)[1]", '')
//   await page.fill("(//span[text()='КПП']/following::input)[1]", '')

//   //3. При удалении соответствующих данных, под надписью «Владелец ЮЛ» появится кнопка с надписью «Изменить владельца на Физическое лицо».
//   await expect(page.locator("//button[contains(@class,'el-button btnChange')]")).toContainText("Изменить владельца на физическое лицо")


//   // //----------------------------------------------------------------------------------------test4,5

//   //4. Нажать кнопку «Изменить владельца на юридическое лицо».
//   await CASHE_Page.click("(//button[contains(@class,'el-button btnChange')])[1]")

//   //5. Во всплывающем окне нажать "Да". (актуально только при смене владельца на ЮЛ)
//   await CASHE_Page.click("(//button[contains(@class,'el-button el-button--default')])[2]")
//   //5. Появится предупреждение, что при смене типа владельца на ЮЛ будут очищены все поля блока Владелец и Адрес регистрации.
//   await expect(page.locator("//p[text()='Изменение типа собственника очистит все ранее введенные значения. Удалить введенные значения?']")).toBeVisible()

//   //4. Все данные ФЛ / ИП будут удалены, при этом появятся новые поля, необходимые для ФЛ.
//   await expect(page.locator("(//span[text()='ИНН']/following::input)[1]")).toBeVisible()
//   await expect(page.locator("(//span[text()='ИНН выдан']/following::input)[1]")).toBeVisible()
//   await expect(page.locator("(//span[text()='ОГРН']/following::input)[1]")).toBeVisible()

//   // //----------------------------------------------------------------------------------------test6

//   //6. Можно заполнить новые поля (или оставить их пустыми), нажать кнопку «Сохранить».
//   await CASHE_Page.click(Card.BTN_SAVE)
//   //6. Изменения были сохранены. Тип лица изменен на ФЛ.
//   await expect(page.locator("//h4[text()='Владелец ФЛ']")).toBeVisible()

//   //закрытие сессии
//   await CASHE_Page.shutDown()
// })

// test("Изменения типа учетной записи с ФЛ на ИП. (test 17.1)", async ({ page }) => {
//   const CASHE_Page = new CASHE(page)
//   await CASHE_Page.login(LOGIN, PASSWORD)

//   //----------------------------------------------------------------------------------------test1

//   //1. Найти ГРЗ указав его в строке поиска.
//   await page.fill(MainPage.input_search, GRZ)
//   await CASHE_Page.click(MainPage.BTN_SEARCH)
//   await page.waitForLoadState("networkidle")
//   //1. Требуемый ГРЗ был найден.
//   await expect(page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0)).toContainText(GRZ)

//   //----------------------------------------------------------------------------------------test2

//   //2. Перейти в карточку редактирования данных, по найденному ГРЗ.
//   await page.locator(MainPage.table).getByText(CASHE_Page.getRegExp(GRZ)).nth(0).click()
//   await page.waitForTimeout(1000)
//   await page.waitForLoadState("networkidle")


//   await CASHE_Page.click(Card.BTN_EDIT)
//   //2. Появится возможность редактирования данных, выбранного ГРЗ.
//   await page.locator(Card.owner).scrollIntoViewIfNeeded()
//   await CASHE_Page.click(Card.owner)
//   await page.locator("(//span[text()='ИНН']/following::input)[1]").scrollIntoViewIfNeeded()
//   await page.locator("(//span[text()='ИНН']/following::input)[1]").highlight()
//   await expect(page.locator("(//span[text()='ИНН']/following::input)[1]")).toBeVisible()

//   //----------------------------------------------------------------------------------------test3

//   //3. Отредактировать данные, в пункте Владелец ФЛ. Следующие данные:
//   //- ИНН (пример: 772065003180 - для ИП/ФЛ 12 символов)
//   //- ИНН выдан (любой текст, цифра)
//   //- ОГРН[ОГРНИП] (320385000018418 - для ИП)
//   await page.fill("(//span[text()='ИНН']/following::input)[1]", INN_FOR_IP)
//   await page.fill("(//span[text()='ИНН выдан']/following::input)[1]", 'ВЫДАН')
//   await page.fill("(//span[text()='ОГРН']/following::input)[1]", OGRN_FOR_IP)
//   //3. При редактировании соответствующих данных, под надписью «Владелец ФЛ» появится кнопка с надписью «Изменить владельца на индивидуального предпринимателя».
//   await expect(page.locator("(//button[contains(@class,'el-button btnChange')])[2]")).toBeVisible()

//   //----------------------------------------------------------------------------------------test4

//   //4. Нажать кнопку «Изменить владельца на индивидуального предпринимателя».
//   await CASHE_Page.click("(//button[contains(@class,'el-button btnChange')])[2]")
//   //4. Все данные ФЛ будут сохранены, при этом появятся новые поля, необходимые для ИП.
//   // await expect(page.locator("(//span[text()='ИНН']/following::input)[1]")).toHaveText(INN)
//   // await expect(page.locator("(//span[text()='ИНН выдан']/following::input)[1]")).toHaveText('ВЫДАН')
//   // await expect(page.locator("(//span[text()='ОГРН']/following::input)[1]")).toHaveText(OGRN)

//   await expect(page.locator("//span[text()='Код органа регистрации']")).toBeVisible()
//   await expect(page.locator("(//span[text()='Наименование органа регистрации']/following::input)[1]")).toBeVisible()
//   await expect(page.locator("//span[text()='Регистрация с']")).toBeVisible()
//   await expect(page.locator("//span[text()='По']")).toBeVisible()
//   //----------------------------------------------------------------------------------------test5

//   //5. Можно заполнить новые поля (или оставить их пустыми), нажать кнопку «Сохранить».
//   await page.locator(Card.BTN_SAVE).scrollIntoViewIfNeeded()
//   await page.locator(Card.BTN_SAVE).highlight()
//   await CASHE_Page.click(Card.BTN_SAVE)
//   // //5. Изменения были сохранены. Тип лица изменен на ИП.
//   await expect(page.locator("(//div[@role='button']//h4)[2]")).toHaveText('Владелец ИДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ')

//   //закрытие сессии
//   await CASHE_Page.shutDown()
// })


test("ИП Контроль при вводе значений ИНН (test 22)", async ({ page }) => {
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

  //3. В поле ИНН ввести одно из значений: 772065003180 / 771200031450 / 772444800775 / 502906602876
  await page.locator(Card.owner).scrollIntoViewIfNeeded()
  await CASHE_Page.click(Card.owner)
  await page.fill("(//span[text()='ИНН']/following::input)[1]", INN_FOR_IP)
  //3. ИНН введен в поле, кнопка Сохранить стала доступна (подсвечена желтым).
  await expect(page.locator(Card.BTN_SAVE)).toHaveClass('el-button el-button--success el-button--small')

  //----------------------------------------------------------------------------------------test4
  //4. Нажать Сохранить.
  await CASHE_Page.click(Card.BTN_SAVE)
  //4. Внесенный ИНН успешно сохранен. О чем сигнализирует сообщение в правом верхнем углу: "Данные сохранили успешно".
  await expect(page.locator("//div[@class='el-notification right']")).toContainText('Данные сохранили успешно')

  //очистка ИНН
  await CASHE_Page.click(Card.BTN_EDIT)
  await page.locator(Card.owner).scrollIntoViewIfNeeded()
  // await CASHE_Page.click(Card.owner)
  await page.fill("(//span[text()='ИНН']/following::input)[1]", '')
  await CASHE_Page.click(Card.BTN_SAVE)
  //проверка очистки
  await expect(page.locator("//div[@class='el-notification right']")).toContainText('Данные сохранили успешно')

  //закрытие сессии
  await CASHE_Page.shutDown()
})

test("ИП Контроль при вводе значений ИНН (валидация) (test 22.1)", async ({ page }) => {
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
  //3. В поле ИНН ввести значения: 
  //3.1. Все нули (12 символов). Сохранить.
  //3.2. Все нули (15 символов). Сохранить.
  //3.3. Все нули (10 символов). Сохранить.
  //3.4. произвольные цифры (10 символов). Сохранить.
  //3.5. Произвольные цифры (12 символов). Сохранить.
  //3.6. Произвольные цифры (15 символов). Сохранить.
  //3.7. Специальные символы (*?:;№:"!%:???:?). Сохранить.
  //3.8. Произвольный текст (йцукенгшрпамыпа). Сохранить.

  //Во всех пунктах (3.1., 3.2., 3.3., 3.4., 3.5., 3.6., 3.7., 3.8.) - выводится сообщение под полем ввода об ошибке: "Значение поля введено неверно."
  //Выводится всплывающее сообщение: "Неверно заполненные поля!" (при нажатии Сохранить).
  //Внесенные изменения сохранены не были.
  //Режим редактирования активен.
  await page.locator(Card.owner).scrollIntoViewIfNeeded()
  await CASHE_Page.click(Card.owner)

  for (const inn of INN_ARR) {
    await page.click("(//span[text()='ИНН']/following::input)[1]")
    await page.fill("(//span[text()='ИНН']/following::input)[1]", inn)
    await page.click("(//span[text()='ИНН выдан']/following::input)[1]")
    await page.waitForTimeout(1000)
    await expect(page.locator("//div[text()='Значение поля введено неверно.']")).toBeVisible()
    await CASHE_Page.click(Card.BTN_SAVE)

    await page.locator("//div[@class='el-notification right']").last().highlight()

    await expect(page.locator("//div[@class='el-notification right']").last()).toContainText("Неверно заполненные поля!")

    await page.fill("(//span[text()='ИНН']/following::input)[1]", '')
  }

  await expect(page.locator(Card.BTN_SAVE)).toBeVisible()

  //закрытие сессии
  await CASHE_Page.shutDown()
})