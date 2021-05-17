// Skip leading 0.
export function convertTZ(tzString) {
  return new Date().toLocaleString('en-GB', {timeZone: tzString}).match(/0?(\d+:\d+)/)[1]
}

export function minutesDiff(date) {
  return Math.round((((date - Date.now()) % 86400000) % 3600000) / 60000)
}

// Do not skip leading 0.
export function timeFromDate(date) {
  return date.toLocaleString('en-GB').match(/\d+:\d+/)[0].split(':').slice(0, 2).join(':')
}
