/*
 * I might not be understanding the definition type files well.
 * Anyway changing .d.ts -> .ts and adding export before 'declare'
 * makes this work.

 * cp node_modules/@types/scriptable-ios/index.d.ts scriptable-ios.ts
 */
import { Image } from './scriptable-ios.ts'

// This must be an outside function rather than a private helper,
// so that way we can call it in the constructor (we cannot use
// the 'this' reference before super is called).
function parseArgs(args, fn1, fn2) {
  if (args.length === 2 || (args.length === 1 && typeof args[0] === 'object')) {
    return fn1()
  } else if (args.length === 1 && typeof args[0] === 'function') {
    return fn2()
  } else {
    throw "err"
  }
}

class AreaInterface {
  widget: ListWidget | WidgetStack
  defaultFontSize: number

  constructor(widget, declaredProperties: Object = {}, blockFn?) {
    this.widget = widget

    this.applyProperties(this.widget, {spacing: this.isSmall ? 2 : 5}, declaredProperties)
    this.defaultFontSize = this.isSmall ? 12 : 14

    if (blockFn) blockFn(this)
  }

  text(text: string, declaredProperties: Object = {}) {
    const renderedText = this.widget.addText(text) // OR UITable?
    this.applyProperties(renderedText, {font: Font.systemFont(this.defaultFontSize)}, declaredProperties)
    return renderedText
  }

  spacer() {
    this.widget.addSpacer(null)
  }

  get font() {
    // There are more options, there are just the basics.
    return {
      caption: this.isSmall ? Font.caption2() : Font.caption1(),
      bold: Font.boldSystemFont(this.defaultFontSize),
      italic: Font.italicSystemFont(this.defaultFontSize),
      monospaced: Font.regularMonospacedSystemFont(this.defaultFontSize),
      rounded: Font.regularRoundedSystemFont(this.defaultFontSize)
    }
  }

  get isSmall() {
    return config.widgetFamily === 'small'
  }

  // TODO: Make #private.
  applyProperties(object: any, defaultProperties: Object, declaredProperties: Object) {
    const properties = Object.assign({}, defaultProperties, declaredProperties)

    Object.entries(properties).forEach(([ propertyName, value ]) => {
      object[propertyName] = value
    })
  }
}

export class Stack extends AreaInterface {
  widget: WidgetStack
}

export class Widget extends AreaInterface {
  widget: ListWidget

  constructor(...args) {
    const args2 = parseArgs(args,
      () => [new ListWidget(), ...args],
      () => [new ListWidget(), {}, ...args])

    // @ts-ignore
    super(...args2)

    if (args2[2]) this.render()
  }

  // setBackgroundImage(fileName) {
  //   const fm = FileManager.iCloud()
  //   const filePath = [fm.documentsDirectory(), 'Widgets', fileName].join('/')
  //   this.widget.backgroundImage = Image.fromFile(filePath)
  // }

  stack(...args) {
    return parseArgs(args,
      () => new Stack(this.widget.addStack(), ...args),
      () => new Stack(this.widget.addStack(), {}, args[0]))
  }

  render() {
    Script.setWidget(this.widget)
    Script.complete()
  }
}

export function debugWidget(info: Object) {
  return new Widget((widget) => {
    widget.text("Debug", {font: widget.font.caption, textColor: Color.red()})
    widget.spacer()

    Object.entries(info).forEach(([ key, value ]) => {
      widget.stack((stack) => {
        stack.text(`${key}: `, {font: Font.boldMonospacedSystemFont(widget.defaultFontSize)})
        stack.text(JSON.stringify(value), {font: widget.font.monospaced})
      })
    })

    widget.spacer()
  })
}
