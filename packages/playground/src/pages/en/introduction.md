---
title: AsciiMath Parser
description: Write LaTeX faster
layout: ../../layouts/MainLayout.astro
---

## What's this?

A JavaScript implementation of simple mathematical formula markup language. It is more readable and easy to learn compared with $\LaTeX$.

## How to Use

### API

You can use either `asciimath-parser` or `asciimath-parser-nearley`. This documentation is for the former, while the latter has some differences. Please refer to its [README](https://github.com/widcardw/asciimath-parser/tree/main/packages/nearley).

#### Basic Usage

Install the package with npm/yarn/pnpm.

```sh
pnpm i -D asciimath-parser
```

Import it and create an instance of Asciimath, then use the `toTex` method to generate LaTeX code.

```js
import { AsciiMath } from 'asciimath-parser'
const am = new AsciiMath()
console.log(am.toTex('sum_(n=1)^(+oo)1/n^2=pi^2/6'))
// \displaystyle{ \sum _{ n = 1 } ^{ + \infty } \frac{ 1 }{ n ^{ 2 } } = \frac{ \pi ^{ 2 } }{ 6 } }
```

#### Configuration and Extending Tokens

The following are the types of arguments that `AsciiMath` accepts at construction time

```ts
type ReplaceLaw = [RegExp | string, string | ((substring: string, ...args: any[]) => string)]

interface AsciiMathConfig {
  display?: boolean
  replaceBeforeTokenizing?: ReplaceLaw[]
  symbols?: Array<[string, SymbolValueType]> | Record<string, SymbolValueType>
}
```

-   `display` specifies whether the generated formula is contained in the `\displaystyle` environment. The default value is `true`.

-   `replaceBeforeTokenizing` replaces **the matched strings** with **the target strings** respectively before the formula is parsed by AsciiMath.

    For example, if you specify it like below:

    ```ts
    const cfg: AsciiMathConfig = {
      replaceBeforeTokenizing: [
        [/d0/g, '{:"d"theta:}'],
        [/x(\d+)/g, (_, $1) => `x^(${$1})`],
      ]
    }
    const am = new AsciiMath(cfg)
    console.log(am.toTex('...'))
    ```

    -   All of the `d0` will be replaced with `{:"d"theta:}`, and then be parsed into `{ \text{d} \theta }` by AsciiMath.
    -   Strings like `x2` and `x10` will be replaced with `x^(2)` and `x^(10)`, and then be parsed into `x^{ 2 }` and `x^{ 10 }`, respectively. (I think no one should write them like this, though ¯\\\_(ツ)\_/¯)

-   `symbols` specify the extended tokens. If you want to view all of the token types, please refer to [_`symbols.ts`_](https://github.com/widcardw/asciimath-parser/blob/main/packages/core/src/symbols.ts). However, it is **not recommended** to extend **all** of them. The following lists the recommended token types for extension

    ```ts
    enum TokenTypes {
      Const, // transform matched string into tex
      OperatorOA, // with unary operand, like `abs(a)`
      OperatorOAB, // with binary operands, like `frac(a)(b)`
      OperatorAOB, // infix operator, like `a / b`
      OperatorAO, // suffix operator, like factorial `n!`
    }
    ```

    You can specify it like below

    ```ts
    const cfg: AsciiMathConfig = {
      symbols: {
        dx: { type: TokenTypes.Const, tex: '{\\mathrm{d}x}' },
        rm: { type: TokenTypes.OperatorOA, tex: '\\mathrm{$1}', eatNext: true },
        frac: { type: TokenTypes.OperatorOAB, tex: '\\frac{ $1 }{ $2 }' },
        over: { type: TokenTypes.OperatorAOB, tex: '{ $1 \\over $2 }' },
      }
    }
    const am = new AsciiMath(cfg)
    console.log(am.toTex('...'))
    ```

    Then `dx`, `rm`, `frac` and `over` will be recognized as tokens of AsciiMath, and the code generation will be

    -   `dx` into `{\mathrm{d}x}`
    -   `rm(absc)` into `\mathrm{absc}`, where `$1` will be replaced with `absc`

        > If `eatNext` is set to `true`, then the next word will be "eat" by tokenizer and recognized as a literal string
        > even if there is any token in it. In the example above, `absc` contains the token `abs`, but the
        > program just simply read the word and put `absc` at the `$1`.
        >
        > Without `eatNext`, you will get `\mathrm{ \left|c\right| }`.
        >
        > If you want to read a longer sentense, just wrap it with doublequote `"` or
        > parens `(` `)` like `rm "here is a mathrm block"`
        >
        > `eatNext` is *only* recommended to be used with `OperatorOA` and `OperatorOAB`.

    -   `frac(m)(n)` into `\frac{ m }{ n }`, where `$1` and `$2` will be replaced with `m` and `n`, respectively
    -   `a over b` into `{ a \over b }`, where `$1` and `$2` will be replaced with `a` and `b`, respectively

### Cli

Install the cli locally or globally.

```sh
pnpm add -g asciimath-parser-cli
```

Transform input files with inline asciimath formulas (wrapped with backticks) to LaTeX formulas.

```sh
am-parse input.txt
# It will yield input_parsed_xxx.tex
```

## User Story

- Display formulas in the DOM with [KaTeX](https://katex.org) or [mathjax](https://mathjax.org).
- Use [Obsidian](https://obsidian.md) with the plugin [obsidian-asciimath](https://github.com/widcardw/obsidian-asciimath).
- Use the [cli](https://npmjs.com/package/asciimath-parser-cli) to convert asciimath formulas in the file to LaTeX formulas.

## Caution

- This library is refactored by me, which means that some of the syntax may be inconsistent with [asciimath.org](http://asciimath.org), especially the **matrix**.
- Asciimath parser itself does not depend on DOM or mathml, it simply parses your input code into LaTeX code. If you want to display formulas, please work it out with KaTeX or mathjax (for websites) or LaTeX (for articles).

## Special Thanks

zmx0142857's [note](https://zmx0142857.github.io/note) and his great help.

## Report an Issue

Go to [GitHub issue](https://github.com/widcardw/asciimath-parser/issues) and provide a template that can reproduce the problem you ran into.

