import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  workers: 4,
  testMatch: [
    //----------------------стабильные тесты при 4х воркерах
    // "tests/1.test.ts",
    // "tests/2.test.ts",
    // "tests/3.test.ts",
    // "tests/4.test.ts",
    // "tests/5.test.ts",

    // "tests/6.test.ts",

    // "tests/7.test.ts",
    // "tests/8.test.ts",
   
   //-----------------------стабильные тесты при 2х воркерах
    // "tests/9.test.ts",
    // "tests/10.test.ts",

   //-----------------------стабильные тесты при 4х воркерах

    "tests/11.test.ts",
    "tests/12.test.ts",
    "tests/13.test.ts",
    "tests/17.test.ts",
    "tests/18_19.test.ts",
    "tests/20.test.ts",
    "tests/21.test.ts",
    "tests/22.test.ts",
    "tests/23.test.ts",
    "tests/24.test.ts",
    "tests/25.test.ts",
    "tests/26.test.ts",

  ],
  use: {
    headless: true,
    screenshot: "on",
    video: "on",
    launchOptions: {
      slowMo: 0,
    }
  },
  reporter: [["dot"], ["json", {
    outputFile: "jsonReports/jsonReport.json"
  }], ["html", {
    open: "always"
  }]]
}

export default config
