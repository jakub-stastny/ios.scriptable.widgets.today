export const timeFramesCalendar = 'Time frames'
export const eventCalendarName = 'jakub.stastny.pt@gmail.com'
export const shortcutName = 'Today widget: update notes'

export const getShortcutTimeFrameURL = (event) => `shortcuts://run-shortcut?name=${encodeURIComponent(shortcutName)}&input=${encodeURIComponent(event.title)}`
export const widgetURL = 'calshow://'

export const cities = {PRG: 'Europe/Prague', SYD: 'Australia/Sydney', SF: 'America/Los_Angeles'}
