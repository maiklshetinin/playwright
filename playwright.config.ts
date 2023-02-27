import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  workers: 1,
  testMatch: [
    "tests/1.test.ts",
    "tests/2.test.ts",
    "tests/3.test.ts",
    // "tests/4.test.ts",
    "tests/5.test.ts",
    "tests/6.test.ts",
    "tests/7.test.ts",
    "tests/8.test.ts",
    "tests/9.test.ts",
    // "tests/10.test.ts",
    "tests/11.test.ts",
    "tests/12.test.ts",
    "tests/13.test.ts",
    "tests/14.test.ts",
    // "tests/15.test.ts",
    "tests/16.test.ts",
    // "tests/17.test.ts",
    "tests/18.test.ts",
    "tests/19.test.ts",
    // "tests/20.test.ts",
    "tests/21.test.ts",
    "tests/22.test.ts",
],
  use: {
    headless: false,
    screenshot: "on",
    video: "on",
    launchOptions: {
      slowMo: 500,
    }
  },
  reporter: [["dot"], ["json", {
    outputFile: "jsonReports/jsonReport.json"
  }], ["html", {
    open: "always"
  }]]
}

export default config
