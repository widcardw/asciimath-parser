# Asciimath Parser

A parser that transforms asciimath to LaTeX.

[![NPM version](https://img.shields.io/npm/v/asciimath-parser?color=a1b858&label=npm)](https://www.npmjs.com/package/asciimath-parser)

## What is asciimath

A js implementation of simple mathematical formula markup language. Easier to learn and easier to use than LaTeX.

- Without tedious backslashes of LaTeX, it is readable.
- Even if the formula has syntax errors, only a single formula is affected, but the entire page is not affected.
- Asciimath precedence is complicated, but you can just add **parentheses** when in doubt.

## How to use

#### Install

```sh
ni -D asciimath-parser
```

If you want to render the formula in HTML document, you should also install `katex`.

#### Use

```ts
import { AsciiMath } from 'asciimath-parser'
const am = new AsciiMath()
console.log(am.toTex('sum _(n=1) ^(+oo) 1/(n^2) = (pi^2)/6'))
// \displaystyle{ \sum_{ n = 1 }^{ + \infty }\frac{ 1 }{ n ^{ 2 } }=\frac{ \pi ^{ 2 } }{ 6 } }
```

#### Configuration

```ts
import { AsciiMath } from 'asciimath-parser'
import type { AsciiMathConfig } from 'asciimath-parser'
const cfg: AsciiMathConfig = {
  /**
   * @default true
   * enable displayMode in KaTeX
   */
  display: true,
  /**
   * Extend tokens of asciimath
   * ```ts
   * {
   *   // Simply transform `d0` to `d theta`
   *   'd0': { type: TokenTypes.Const, tex: '{\\text{d}\\theta}' },
   *   // Token with unary symbol, the `$1` will be replaced with the following symbol
   *   'tsc': { type: TokenTypes.OperatorOA, tex: '\\textsc{$1}' },
   *   // Token with binary symbols, the `$1` and `$2` will be replaced with the following two symbols
   *   'frac': { type: TokenTypes.OperatorOAB, tex: '\\frac{ $1 }{ $2 }' },
   *   // Infix expression, the `$1` and `$2` will be replaced with the previous symbol and next symbol respectively
   *   'over': { type: TokenTypes.OperatorAOB, tex: '{ $1 \\over $2 }' },
   * }
   * ```
   *
   * You can extend the token types mentioned above, but it is *not recommended* to extend all types of [`enum TokenTypes`](https://github.com/widcardw/asciimath-parser/blob/main/packages/core/src/symbols.ts#L1-L20).
   */
  symbols: {},
  /**
   * Replace target expressions before tokenizing
   * ```ts
   * [
   *   [/&#(x?[0-9a-fA-F]+);/g, (match, $1) =>
   *     String.fromCodePoint($1[0] === 'x' ? '0' + $1 : $1)
   *   ],
   *   ...
   * ]
   * ```
   */
  replaceBeforeTokenizing: []
}
const am = new AsciiMath(cfg)
```

#### CLI

```sh
pnpm i asciimath-parser-cli
pnpx am-parse input_file.txt
# This will parse delimitered asciimath formulas into LaTeX formulas.
```

| Options                    |                                                                   | 
|----------------------------|-------------------------------------------------------------------|
| `-d <delimiter>`           | Specify a delimiter (default: `)                                  |
| `--display <display_mode>` | Whether to enable display mode in inline formula (default: false) |
| `-h, --help`               | Display this message                                              |
