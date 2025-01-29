type AttrType = object // <T, K> = Record<T extends string ? string : never, K extends string ? string : never> // Record<string, string>

interface IMathVdom {
  tag: string
  attr?: AttrType
  children?: IMathVdom[] | string | number
}

class MathVdom implements IMathVdom {
  tag: string
  attr?: AttrType | undefined
  children?: string | IMathVdom[] | undefined

  constructor({ tag, attr, children }: IMathVdom) {
    this.tag = tag
    this.attr = attr
    if (typeof children === 'string' || typeof children === 'number') {
      this.children = String(children)
    } else {
      this.children = children?.map((child: IMathVdom) => {
        return child instanceof MathVdom ? child : new MathVdom(child)
      })
    }
  }

  toString(): string {
    const { tag, attr = {}, children = '' } = this
    const attrStr = Object.entries(attr)
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ')
    const childrenStr =
      typeof children === 'string'
        ? children
        : children.map((child) => child.toString()).join('')
    if (tag.trim() === '') {
      return childrenStr
    }
    return `<${tag} ${attrStr}>${childrenStr}</${tag}>`
  }

  static before(left: string, tag = 'mrow'): IMathVdom {
    return {
      tag,
      children: [{ tag: 'mo', children: left }, { tag: '$1' }],
    }
  }

  static after(right: string, tag = 'mrow'): IMathVdom {
    return {
      tag,
      children: [{ tag: '$1' }, { tag: 'mo', children: right }],
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
      children: [{ tag: first }, { tag: second }],
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

export {
  type IMathVdom,
  MathVdom
}