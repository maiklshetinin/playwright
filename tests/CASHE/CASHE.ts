import { Locator, Page } from "@playwright/test";

export enum MainPage {
  BTN_GRZ = "//li[@title='Грз']",
  BTN_FNS = "//li[@title='ФНС']",
  BTN_SEARCH = "//button[@title='Искать']//i[1]",
  BTN_REFRESH = "//button[@title='Обновить']",
  input_search = "//input[@placeholder='Поиск по ГРЗ']",
  input_sources = "//input[@placeholder='Выберите источники актуализации']",
}

export enum UserMenu {
  BTN_USER_MENU = "div.el-dropdown",
  theme_dark = "//li[text()='Темная тема ']",
  theme_light = "//li[text()='Светлая тема ']",
  theme_default = "//li[text()='Исходная тема ']",
  change_password = "//li[text()='Сменить пароль']",

}


export enum GrzPage {
}

export default class CASHE {
  page: Page
  constructor(page: Page) {
    this.page = page
  }

  getRegExp(str: string) {
    return new RegExp(`^${str}$`)
  }

  async login(login: string, password: string) {
    await this.page.goto("http://192.168.10.11:8080/ceditor/")
    await this.page.fill("(//input[@class='el-input__inner'])[1]", login)
    await this.page.fill("input[type='password']", password)
    await this.page.click("button[type='button']")
  }

  async click(path: string) {
    await this.page.locator(path).click()
  }


  async shutDown() {
    await this.page.click("//div[@class='el-dropdown']//div[1]") //user's menu
    await this.page.click("//li[text()='Завершить работу']")
    await this.page.click("(//button[contains(@class,'el-button el-button--default')])[2]")
  }

  getNewDate(str: string) {
    if (str.includes(" ")) {
      const arr = str.split(" ");
      const date = arr[0].split(".").reverse().join("-");
      return new Date([date, arr[1]].join("T"));
    } else {
      return new Date(str.split(".").reverse().join("-"))
    }
  }
}