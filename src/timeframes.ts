/*
 * It might be better to use a ... yep, another calendar.
 *
 * It could be called Routine or Daily or Time frames and it'd be hidden.
 * Every day of the week would have repeating events – which would be
 * possible to customise for every particular day. Hence the generic
 * event would be the default as well as the template.
 *
 * The calendar would be typically hidden.
 *
 * It would also serve as a log of activity and tapping the widget will
 * open a text box input that would get saved as notes of the event.
 */

export class Time {
  hour: number
  minutes: number

  constructor(hour: number, minutes: number = 0) {
    this.hour = hour
    this.minutes = minutes
  }

  isBiggerThan(date: Date): boolean {
    return this.toDate(date) <= date
  }


  isSmallerThan(date: Date): boolean {
    return this.toDate(date) >= date
  }

  toDate(day: Date = new Date()): Date {
    return new Date(day.getFullYear(), day.getMonth(), day.getDate(), this.hour, this.minutes)
  }
}

export class TimeRange {
  startTime: Time
  endTime: Time

  constructor(startTime: Time, endTime: Time) {
    this.startTime = startTime
    this.endTime = endTime
  }

  includes(date: Date) {
    return this.startTime.isBiggerThan(date) && this.endTime.isSmallerThan(date)
  }
}

export class TimeFrame {
  name: string
  startTime: Time
  endTime: Time
  image: string
  timeRange: TimeRange

  constructor(name: string, startTime: Time, endTime: Time, image: string = null) {
    this.name = name
    this.timeRange = new TimeRange(startTime, endTime)
    this.image = image
  }
}

export class TimeFrameList {
  timeframes: Array<TimeFrame>

  constructor(...timeframes) {
    this.timeframes = timeframes
    // this.timeframes = [
    //   new TimeFrame("Sleep", new Time(0), new Time(6)),
    //   ...timeframes,
    //   new TimeFrame("Dinner", new Time(16), new Time(17)),
    //   new TimeFrame("Candles", new Time(17), new Time(22)),
    //   new TimeFrame("Sleep", new Time(22), new Time(24)),
    // ]
  }

  find(fn) {
    return this.timeframes.reverse().find(fn)
  }
}

export function getCurrentTimeFrame(allTimeframes) {
  const now = new Date()
  const timeframes = allTimeframes[now.getDay()]
  return timeframes.find(tf => tf.timeRange.includes(now))
}
