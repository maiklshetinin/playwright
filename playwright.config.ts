import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testMatch: ["tests/CASHE/6.test.ts"],
  use: {
    headless: false,
    screenshot: "on",
    video: "on"
  },
  reporter: [["dot"], ["json", {
    outputFile:"jsonReports/jsonReport.json"
  }], ["html", {
    open: "always"
  }]]
}

export default config
