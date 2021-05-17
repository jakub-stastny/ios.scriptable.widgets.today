import { Widget, debugWidget } from './widget.ts'
import { convertTZ, minutesDiff, timeFromDate } from './helpers.ts'

class GenericWidget {
  config: any
  widgetConfig: any
  data: any
  widget: Widget

  constructor({ config, widgetConfig, data }) {
    this.config = config
    this.widgetConfig = widgetConfig
    this.data = data
    this.widget = new Widget(this.widgetParams)
  }

  get widgetParams() {
    return {
      url: this.widgetConfig.widgetURL
    }
  }

  renderCurrentTimeFrame(widget = this.widget) {
    const { currentEvent } = this.data

    let url
    if (['main', 'currentEvent'].includes(currentEvent.type)) {
      url = this.widgetConfig.getShortcutTimeFrameURL(currentEvent)
    }

    const colours = {
      currentEvent: Color.green(),
      main: new Color('a62921', 1),
      timeframe: Color.lightGray(),
      error: Color.red()
    }

    widget.text(this.getCurrentEventTitle(currentEvent), {
      url,
      textColor: colours[currentEvent.type],
      font: this.widget.font.caption
    })
  }

  getCurrentEventTitle({ type, title }) {
    return (type === 'timeframe') ? `Time frame: ${title}` : title
  }

  renderDayFlags() {
    this.data.dayFlags.events.forEach(event => {
      const stackOptions = {
        backgroundColor: this.data.dayFlags.calendarColour,
        cornerRadius: 3
      }

      this.widget.stack(stackOptions, stack => {
        stack.widget.setPadding(1, 1, 1, 1)
        stack.text(event.title, {font: this.widget.font.bold, textColor: Color.white()})
      })
    })
  }

  renderBirthdays() {
    this.data.birthdays.forEach(title => this.widget.text(title))
  }

  renderTodayEvents() {
    this.data.todayEvents.forEach(event => {
      this.widget.stack(stack => {
        stack.text(timeFromDate(event.startDate), {font: this.widget.font.bold})
        stack.text(event.title)
      })
    })
  }

  renderOtherTimeZones(cities = this.widgetConfig.cities) {
    this.widget.stack((stack) => {
      Object.entries(cities).forEach(([ city, timezone ], index) => {
        stack.text(city, {font: this.widget.font.bold})
        stack.text(convertTZ(timezone))
        if (index != Object.keys(cities).length - 1) stack.spacer()
      })
    })
  }

  render() {
    const today = new Date()

    if (today.getHours() < 6 || today.getHours() > 19) {
      // TODO: show a picture of a candle.
      this.widget.text("Good night!")
    } else {
      this.renderCurrentTimeFrame()
      this.renderDayFlags()
      this.renderBirthdays()
      this.renderTodayEvents()
      this.widget.spacer()
      this.renderOtherTimeZones()
    }

    this.widget.render()
  }
}

class SmallWidget extends GenericWidget {
  renderCurrentTimeFrame() {
    const { currentEvent } = this.data
    const url = this.widgetConfig.getShortcutTimeFrameURL(currentEvent)
    const chunks = currentEvent.title.split(':').map(chunk => chunk.trim())
    // return super.renderCurrentTimeFrame()

    if (!chunks[1]) return super.renderCurrentTimeFrame()

    const [ projectName, taskName ] = chunks
    console.log({projectName, taskName}) ///

    this.widget.stack({url}, stack => {
      stack.widget.layoutVertically()

      stack.text(projectName, {
        textColor: new Color('a62921', 1),
        font: stack.font.caption
      })

      stack.text(taskName, {
        textColor: Color.gray(),
        font: stack.font.bold
      })
    })
  }

  getCurrentEventTitle({ type, title }) {
    return (type === 'timeframe') ? `TF: ${title}` : title
  }

  renderOtherTimeZones() {
    const { cities } = this.widgetConfig

    const shortenedList = Object.entries(cities).slice(0, 2)
    const shortenedData = shortenedList.reduce((buffer, [ key, value ]) => (
      Object.assign(buffer, {[key.substr(0, 2)]: value})
    ), {})

    super.renderOtherTimeZones(shortenedData)
  }

}

class MediumWidget extends GenericWidget {
  renderCurrentTimeFrame() {
    const { currentEvent } = this.data

    this.widget.stack((stack) => {
      super.renderCurrentTimeFrame(stack)

      if (currentEvent.endDate) {
        stack.spacer()
        const minutesRemaining = minutesDiff(currentEvent.endDate)
        stack.text(`${minutesRemaining} min`, {
          textColor: Color.gray(),
          font: Font.italicSystemFont(this.widget.defaultFontSize + 2)
        })
      }
    })
  }
}

class LargeWidget extends MediumWidget {
}

/*
 * Most peculiar bug ever:

  const widgetClasses = {
    small: SmallWidget,
    medium: MediumWidget,
    large: LargeWidget
  }

  const uiClass = widgetClasses[config.widgetFamily]

  * This would fail on the last line. On introspection,
  * widgetClasses seems to be empty, but Object.keys(widgetClasses)
  * returns the correct result.
  *
  * Long story short, it is not possible to hold these objects
  * in a hash in Scriptable, God only knows why.
  *
*/

// This could also support Siri response etc.
export function instantiateUserInterface(config, params) {
  // runsInApp: this is for debugging purposes.
  if (config.runsInApp || config.widgetFamily === 'small') {
    return new SmallWidget(params)
  } else if (config.widgetFamily === 'medium') {
    return new MediumWidget(params)
  } else if (config.widgetFamily === 'large') {
    return new LargeWidget(params)
  }
}
