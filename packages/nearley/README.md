# Asciimath Parser Nearley

Another asciimath parser based on [nearley](https://nearley.js.org).

> **Warning**:
> This library is heavily working in progress, so currently there is no npm package available.
> In addition, some rules are not consistent with `asciimath-parser`.

If want to preview this library, you can visit https://asciimath.widcard.win and click on the <kbd>Nearley<sup>Beta</sup></kbd> button, then the formulas will be parsed by Asciimath Parser Nearley.

## TODO

- [ ] `==_a^b`
- [ ] multiline formulas
- [ ] backslashes in backtick
- [ ] single paren

## Differences

| output | asciimath parser | AM nearley version |
| ------ | ---------------- | ------------------ |
| ${\color{red} a}$ | `color(red)(a)` | `color"red" a` |
| $\text{text}$ | `text(text)` | `text"text"` |
| $\frac{\partial L}{\partial \sigma^2}$ | `pp L (sigma^2)` | `pp L sigma^2` or `pp L (sigma^2)` |

## How to dev

We use [`moo`](https://www.npmjs.com/package/moo) as the tokenizer, but it does not seem to support ESM, so we downloaded the repo and built it locally.

The parser core is _`parser.ne`_. After changing the file, you should run the following code to compile it to _`grammar.js`_.

```sh
pnpm run nearley
```

Then the _`index.ts`_ will export `AsciiMath` properly. You can use it like below, and the params are the same as `asciimath-parser`.

```ts
const am = new AsciiMath()
const tex = am.toTex('sum_(n=1)^(+oo)1/n^2=pi^2/6')
console.log(tex)
// \displaystyle{ \sum_{ n = 1 }^{ + \infty } \frac{ 1 }{ n^2 } = \frac{ \pi^2 }{ 6 } }
```
