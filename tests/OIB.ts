import { Locator, Page } from "@playwright/test";

export const LAST_NAME = "Ivanov1"
export const LOGIN = "IVANOV1"
export const PASSWORD = "Asdf123$"

export enum DivLocators {
  userCard = "div.pl18.pr12",
  table_body = "//table[@id='empListTable']/tbody[1]",
  abc_search = "div.flex-child.letter-pointers",
  count_rows = "//div[@class='flex-child txt-bold']",
  department_employee = "//span[text()='Сотрудник подразделения']/following-sibling::div"
}
export enum CheckboxLocators {
  active = "(//span[@class='el-checkbox__inner'])[1]",
  employer = "(//span[@class='el-checkbox__inner'])[2]",
  role = "(//span[@class='el-checkbox__inner'])[3]"
}
export enum SpanLocators {
  role = "(//div[@class='auto-input']//span)[1]",
  login = "(//span[@class='text-only multilinespan'])[1]",
  firstName = "(//span[@class='text-only multilinespan'])[3]",
  lastName = "(//span[@class='text-only multilinespan'])[2]",
  organization_department = "(//span[@class='el-cascader__label'])[2]",
  until_such_date = "(//span[text()='Временные ограничения']/following-sibling::span)[3]",

}

export enum InputLocators {
  login = "(//div[contains(@class,'align-l align-l-child')]//input)[1]",
  lastName = "(//span[text()='Фамилия']/following::input)[1]",
  firstName = "(//span[text()='Имя']/following::input)[1]",
  job_title = "((//span[text()='Должность'])[2]/following::input)[1]",
  LOG_options = "//input[@placeholder='Выбрать']",
  LOG_search = "//input[@placeholder='Поиск по логу']",
  role = "((//span[text()='Роль'])[2]/following::input)[1]",
  search_user = "input[placeholder='Поиск пользователей']",
  EMPLOYER_firstName = "((//span[text()='Имя'])[2]/following::input)[1]",
  EMPLOYER_lastName = "((//span[text()='Фамилия'])[2]/following::input)[1]",
  EMPLOYER_date_of_dismissal = "//span[text()='Дата увольнения']/following::input",
  end_of_access_from = "(//span[text()='Окончание доступа']/following::input)[1]",
  end_of_access_before = "(//span[text()='Сотрудник']/following::input)[3]",
  list_of_rights = "(//input[@class='el-select__input is-small'])[1]",
  list_of_divisions = "(//input[@class='el-select__input is-small'])[2]",

}
export enum UserMenu {
  BTN_USER_MENU = "div.el-dropdown",
  theme_dark = "//li[text()='Темная тема ']",
  theme_light = "//li[text()='Светлая тема ']",
  theme_default = "//li[text()='Исходная тема ']",
  change_password = "//li[text()='Сменить пароль']",
  manual = "//li[text()='Руководство']"

}

export enum UserCard {
  userCard = "div.pl18.pr12",
  //---------------------------------------------------------------------------------------------------------header
  BTN_RIGHTS = "#tab-right",
  BTN_EMPLOYER = "//div[text()='Сотрудник']",
  BTN_LOG = "(//div[contains(@class,'el-tabs__item is-top')])[3]",
  BTN_LOG_CONNECTION_LOG = "//div[@id='pane-log']//button[1]",
  //---------------------------------------------------------------------------------------------------------
  BTN_CREATE = "(//button[contains(@class,'el-button el-button--success')])[2]",
  BTN_EDIT = "//button[@title='Редактировать']//i[1]",
  BTN_KEY = "i.password-edit-btn.icon--s",
  //---------------------------------------------------------------------------------------------------------footer
  BTN_SAVE = "(//button[contains(@class,'el-button el-button--success')])[1]",
  BTN_CANCEL = "(//button[contains(@class,'el-button el-button--text')])[3]",

  BTN_CBD = "//span[text()='ЦБД']",
  BTN_ARM = "//span[text()='АРМ']",
  BTN_REFRESH = "//button[@title='Обновить данные']//i[1]"


}

export enum Locators {
  //---------------------------------------------------------------------------------------------------------header
  BTN_ADD_A_NEW_USER = "//button[@title='Добавить нового пользователя']//button[1]",
  BTN_ADD_A_NEW_ROLE = "//button[@title='Добавить новую роль']//i[1]",
  BTN_ASSIGN_ROLE_TO_SELECTED_USERS = "//button[@title='Назначить роль выбранным пользователям']",
  BTN_SEARCH = "button[title='Искать']",
  BTN_CONNECTION_LOG = "(//button[contains(@class,'el-button el-button--text')])[1]",
  BTN_CREATE_EMPLOYEES_FOR_SELECTED_USERS = "//button[@title='Создать сотрудников для выбранных пользователей']",
  BTN_COPY_SELECTED_USER = "//button[@title='Копировать выбранного пользователя/роль']//i[1]",
  BTN_EMPLOYER_DELEGATE_TO_A_NEW_DEPARTMENT = "//button[@title='Откомандировать в новый отдел']//span[1]",
  BTN_DOWNLOAD_CSV = "//button[@title='Выгрузить в CSV-файл']",
  BTN_DOWNLOAD_XLSX = "//button[@title='Выгрузить в XLSX-файл']",
  BTN_DOWNLOAD_PDF = "//button[@title='Выгрузить в PDF-файл']",
  //---------------------------------------------------------------------------------------------------------userCard
  // BTN_CANCEL = "(//button[contains(@class,'el-button el-button--text')])[3]",

  //---------------------------------------------------------------------------------------------------------

  accessTime = "(//div[@class='flex-child flex-child--grown']//div)[1]",
  //---------------------------------------------------------------------------------------------------------
  BTN_EMPLOYER_EDIT = "//div[@id='pane-employee']/div[1]/div[1]/div[1]/div[1]/button[1]",
  BTN_EMPLOYER_SEND_ON_A_SECONDMENT = "//span[text()='Откомандировать']",
  //---------------------------------------------------------------------------------------------------------

  BTN_PLUS = "img[title='Продлить на 1 год']",
  BTN_ALL_WEEK_AROUND_THE_CLOCK = "i.tr-btn.all-week-24",
  BTN_ALL_WEEK_WORK_TIME = "i.tr-btn.all-week-wt",
  BTN_REMOVE_ACCESS = "i.tr-btn.remove-time-limit",
  //---------------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------

}

export enum ConnectionLog {
  modal = "(//div[@class='modal-window']//div)[1]",
  table = "//table[@id='connectionLogTable']/tbody[1]",
  BTN_SEARCH = "(//div[contains(@class,'el-input el-input--small')]/following-sibling::button)[2]",
  BTN_HOUR = "//span[text()='За час']",
  BTN_TODAY = "//span[text()='Cегодня']",
  BTN_DAY = "//span[text()='За сутки']",
  BTN_WEEK = "//span[text()='За неделю']",
  BTN_MONTH = "//span[text()='За месяц']",
  BTN_YEAR = "//span[text()='За месяц']",
  BTN_ALL = "//span[text()='Все']",
  BTN_DOWNLOAD_CSV = "(//button[@title='Выгрузить в CSV-файл'])[2]",
  BTN_DOWNLOAD_XLSX = "(//button[@title='Выгрузить в XLSX-файл'])[2]",
  BTN_DOWNLOAD_PDF = "(//button[@title='Выгрузить в PDF-файл'])[2]",
  input_list_of_divisions = "(//div[@class='el-select__tags']//input)[3]",
  inputFromDate = "(//div[contains(@class,'el-date-editor el-input')]//input)[3]",
  inputBeforeDate = "(//div[contains(@class,'el-date-editor el-input')]//input)[4]",
  ul_list_of_divisions = "(//ul[@class='el-scrollbar__view el-select-dropdown__list'])[3]",
  BTN_CLEAR_DIVISION = "//i[@class='el-tag__close el-icon-close']",
  input_search = "//input[@placeholder='Поиск']"
}

export default class OIB {
  page: Page
  constructor(page: Page) {
    this.page = page
  }

  getRegExp(str: string) {
    return new RegExp(`^${str}$`)
  }

  async login(login: string, password: string) {
    await this.page.goto("http://192.168.10.11:8080/oib/#/")
    await this.page.fill("(//input[@class='el-input__inner'])[1]", login)
    await this.page.fill("input[type='password']", password)
    await this.page.click("button[type='button']")
  }

  async findUser(login: string) {
    // ввод в поиск учётную запись
    await this.page.fill("input[placeholder='Поиск пользователей']", login)
    //нажать чекбокс

  }

  async selectUserCheckbox(login: string) {
    const regexp = new RegExp(`^${login}$`)
    //2. Выделить нужную запись и проставить чекбокс.
    //TODO:сначала кликаем на строку чтобы добавить класс current
    await this.page.locator("//table[@role='grid']//tbody[1]").getByText(regexp).click()
    //кликаем по чекбоксу
    await this.page.locator("//tr[contains(@class, 'current')]//td[1]").click()
  }

  async getUserCard(login: string) {
    const regexp = new RegExp(`^${login}$`)
    //отключение чекбокса Активные
    await this.page.click(CheckboxLocators.active)
    // ввод в поиск учётную запись
    await this.page.fill("input[placeholder='Поиск пользователей']", login)
    // 1. Выделить нужную учетную запись.
    // await this.page.click("//table[@id='empListTable']")
    await this.page.locator("table#empListTable>tbody").getByText(regexp).click()
  }

  async click(path: string) {
    await this.page.locator(path).click()
  }


  async shutDown() {
    await this.page.click("//div[@class='el-dropdown']//div[1]") //user's menu
    await this.page.click("//li[text()='Завершить работу']")
    await this.page.click("(//button[contains(@class,'el-button el-button--default')])[2]")
  }
  //TODO:заменить на getFirstRow
  getFirstRowInTable() {
    return this.page.locator(DivLocators.table_body).getByRole("row").nth(0)
  }

  getAllRowsInTable() {
    return this.page.locator(DivLocators.table_body).getByRole("row")
  }


  async getTdInnerText(locator: Locator, text: string) {
    return await locator.getByText(text).nth(0).innerText()
  }

  async getTableLength() {
    return (await this.page.locator(DivLocators.table_body).getByRole("row").all()).length

  }

  getExtension(ext: string) {
    const res = ext.match(/\.([^.]+)$/) as RegExpMatchArray
    return res[1]

  }

  getFirstRow(table: string) {
    return this.page.locator(table).getByRole("row").nth(0)
  }

  getAllRow(table: string) {
    return this.page.locator(table).getByRole("row")
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