import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testMatch: ["tests/CASHE/21.test.ts"],
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
