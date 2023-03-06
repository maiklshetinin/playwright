import { test, expect } from "@playwright/test";
import OIB, { Locators, LOGIN, PASSWORD, UserCard } from "./OIB";

const userLogin = "IVANOV111"

test("Установка временных ограничений пользователя (test 14.1, 14.2)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 1080,
  });

  const OIB_Page = new OIB(page)
  await OIB_Page.login(LOGIN, PASSWORD)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  //получить карточку пользователя
  await OIB_Page.getUserCard(userLogin)

  //В появившемся справа окне, нажать на изображение карандаша.
  await OIB_Page.click(UserCard.BTN_EDIT)
  await page.waitForTimeout(1000)


  //получение значения инпута
  const inputTime = "(//div[contains(@class,'el-date-editor no-prefix')]//input)[3]"
  const timeBeforeClick = OIB_Page.getNewDate(await page.locator(inputTime).inputValue()).getFullYear()

  //---------------------------------------------------------------------------------------------------------test1

  //1. Нажать на раскрывающееся меню «Время доступ», в карточке пользователя.
  await page.locator(Locators.accessTime).scrollIntoViewIfNeeded()
  await OIB_Page.click(Locators.accessTime)

  //1. Раскроется список, для задания времени доступа пользователя по дням недели.
  await expect(page.locator("div.el-collapse-item__wrap")).toBeVisible()

  //---------------------------------------------------------------------------------------------------------test2

  //2. Нажать на кнопку (+), рядом с параметрами «Время ограничения».
  await OIB_Page.click(Locators.BTN_PLUS)
  await page.waitForTimeout(1000)

  const timeAfterClick = OIB_Page.getNewDate(await page.locator(inputTime).inputValue()).getFullYear()
  await page.waitForTimeout(1000)

  //2. Кнопка (+) продлевает время ограничения на год.
  expect(timeAfterClick - timeBeforeClick).toBe(1)

  //закрытие сессии
  await OIB_Page.shutDown()

})

test("Установка временных ограничений пользователя (test 14.3.1)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 1080,
  });

  const OIB_Page = new OIB(page)
  await OIB_Page.login(LOGIN, PASSWORD)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  //получить карточку пользователя
  await OIB_Page.getUserCard(userLogin)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  //В появившемся справа окне, нажать на изображение карандаша.
  await OIB_Page.click(UserCard.BTN_EDIT)

  //1. Нажать на раскрывающееся меню «Время доступ», в карточке пользователя.
  await page.locator(Locators.accessTime).scrollIntoViewIfNeeded()
  await OIB_Page.click(Locators.accessTime)

  //---------------------------------------------------------------------------------------------------------test3.1

  //3. Предусмотрены так же кнопки быстрой пред установки временных интервалов работы:
  //- вся неделя круглосуточно
  //- вся неделя рабочее время
  //- удаление доступа
  await expect(page.locator(Locators.BTN_ALL_WEEK_AROUND_THE_CLOCK)).toBeVisible()
  await expect(page.locator(Locators.BTN_ALL_WEEK_WORK_TIME)).toBeVisible()
  await expect(page.locator(Locators.BTN_REMOVE_ACCESS)).toBeVisible()

  //3. При выставлении соответствующих параметров, измененные данные отображаются пользователю.
  //- вся неделя круглосуточно
  await page.locator(Locators.BTN_ALL_WEEK_AROUND_THE_CLOCK).highlight()
  await OIB_Page.click(Locators.BTN_ALL_WEEK_AROUND_THE_CLOCK)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  for (const input of await page.getByPlaceholder("НАЧАЛО").all())
    await expect(input).toHaveValue("00:00")

  for (const input of await page.getByPlaceholder("ОКОНЧАНИЕ").all())
    await expect(input).toHaveValue("23:59")


  //закрытие сессии
  await OIB_Page.shutDown()

})

test("Установка временных ограничений пользователя(test 14.3.2)", async ({ page }) => {
  await page.setViewportSize({
    width: 1600,
    height: 1080,
  });

  const OIB_Page = new OIB(page)
  await OIB_Page.login(LOGIN, PASSWORD)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  //получить карточку пользователя
  await OIB_Page.getUserCard(userLogin)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
  //В появившемся справа окне, нажать на изображение карандаша.
  await OIB_Page.click(UserCard.BTN_EDIT)

  //1. Нажать на раскрывающееся меню «Время доступ», в карточке пользователя.
  await page.locator(Locators.accessTime).scrollIntoViewIfNeeded()
  await OIB_Page.click(Locators.accessTime)

  //---------------------------------------------------------------------------------------------------------test3.2

  //- вся неделя рабочее время
  await page.locator(Locators.BTN_ALL_WEEK_WORK_TIME).highlight()
  await OIB_Page.click(Locators.BTN_ALL_WEEK_WORK_TIME)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  for (const input of await page.getByPlaceholder("НАЧАЛО").all())
    expect(await input.inputValue()).toBe("07:30")

  for (const input of await page.getByPlaceholder("ОКОНЧАНИЕ").all())
    expect(await input.inputValue()).toBe("20:30")

  //- удаление доступа

  await OIB_Page.click(Locators.BTN_REMOVE_ACCESS)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
  const div = await page.getByText("Нет доступа", { exact: true }).all()
  expect(div.length).toBe(7)

  //Можно так же в течении каждого дня выставить любое количество периодов доступа к системе, при нажатии (+).
  //кликнуть кнопку + (ПН)
  await page.locator("(//i[@class='icon-input-add'])[1]").click()
  await page.fill("(//input[@class='el-range-input'])[1]", "08:00")
  await page.fill("(//input[@class='el-range-input'])[2]", "17:00")
  expect(await page.locator("(//input[@class='el-range-input'])[1]").inputValue()).toBe("08:00")
  expect(await page.locator("(//input[@class='el-range-input'])[2]").inputValue()).toBe("17:00")


  //закрытие сессии
  await OIB_Page.shutDown()
})


