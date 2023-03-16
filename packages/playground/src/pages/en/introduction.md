---
title: AsciiMath Parser
description: Write LaTeX faster
layout: ../../layouts/MainLayout.astro
---

## What's this?

A JavaScript implementation of simple mathematical formula markup language. It is more readable and easy to learn compared with $\LaTeX$.

## How to Use

### API

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

