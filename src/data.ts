import { timeFramesCalendar, eventCalendarName } from './config.ts'
import { Calendar, CalendarEvent } from './scriptable-ios.ts'
import { getCurrentTimeFrame } from './timeframes.ts'
import schedule from './schedule.ts'

// Evening: show candle light image.
// Time frame colours.
export async function getCurrentEvent() {
  const calendar = await Calendar.forEventsByTitle(timeFramesCalendar)
  const timeFrameEvents = await CalendarEvent.today([calendar])
  const tf = getCurrentTimeFrame(schedule)

  if (tf) { // title: "Event title #mytimeframe"
    const currentEvent = timeFrameEvents.find(event => event.title.match(new RegExp(`#${tf.name}`)))

    if (currentEvent) {
      return {
        type: 'currentEvent',
        title: currentEvent.title.replace(/\s+#\w+/, ''),
        endDate: tf.timeRange.endTime.toDate(),
      }
    } else {
      return {
        type: 'timeframe',
        title: tf.name,
        endDate: tf.timeRange.endTime.toDate()
      }
    }

  } else { // Default to the main event.
    const mainEvent = timeFrameEvents.find(event => event.isAllDay)
    if (mainEvent) {
      return {type: 'main', title: mainEvent.title}
    } else {
      return {
        type: 'error',
        title: "Cannot find current time frame event"
      }
    }
  }
}

// TODO: prevent duplicates.
export async function getBirthdays() {
  const googleBirthdays = await Calendar.forEventsByTitle('Contacts')
  const siriBirthdays = await Calendar.forEventsByTitle('Birthdays')
  const events = await CalendarEvent.today([googleBirthdays, siriBirthdays])

  return events.map(event => event.title)
}

export async function getTodayEvents() {
  const calendar = await Calendar.forEventsByTitle(eventCalendarName)
  const events = await CalendarEvent.today([calendar])

  return events
}

export async function getDayFlags() {
  const calendar = await Calendar.forEventsByTitle('Routine')
  const events = await CalendarEvent.today([calendar])
  const calendarColour = new Color(calendar.color.hex, 1)

  return {calendarColour, events}
}
