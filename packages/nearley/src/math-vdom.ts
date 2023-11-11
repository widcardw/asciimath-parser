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
    if (!tag)
      return ''
    const attrStr = Object.entries(attr).map(([key, value]) => ` ${key}="${value}"`).join('')
    const childrenStr = typeof children === 'string' ? children : children.map(child => child.toString()).join('')
    return `<${tag}${attrStr}>${childrenStr}</${tag}>`
  }

  replace(from: string, to: Ast) {
    const { attr, children } = this
    if (attr) {
      Object.entries(attr).forEach(([key, value]) => {
        attr[key] = value.replace(from, to)
      })
    }
    if (typeof children === 'string') {
      this.children = children.replace(from, to)
    }
    else if (Array.isArray(children)) {
      children.forEach((child, i) => {
        if (child.tag === from)
          children[i] = to
        else
          children[i].replace(from, to)
      })
    }
    return this
  }

  static before(left: string, tag = 'mrow'): IMathVdom {
    return {
      tag,
      children: [
        { tag: 'mo', children: left },
        { tag: '$1' },
      ],
    }
  }

  static after(right: string, tag = 'mrow'): IMathVdom {
    return {
      tag,
      children: [
        { tag: '$1' },
        { tag: 'mo', children: right },
      ],
    }
  }

  static brace(left: string, right: string, tag = 'mrow'): IMathVdom {
    return {
      tag,
      children: [
        { tag: 'mo', children: left },
        { tag: '$1' },
        { tag: 'mo', children: right },
      ],
    }
  }

  static binary(first: string, second: string, tag: string): IMathVdom {
    return {
      tag,
      children: [
        { tag: first },
        { tag: second },
      ],
    }
  }

  static table(rows: string[][]): IMathVdom {
    return {
      tag: 'mtable',
      children: rows.map(row => ({
        tag: 'mtr',
        children: row.map(tag => ({
          tag: 'mtd',
          children: [{ tag }],
        })),
      })),
    }
  }
}
