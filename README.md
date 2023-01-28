# Asciimath Parser

A parser that transforms asciimath to LaTeX.

[![NPM version](https://img.shields.io/npm/v/asciimath-parser?color=a1b858&label=npm)](https://www.npmjs.com/package/asciimath-parser) [![Netlify Status](https://api.netlify.com/api/v1/badges/19d19f2c-4d9b-49b3-ac8d-7254a9e8a445/deploy-status)](https://app.netlify.com/sites/marvelous-muffin-35eb19/deploys)

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
   * Translate custom keywords into LaTeX expressions
   *
   * For example:
   * [
   *   ['dx', '\text{d}x'],
   *   ['dy', '\text{d}y']
   * ]
   */
  extConst: [],
  /**
   * Replace target expressions before tokenizing
   *
   * For example:
   * [
   *   [/&#(x?[0-9a-fA-F]+);/g, (match, $1) =>
   *     String.fromCodePoint($1[0] === 'x' ? '0' + $1 : $1)
   *   ],
   *   ...
   * ]
   */
  replaceBeforeTokenizing: []
}
const am = new AsciiMath(cfg)
```
