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


## Examples

| Themes | Output | Source code |
|------|------|-----------|
| Super and subscript | $\displaystyle{ a _{ 1 } ^{ 2 } + b _{ 1 } ^{ 2 } = c _{ 1 } ^{ 2 } }$ | a_1^2 + b_1^2 = c_1^2 |
| Text | $\displaystyle{ \text{hello world} }$ | "hello world" |
| Fraction | $\displaystyle{ \frac{ a }{ b } , a {/} b }$ | a/b, a//b |
| Square root | $\displaystyle{ \sqrt{ n } , \sqrt[ n ]{ x } , \frac{ a ^{ 2 } }{ \sqrt{ b } } }$ | sqrt n, root n x, (a^2)/(sqrt b) |
| Limit | $\displaystyle{ \lim _{ n \to \infty } \left( 1 + \frac{ 1 }{ n } \right) ^{ n } }$ | lim_(n->oo) (1 + 1/n)^n |
| Integral | $\displaystyle{ \int _{ a } ^{ b } f \left( x \right) {\text{d}x} }$ | int_a^b f(x) dx |
| Hidden paren | $\displaystyle{ \sin { \frac{ x }{ 2 } } }$ | sin {: x/2 :} |
| Differential | $\displaystyle{ \frac{ {\text{d}y} }{ {\text{d}x} } , \frac{ \text{d} r }{ \text{d} \theta } , f ^{\prime\prime} \left( x \right) }$ | dy/dx, ("d"r)/("d"theta), f''(x) |
| Differential (experimental) | $\displaystyle{ \frac{ \mathrm{d} f }{ \mathrm{d} x } , \frac{ \mathrm{d} ^{ 2 } f }{ \mathrm{d} x ^{ 2 } } , \ddot{ x } }$ | ddfx , dd^2 f x , ddot x |
| Partial | $\displaystyle{ \frac{ \partial f }{ \partial x } , \frac{ \partial ^{ 3 } f }{ \partial x \partial y ^{ 2 } } }$ | (del f)/(del x), (del^3 f)/(del x del y^2) |
| Partial (experimental) | $\displaystyle{ \frac{ \partial f }{ \partial x } , \frac{ \partial ^{ 3 } f }{ \partial x \partial y ^{ 2 } } , \frac{ \partial { } }{ \partial x } }$ | ppfx, pp^3 f (x y^2), part {::} x |
| Matrix | $\displaystyle{ \left[ \begin{array}{cc} a&b\\c&d \\ \end{array} \right]}$ | [a, b; c, d] |
| Piecewise function | $\displaystyle{ \mid x \mid = \left\lbrace \begin{array}{ll} x&\text{if}\quad x > 0\\{-x}&\text{otherwise}\quad \\ \end{array} \right. }$ | \|x\| = { x, if x > 0; -x, otherwise :} |

You can also use matrix dividers like `[a, b | c; d, e | f]`, it yields $\left[ \begin{array}{cc|c} a&b&c\\d&e&f \\ \end{array} \right]$.

## Manual

### Paren

| output | code | output | code | output | code | output | code |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ \left( \right. }$ | ( | $\displaystyle{ ) }$ | ) | $\displaystyle{ \left. \right. }$ | {: | $\displaystyle{ . }$ | :} |
| $\displaystyle{ \left[ \right. }$ | [ | $\displaystyle{ ] }$ | ] | $\displaystyle{ \left\lbrace \right. }$ | { | $\displaystyle{ \rbrace }$ | } |
| $\displaystyle{ \left\langle \right. }$ | (: | $\displaystyle{ \rangle }$ | :) | $\displaystyle{ \left\lfloor \right. }$ | \|__ | $\displaystyle{ \rfloor }$ | __\| |
| $\displaystyle{ \left\lceil \right. }$ | \|~ | $\displaystyle{ \rceil }$ | ~\| | $\displaystyle{ \mid }$ | \| | $\displaystyle{ \mid x\mid }$ | abs x |
| $\displaystyle{ \left\|\mathbf{ v }\right\| }$ | norm(bb(v)) | $\displaystyle{ \left\lfloor\frac{ x }{ 2 }\right\rfloor }$ | floor(x/2) | $\displaystyle{ \left\lceil\frac{ x }{ 3 }\right\rceil }$ | ceil(x/3) |


### Greek alphabet

| output | code | output | code | output | code | output | code |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ \alpha }$ | alpha | $\displaystyle{ \beta }$ | beta | $\displaystyle{ \chi }$ | chi | $\displaystyle{ \delta }$ | delta |
| $\displaystyle{ \Delta }$ | Delta | $\displaystyle{ \varepsilon }$ | epsi | $\displaystyle{ \epsilon }$ | epsilon | $\displaystyle{ \eta }$ | eta |
| $\displaystyle{ \gamma }$ | gamma | $\displaystyle{ \Gamma }$ | Gamma | $\displaystyle{ \iota }$ | iota | $\displaystyle{ \kappa }$ | kappa |
| $\displaystyle{ \lambda }$ | lambda | $\displaystyle{ \Lambda }$ | Lambda | $\displaystyle{ \mu }$ | mu | $\displaystyle{ \nu }$ | nu |
| $\displaystyle{ \omega }$ | omega | $\displaystyle{ \Omega }$ | Omega | $\displaystyle{ \phi }$ | phi | $\displaystyle{ \varphi }$ | varphi |
| $\displaystyle{ \Phi }$ | Phi | $\displaystyle{ \pi }$ | pi | $\displaystyle{ \Pi }$ | Pi | $\displaystyle{ \psi }$ | psi |
| $\displaystyle{ \Psi }$ | Psi | $\displaystyle{ \rho }$ | rho | $\displaystyle{ \sigma }$ | sigma | $\displaystyle{ \Sigma }$ | Sigma |
| $\displaystyle{ \tau }$ | tau | $\displaystyle{ \theta }$ | theta | $\displaystyle{ \vartheta }$ | vartheta | $\displaystyle{ \Theta }$ | Theta |
| $\displaystyle{ \upsilon }$ | upsilon | $\displaystyle{ \xi }$ | xi | $\displaystyle{ \Xi }$ | Xi | $\displaystyle{ \zeta }$ | zeta |


### Operator

| output | code | output | code | output | code | output | code |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ + }$ | + | $\displaystyle{ {-} }$ | - | $\displaystyle{ \cdot }$ | * | $\displaystyle{ \ast }$ | ** |
| $\displaystyle{ {/} }$ | // | $\displaystyle{ \backslash }$ | \\ | $\displaystyle{ \times }$ | xx | $\displaystyle{ \div }$ | -: |
| $\displaystyle{ \circ }$ | @ | $\displaystyle{ \oplus }$ | o+ | $\displaystyle{ \otimes }$ | ox | $\displaystyle{ \odot }$ | o. |
| $\displaystyle{ \sum }$ | sum | $\displaystyle{ \prod }$ | prod | $\displaystyle{ \wedge }$ | ^^ | $\displaystyle{ \bigwedge }$ | ^^^ |
| $\displaystyle{ \vee }$ | vv | $\displaystyle{ \bigvee }$ | vvv | $\displaystyle{ \cap }$ | nn | $\displaystyle{ \bigcap }$ | nnn |
| $\displaystyle{ \cup }$ | uu | $\displaystyle{ \bigcup }$ | uuu |


### Relation symbol

| output | code | output | code | output | code | output | code |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ = }$ | = | $\displaystyle{ \ne }$ | != | $\displaystyle{ \equiv }$ | -= | $\displaystyle{ \not\equiv }$ | !-= |
| $\displaystyle{ \cong }$ | ~= | $\displaystyle{ \approx }$ | ~~ | $\displaystyle{ < }$ | lt | $\displaystyle{ > }$ | gt |
| $\displaystyle{ \ge }$ | ge | $\displaystyle{ \le }$ | le | $\displaystyle{ \leqslant }$ | <= | $\displaystyle{ \geqslant }$ | >= |
| $\displaystyle{ \prec }$ | -< | $\displaystyle{ \succ }$ | >- | $\displaystyle{ \in }$ | in | $\displaystyle{ \notin }$ | !in |
| $\displaystyle{ \subset }$ | sub | $\displaystyle{ \supset }$ | sup | $\displaystyle{ \subseteq }$ | sube | $\displaystyle{ \supseteq }$ | supe |
| $\displaystyle{ \not\sube }$ | !sube | $\displaystyle{ ⊊ }$ | subne | $\displaystyle{ \unlhd }$ | normal | $\displaystyle{ \unrhd }$ | rnormal |
| $\displaystyle{ \lhd }$ | lhd | $\displaystyle{ \rhd }$ | rhd | $\displaystyle{ ∽ }$ | S~ | $\displaystyle{ \propto }$ | prop |


### Logical operator

| output | code | output | code | output | code | output | code |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ \text{ and } }$ | and | $\displaystyle{ \text{ or } }$ | or | $\displaystyle{ \neg }$ | not | $\displaystyle{ \Rightarrow }$ | rArr |
| $\displaystyle{ \text{if}\quad }$ | if | $\displaystyle{ \iff }$ | iff | $\displaystyle{ \forall }$ | AA | $\displaystyle{ \exists }$ | EE |
| $\displaystyle{ \bot }$ | _\|_ | $\displaystyle{ \top }$ | TT | $\displaystyle{ \vdash }$ | \|-- | $\displaystyle{ \models }$ | \|== |


### Others

| output | code | output | code | output | code | output | code |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ \int }$ | int | $\displaystyle{ \iint }$ | iint | $\displaystyle{ \iiint }$ | iiint | $\displaystyle{ \oint }$ | oint |
| $\displaystyle{ \partial }$ | del | $\displaystyle{ \nabla }$ | grad | $\displaystyle{ \pm }$ | +- | $\displaystyle{ \varnothing }$ | O/ |
| $\displaystyle{ \infty }$ | oo | $\displaystyle{ \aleph }$ | aleph | $\displaystyle{ \angle }$ | /_ | $\displaystyle{ \therefore }$ | :. |
| $\displaystyle{ \because }$ | :' | $\displaystyle{ \ldots }$ | ... | $\displaystyle{ \cdots }$ | cdots | $\displaystyle{ \vdots }$ | vdots |
| $\displaystyle{ \ddots }$ | ddots  | $\displaystyle{ \diamond }$ | diamond | $\displaystyle{ \square }$ | square | | |
| $\displaystyle{ \mathbb{N} }$ | NN | $\displaystyle{ \mathbb{Q} }$ | QQ | $\displaystyle{ \mathbb{R} }$ | RR | $\displaystyle{ \mathbb{C} }$ | CC |


### Math function

| output | code | output | code | output | code | output | code |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ \sin }$ | sin | $\displaystyle{ \cos }$ | cos | $\displaystyle{ \tan }$ | tan | $\displaystyle{ \csc }$ | csc |
| $\displaystyle{ \sec }$ | sec | $\displaystyle{ \cot }$ | cot | $\displaystyle{ \sinh }$ | sinh | $\displaystyle{ \cosh }$ | cosh |
| $\displaystyle{ \tanh }$ | tanh | $\displaystyle{ \log }$ | log | $\displaystyle{ \ln }$ | ln | $\displaystyle{ \det }$ | det |
| $\displaystyle{ \dim }$ | dim | $\displaystyle{ \lim }$ | lim | $\displaystyle{ \text{mod} }$ | mod | $\displaystyle{ \gcd }$ | gcd |
| $\displaystyle{ \text{lcm} }$ | lcm | $\displaystyle{ \min }$ | min | $\displaystyle{ \max }$ | max | $\displaystyle{ \text{sgn} }$ | sgn |


### Arrow

| output | code | output | code | output | code | output | code |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ \uparrow }$ | uarr | $\displaystyle{ \downarrow }$ | darr | $\displaystyle{ \rightarrow }$ | rarr | $\displaystyle{ \leftarrow }$ | larr |
| $\displaystyle{ \to }$ | -> | $\displaystyle{ \mapsto }$ | \|-> | $\displaystyle{ \leftrightarrow }$ | harr | $\displaystyle{ \Rightarrow }$ | rArr |
| $\displaystyle{ \Leftarrow }$ | lArr | $\displaystyle{ \Leftrightarrow }$ | hArr | $\displaystyle{ \twoheadrightarrow }$ | ->> | $\displaystyle{ \rightarrowtail }$ | >-> |
| $\displaystyle{ \curvearrowleft }$ | curvArrLt | $\displaystyle{ \curvearrowright }$ | curvArrRt | $\displaystyle{ \circlearrowleft }$ | circArrLt | $\displaystyle{ \circlearrowright }$ | circArrRt |


### Font

| output | code | output | code | output | code | output | code |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ \mathbf{ A } }$ | bb A | $\displaystyle{ \boldsymbol{ A } }$ | bm A | $\displaystyle{ \mathbb{ A } }$ | bbb A | $\displaystyle{ \mathcal{ A } }$ | cc A |
| $\displaystyle{ \mathtt{ A } }$ | tt A | $\displaystyle{ \mathfrak{ A } }$ | fr A | $\displaystyle{ \mathsf{ A } }$ | sf A | $\displaystyle{ \mathscr{ A } }$ | scr A |


### Notation

| output | code | output | code | output | code | output | code |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ \hat{ x } }$ | hat x | $\displaystyle{ \bar{ x } }$ | bar x | $\displaystyle{ \underline{ x } }$ | ul x | $\displaystyle{ \vec{ x } }$ | vec x |
| $\displaystyle{ \dot{ x } }$ | dot x | $\displaystyle{ \ddot{ x } }$ | ddot x | $\displaystyle{ \stackrel{\frown}{ x } }$ | arc x | $\displaystyle{ \tilde{ x } }$ | tilde x |
| $\overrightarrow{AB}$ | Vec(AB) | $\widehat{AB}$ | Hat(AB) | $\widetilde{CD}$ | Tilde(CD) | | |


### Superposition

| output | code | output | code |
|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ \overset{ \text{bala} }{ x } }$ | overset("bala")(x) | $\displaystyle{ \overbrace{ 12345 } ^{ n } }$ | overbrace(12345)^n |
| $\displaystyle{ \underbrace{ 12345 } _{ n } }$ | underbrace(12345)\_n | $\displaystyle{ \xlongequal[ 123 ]{ 456 } }$ | ==\_(123)^(456) |
| $\displaystyle{ \xrightarrow[ a ]{ b } }$ | -->\_(a)^(b) |


### Special

| output | code | output | code |
|:-----:|:-----:|:-----:|:-----:|
| $\text{I'm here}$ | text(I'm here) | $\hbar$ | tex"\hbar" |


### Escape

| output | code | output | code | output | code | output | code |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\#$ | \\# | \$ | \\$ | $\%$ | \\% or % | $\_$ | \\\_ |
| $\`a$ | "\\`a" | $@$ | \\@ | $\^a$ | "\\^a" | | |

### Space

| code | output | width |
|-----|------|-----|
| a quad b | $a\quad b$ | 1 em |
| a qquad b | $a\qquad b$ | 2 em |
| a enspace b | $a\enspace b$ | 0.5 em |
| a \\; b | $a\;b$ | 5/18 em |
| a \\: b | $a\:b$ | 4/18 em |
| a \\, b | $a\,b$ | 3/18 em |
| a \\! b | $a\!b$ | -3/18 em |
| a hspace(12pt) b | $a\hspace{12pt}b$ | 12 pt |

### Use `#` to insert `\displaystyle`

| output | code |
|:-----:|:-----:|
| $\displaystyle{ \left[ \begin{array}{cc} \displaystyle \frac{ \partial ^{ 2 } f }{ \partial x ^{ 2 } }&\frac{ \partial ^{ 2 } f }{ \partial x \partial y }\\\frac{ \partial ^{ 2 } f }{ \partial y \partial x }&\displaystyle \frac{ \partial ^{ 2 } f }{ \partial y ^{ 2 } } \\ \end{array} \right] }$ | [#part^2 f x, part^2 f (x y); part^2 f (y x), #part^2 f y] |

### With `aligned` environment

```
f(x) & = x "e"^x
                         <-- a blank line here
f'(x) & = (x + 1) "e"^x
                         <-- a blank line here
f''(x) & = (x + 2) "e"^x
```

$$
\begin{aligned}f \left( x \right) & = x \text{e} ^{ x } \\ f ^{\prime} \left( x \right) & = \left( x + 1 \right) \text{e} ^{ x } \\ f ^{\prime\prime} \left( x \right) & = \left( x + 2 \right) \text{e} ^{ x }\end{aligned}
$$

> **Caution** The `&` acts as `&` in `aligned` env, and the blank lines act as `\\` in LaTeX.

## Special Thanks

zmx0142857's [note](https://zmx0142857.github.io/notes) and his great help.

## Report an Issue

Go to [GitHub issue](https://github.com/widcardw/asciimath-parser/issues) and provide a template that can reproduce the problem you ran into.

