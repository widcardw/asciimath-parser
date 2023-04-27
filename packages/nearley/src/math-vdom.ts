import type { Ast } from '.'

export interface IMathVdom {
  tag: string
  attr?: Record<string, string>
  children?: IMathVdom[] | string
}

export class MathVdom implements IMathVdom {
  tag: string
  attr?: Record<string, string>
  children?: MathVdom[] | string

  constructor({ tag, attr, children }: IMathVdom) {
    this.tag = tag
    this.attr = attr
    this.children = typeof children === 'string'
      ? children
      : children?.map((child: IMathVdom) => {
        return child instanceof MathVdom ? child : new MathVdom(child)
      })
  }

  toString(): string {
    const { tag, attr = {}, children = '' } = this
    const attrStr = Object.entries(attr).map(([key, value]) => ` ${key}="${value}"`).join('')
    const childrenStr = typeof children === 'string' ? children : children.map(child => child.toString()).join('')
    return `<${tag}${attrStr}>${childrenStr}</${tag}>`
  }

  replace(from: string, to: Ast, convert: (am: string) => MathVdom) {
    const { attr, children } = this
    if (attr) {
      Object.entries(attr).forEach(([key, value]) => {
        attr[key] = value.replace(from, to.value)
      })
    }
    if (typeof children === 'string') {
      this.children = children.replace(from, to.value)
    }
    else if (Array.isArray(children)) {
      children.forEach((child, i) => {
        if (child.tag.includes(from))
          children[i] = convert(to)
        else
          children[i].replace(from, to, convert)
      })
    }
  }

  static brace(left: string, right: string): IMathVdom {
    return {
      tag: 'mrow',
      children: [
        { tag: 'mo', children: left },
        { tag: '$1' },
        { tag: 'mo', children: right },
      ],
    }
  }

  static accent(tag: string, decoration: string): IMathVdom {
    return {
      tag,
      children: [
        { tag: '$1' },
        { tag: 'mo', children: decoration },
      ],
    }
  }
}
