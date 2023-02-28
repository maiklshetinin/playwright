import { test, expect } from "@playwright/test";
import OIB, { InputLocators, UserCard } from "./OIB";

const login = "SHETININM"
const password = "Asdf123$"

test("Просмотр логов (test 18)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 1080,
  });
  const OIB_Page = new OIB(page)
  await OIB_Page.login(login, password)

  //1. Открыть карточку пользователя. Перейти на вкладку «Лог».
  await OIB_Page.getUserCard(login)
  await OIB_Page.click(UserCard.BTN_LOG)

  //1. Откроется вклада с Логами карточки пользователя.
  expect(page.locator("(//span[text()='Журнал подключений'])[2]")).toBeVisible()

  //2. Открыть одну из записей Лога.
  //По умолчанию будут отображаться значения вкладки «Лог», есть так же вкладка «Все поля».
  await page.locator("(//div[@class='el-collapse'])[2]").getByRole("tab").nth(0).click()
  expect(page.locator("(//span[text()='Лог'])[1]")).toBeVisible()
  expect(page.locator("(//span[text()='Все поля'])[1]")).toBeVisible()

  //2. Запись открывается в виде выпадающего списка.
  //Отображаются только те значения, которые были скорректированы, со следующими полями:
  //- Поле
  expect(page.locator("(//div[text()='Поле'])[1]")).toBeVisible()
  //- Новое значение
  expect(page.locator("(//div[text()='Новое значение'])[1]")).toBeVisible()
  //- Старое значение.
  expect(page.locator("(//div[text()='Старое значение'])[1]")).toBeVisible()

  //3. Перейти на вкладку «Все поля».
  await OIB_Page.click("(//span[text()='Все поля'])[1]")

  //3. Отображаются все поля, редактируемого окна, значения, которые были обновлены, выделяются серым фоном.
  //TODO:уточнить вопрос выше


  //4. В строке формирования выборки логов, выбрать доступные параметры, по которым были внесены изменения(например: ФИО, ID АРМа др.).
  await OIB_Page.click(InputLocators.LOG_options)
  await page.locator("(//div[@x-placement='bottom-start']//div)[1]").getByText("ID").nth(0).click()

  // await page.waitForTimeout(3000)
  await page.waitForLoadState('networkidle')


  //4. Отображаются значения, согласно выбранного параметра фильтрации.
  expect(page.locator("(//span[@class='block log-new'])[1]")).toContainText(/[0-9]/)

  //5. Выбрать отображение всех записей журнала логирования, и в строке поиск ввести значение, например: дата лога, время лога, ФИО того, кто вносил изменения, название изменяемых поawa
  await page.fill(InputLocators.LOG_search, "17.01.2023")
  await page.click(InputLocators.LOG_search)

  // await page.waitForTimeout(3000)
  await page.waitForLoadState('networkidle')

  //5. Будут отображаться все возможные совпадения.
  //TODO:поиск не работает
  expect(page.locator("(//span[@class='log-date'])[1]")).toContainText("17.01.2023")

  //.6. Нажать «Журнал подключений». Общий «Журнал подключений» рассмотрен в пункте 9.
  await OIB_Page.click(UserCard.BTN_LOG_CONNECTION_LOG)

  //6. Откроется журнал запросов, только для данного пользователя, где можно сделать выборку по различному периоду(За час, Сегодня, За сутки, За неделю, За месяц, За год, Все)
  //и выгрузить эти данные в доступные форматы (csv, xlsx, pdf).
  expect(page.locator("(//div[@class='fc_table_results']//div)[1]")).toContainText("SHETININM")

  for (const button of await page.locator("div.el-radio-group.flex-child").getByRole("radio").all())
    expect(button).toBeVisible()


  //закрытие сессии
  await OIB_Page.shutDown()
})