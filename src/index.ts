import * as widgetConfig from './config.ts'
import { getCurrentEvent, getBirthdays, getTodayEvents, getDayFlags } from './data.ts'
import { instantiateUserInterface } from './ui.ts'

async function fetchData() {
  return {
    currentEvent: await getCurrentEvent(),
    birthdays: await getBirthdays(),
    todayEvents: await getTodayEvents(),
    dayFlags: await getDayFlags()
  }
}

// We wrap everything in an async main function just so
// the compilation doesn't fail for using top-level await.
async function main() {
  const data = await fetchData()
  const ui = instantiateUserInterface(config, {widgetConfig, config, data})

  ui.render()
}

main()
