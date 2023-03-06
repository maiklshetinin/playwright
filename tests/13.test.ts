import { test, expect, chromium } from "@playwright/test";
import OIB, { InputLocators, SpanLocators, UserCard } from "./OIB";

const login1 = "SHETININM"
const password = "Asdf123$"
const userLogin = "IVANOVAO"
const userLastName = "Иванова"


test("Удаление роли если она есть (test 13)", async ({ page }) => {
  const OIB_Page = new OIB(page)
  await OIB_Page.login(login1, password)

  //----------------------------------------------------------------------------------------test1

  // 1. Выделить нужную учетную запись.
  await OIB_Page.getUserCard(userLogin)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(2000)
  //----------------------------------------------------------------------------------------test2

  //2. В появившемся справа окне, нажать на изображение карандаша.
  await OIB_Page.click(UserCard.BTN_EDIT)
  //2. Появится возможность внесения данных в запись.
  await expect(page.locator("(//span[text()='Фамилия']/following::input)[1]")).toBeVisible()

  //удаляем роль если она есть
  if (await page.locator(InputLocators.role).inputValue() !== '') {
    await page.locator("(//div[@class='el-select el-select--mini']//div)[1]").hover();
    await page.locator("(//div[@class='el-select el-select--mini']//div)[1]").locator('i').nth(1).highlight();
    await page.waitForTimeout(1000)
    await page.locator("(//div[@class='el-select el-select--mini']//div)[1]").locator('i').nth(1).click();
    await OIB_Page.click(UserCard.BTN_SAVE)
    await OIB_Page.click(UserCard.BTN_EDIT)
  }

  //закрытие сессии
  await OIB_Page.shutDown()
})


test("Назначение прав доступа учетной записи. (test 13.1)", async ({ page }) => {
  const OIB_Page = new OIB(page)
  await OIB_Page.login(login1, password)

  //----------------------------------------------------------------------------------------test1

  // 1. Выделить нужную учетную запись.
  await OIB_Page.getUserCard(userLogin)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(2000)
  //1. Справа появится карточка выделенного пользователя.
  await expect(page.locator(UserCard.userCard)).toBeVisible()
  await expect(page.locator(SpanLocators.lastName)).toHaveText(userLastName)
  await expect(page.locator(SpanLocators.login)).toHaveText(userLogin)

  //----------------------------------------------------------------------------------------test2

  //2. В появившемся справа окне, нажать на изображение карандаша.
  await OIB_Page.click(UserCard.BTN_EDIT)
  // await page.waitForTimeout(1000)
  //2. Появится возможность внесения данных в запись.
  await expect(page.locator("(//span[text()='Фамилия']/following::input)[1]")).toBeVisible()

  //----------------------------------------------------------------------------------------test3

  // 3. В меню Список прав: ЦБД (для работы с клиентом ЦБД) проставить чекбокс у необходимого значения (например: БД Маршрут).
  await OIB_Page.click(UserCard.BTN_CBD)
  // await page.waitForTimeout(1000)
  await page.locator("label[title='БД Маршрут']").click()
  // 3. Выбранное значение подсветится синим цветом и активным чекбоксом. Найти его можно будет в Клиенте ЕБД → пункт слева Маршрут.
  await expect(page.locator("input[value='RIGHT_PTRL']")).toBeChecked()

  //----------------------------------------------------------------------------------------test4

  // 4. В меню Список прав: АРМ, выбрать необходимую систему (например: НСИ)
  await OIB_Page.click(UserCard.BTN_ARM)
  // await page.waitForTimeout(1000)
  await page.locator("//div[text()='НСИ']").click()
  // 4. Появится наименование прав для выбранного раздела, в котором два столбца для выставления чекбокса.
  // Левые — для активация права, непосредственно в самом АРМе.
  // Правые — для активации права, для возможности делегировать доступные права другим пользователям. 
  // Можно не самому не иметь прав в этом АРМе, но иметь возможность давать эти права другим пользователям.
  await expect(page.locator("(//div[@aria-label='checkbox-group'])[1]")).toBeVisible()
  await expect(page.locator("(//div[@aria-label='checkbox-group'])[2]")).toBeVisible()

  //----------------------------------------------------------------------------------------test5

  // 5. Либо проставить отдельно, определенные права, поставив нужный чекбокс, либо разом выдать все доступные права, нажатием «+».
  await page.locator("label[title='АРМ Контроль КВФ - Причины неработоспособности камер']").click()
  // 5. Выданные разрешения будут подсвечены синим и активным чекбоксом.
  await expect(page.locator("(//input[@value='352'])[1]")).toBeChecked()
  await expect(page.locator("label[title='АРМ Контроль КВФ - Причины неработоспособности камер']")).toHaveClass("el-checkbox is-checked")

  //----------------------------------------------------------------------------------------test6

  // 6. Нажать Отмена.
  await OIB_Page.click(UserCard.BTN_CANCEL)
  // 6. Изменения не будут Сохранены
  await OIB_Page.click(UserCard.BTN_EDIT)
  await OIB_Page.click(UserCard.BTN_ARM)
  await page.waitForTimeout(1000)
  await page.locator("//div[text()='НСИ']").click()
  await expect(page.locator("(//input[@value='352'])[1]")).not.toBeChecked()
  await expect(page.locator("label[title='АРМ Контроль КВФ - Причины неработоспособности камер']")).not.toHaveClass("el-checkbox is-checked")

  //----------------------------------------------------------------------------------------test7

  // 5. Либо проставить отдельно, определенные права, поставив нужный чекбокс, либо разом выдать все доступные права, нажатием «+».
  await page.locator("label[title='АРМ Контроль КВФ - Причины неработоспособности камер']").click()

  // 6. Нажать Сохранить.
  await OIB_Page.click(UserCard.BTN_SAVE)

  // 6. Изменения будут Сохранены
  await OIB_Page.click(UserCard.BTN_EDIT)
  await OIB_Page.click(UserCard.BTN_ARM)
  await page.waitForTimeout(1000)
  await page.locator("//div[text()='НСИ']").click()
  await expect(page.locator("(//input[@value='352'])[1]")).toBeChecked()
  await expect(page.locator("label[title='АРМ Контроль КВФ - Причины неработоспособности камер']")).toHaveClass("el-checkbox is-checked")

  //сброс значений
  await page.locator("label[title='АРМ Контроль КВФ - Причины неработоспособности камер']").click()
  await OIB_Page.click(UserCard.BTN_SAVE)

  //закрытие сессии
  await OIB_Page.shutDown()
})

