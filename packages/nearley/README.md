# Asciimath Parser Nearley

Another asciimath parser based on [nearley](https://nearley.js.org).

> **Warning**
> This library is heavily working in progress, so currently there is no npm package available.
> In addition, some rules are not consistent with `asciimath-parser`.

If want to preview this library, you can visit https://asciimath.widcard.win and click on the <kbd>Nearley<sup>Beta</sup></kbd> button, then the formulas will be parsed by Asciimath Parser Nearley.

## TODO

- [x] `==_a^b`
- [x] multiline formulas
- [x] unicode support
- [x] escape backslashes in text like `"\\"`
- [x] vabatim environment
  ```text
  verb "aaa
  bbb"
  ```
  translates to
  ```tex
  \\begin{aligned}
  & \\texttt{aaa} \\
  & \\texttt{bbb}
  \\end{aligned}
  ```
- [ ] single paren case like `(` and `)`
- [ ] table syntax sugar
  ```text
  table[
  a, b, c;
  d, e, f;
  ]
  ```
  is equal to
  ```text
  {:
  --
  |a|b|c|
  --
  d, e, f;
  --
  :}
  ```

## Differences

Asciimath Parser **Core** version is written in pure TypeScript, and we may
fail to consider some edge cases, so please report any issue if you run into
any error.

Asciimath Parser **Nearley** version is parsed with nearley grammar, so it is
**strict** and you **have to write correct formulas**.

About string literal: In **Nearley** version, text have to be quoted with `"` to skip tokenize, for example the argument of `color`, `tex`, and `hspace` command must be quoted. You can use escape sequences `\"` and `\\` in a string literal.

| output | AM core | AM nearley |
| ------ | ---------------- | ------------------ |
| ${\color{red} a}$ | `color(red)(a)` | `color"red" a` |
| $\text{text}$ | `text(text)` | `text"text"` |
| $a\hspace{12pt}b$ | `a hspace(12pt) b` | `a hspace"12pt" b` |
| $\frac{\partial L}{\partial \sigma^2}$ | `pp L (sigma^2)` | `pp L sigma^2` or `pp L (sigma^2)` |

## New Grammar

Added new infix symbol `over`, `atop` and `choose`:

```text
a over b,
a atop b,
a choose b
```

Added new symbol `--` which will be transformed into `\hline`. You can draw a table like this

```text
{:
--
|a|b|;
--
c, d;
--
:}
```

Verbatim environment (experimental)

```text
verb"#include<stdio.h>
int main() {
  printf(\"hello, world!\n\");
  return 0;
}"
```

## How to dev

We use [`moo`](https://www.npmjs.com/package/moo) as the tokenizer, but it does not seem to support ESM, so we downloaded the repo and built it locally.

The parser core is _`parser.ne`_. After changing the file, you should run the following code to compile it to _`grammar.js`_.

```sh
pnpm run nearley
```

Then the _`index.ts`_ will export `AsciiMath` properly. You can use it like below, and the params are  *almost* the same as `asciimath-parser`.

```ts
const am = new AsciiMath()
const tex = am.toTex('sum_(n=1)^(+oo)1/n^2=pi^2/6')
console.log(tex)
// \displaystyle{ \sum_{ n = 1 }^{ + \infty } \frac{ 1 }{ n^2 } = \frac{ \pi^2 }{ 6 } }
```

### Different params

- **symbols: Symbols**

  In AsciiMath Nearley version, We removed the `extConst` param, and added `symbols` param:
  ```ts
  const am = new AsciiMath({
    keyword: {
      dx: { tex: '{\\text{d}x}' },
      dy: { tex: '{\\text{d}y}' },
      dz: { tex: '{\\text{d}z}' },
      dt: { tex: '{\\text{d}t}' },
      ee: { tex: '\\text{e}' },
      ii: { tex: '\\text{i}' },
    },
    opOAB: {
      fbox: { tex: '\\fbox[ $2 ]{ $1 }' },
    },
  })
  ```
- **throws: boolean**

  If true, throws error when parser encounters any syntax error.
  If false, just output error message as a text string.
  Default is false.
