import { Time, TimeFrame, TimeFrameList } from './timeframes.ts'

const lunch = new TimeFrame("lunch", new Time(13), new Time(14, 30))
const maintenance = new TimeFrame("maintenance", new Time(16, 30), new Time(18))

const defaultTimeFrameList = new TimeFrameList(
  new TimeFrame("sport", new Time(9, 30), new Time(10, 30)),
  lunch, maintenance
)

export default [
  // Sunday
  defaultTimeFrameList,

  // Monday
  new TimeFrameList(
    new TimeFrame("market", new Time(8, 30), new Time(10, 30)),
    lunch, maintenance
  ),

  // Tuesday
  defaultTimeFrameList,

  // Wednesday
  defaultTimeFrameList,

  // Thursday
  new TimeFrameList(
    new TimeFrame("chedraui", new Time(8, 30), new Time(10, 30)),
    lunch, maintenance
  ),

  // Friday
  defaultTimeFrameList,

  // Saturday
  defaultTimeFrameList
]
