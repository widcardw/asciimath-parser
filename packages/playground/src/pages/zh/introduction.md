---
title: AsciiMath Parser
description: 编写可读性更好的公式
layout: ../../layouts/MainLayout.astro
---

## Asciimath 是什么？

一种 JavaScript 实现的简易的数学公式标记语言，相比 $\LaTeX$ 更加易学易用。

## 如何使用

### API

使用 npm/yarn/pnpm 包管理工具安装。

```sh
pnpm i -D asciimath-parser
```

引入 AsciiMath，创建实例，使用 `toTex` 方法来生成 LaTeX 代码。

```js
import { AsciiMath } from 'asciimath-parser'
const am = new AsciiMath()
console.log(am.toTex('sum_(n=1)^(+oo)1/n^2=pi^2/6'))
// \displaystyle{ \sum _{ n = 1 } ^{ + \infty } \frac{ 1 }{ n ^{ 2 } } = \frac{ \pi ^{ 2 } }{ 6 } }
```

### Cli

使用包管理工具安装，可以使用全局安装或本工作环境安装。

```sh
pnpm add -g asciimath-parser-cli
```

输入一个文件，将所有被 **反引号** \` 包裹的公式都转换为被 **美元符** `$` 包裹的 LaTeX 公式。

```sh
am-parse input.txt
# 将会生成 input_parsed_xxx.tex
```

## 使用场景

- 配合 [KaTeX](https://katex.org) 或 [mathjax](https://mathjax.org) 在 DOM 上生成公式。
- 使用 [Obsidian](https://obsidian.md) 笔记软件的 [obsidian-asciimath](https://github.com/widcardw/obsidian-asciimath) 插件。
- 使用 [cli](https://npmjs.com/package/asciimath-parser-cli) 将文件中的 asciimath 公式转换为 LaTeX 公式。

## 注意

- 这个库是由我个人重构的，一些语法可能与 [asciimath.org](http://asciimath.org) 原版不同，尤其是**矩阵**，使用时请格外注意。
- Asciimath parser 只是简单的将输入的公式转换为 LaTeX 代码，并不依赖于 DOM 和 mathml，如果你需要可视化呈现这些公式，请与 KaTeX 或 mathjax 等这些工具一起使用。


## 样例

| 主题 | 输出 | 源码 |
|------|------|-----------|
| 上下标 | $\displaystyle{ a _{ 1 } ^{ 2 } + b _{ 1 } ^{ 2 } = c _{ 1 } ^{ 2 } }$ | a_1^2 + b_1^2 = c_1^2 |
| 文本 | $\displaystyle{ \text{hello world} }$ | "hello world" |
| 分式 | $\displaystyle{ \frac{ a }{ b } , a {/} b }$ | a/b, a//b |
| 根式 | $\displaystyle{ \sqrt{ n } , \sqrt[ n ]{ x } , \frac{ a ^{ 2 } }{ \sqrt{ b } } }$ | sqrt n, root n x, (a^2)/(sqrt b) |
| 极限 | $\displaystyle{ \lim _{ n \to \infty } \left( 1 + \frac{ 1 }{ n } \right) ^{ n } }$ | lim_(n->oo) (1 + 1/n)^n |
| 积分 | $\displaystyle{ \int _{ a } ^{ b } f \left( x \right) {\text{d}x} }$ | int_a^b f(x) dx |
| 隐形括号 | $\displaystyle{ \sin { \frac{ x }{ 2 } } }$ | sin {: x/2 :} |
| 微分 | $\displaystyle{ \frac{ {\text{d}y} }{ {\text{d}x} } , \frac{ \text{d} r }{ \text{d} \theta } , f ^{\prime\prime} \left( x \right) }$ | dy/dx, ("d"r)/("d"theta), f''(x) |
| 微分 (实验性) | $\displaystyle{ \frac{ \mathrm{d} f }{ \mathrm{d} x } , \frac{ \mathrm{d} ^{ 2 } f }{ \mathrm{d} x ^{ 2 } } , \ddot{ x } }$ | ddfx , dd^2 f x , ddot x |
| 偏微分 | $\displaystyle{ \frac{ \partial f }{ \partial x } , \frac{ \partial ^{ 3 } f }{ \partial x \partial y ^{ 2 } } }$ | (del f)/(del x), (del^3 f)/(del x del y^2) |
| 偏微分 (实验性) | $\displaystyle{ \frac{ \partial f }{ \partial x } , \frac{ \partial ^{ 3 } f }{ \partial x \partial y ^{ 2 } } , \frac{ \partial { } }{ \partial x } }$ | ppfx, pp^3 f (x y^2), part {::} x |
| 矩阵 | $\displaystyle{ \left[ \begin{array}{cc} a&b\\c&d \\ \end{array} \right]}$ | [a, b; c, d] |
| 分段函数 | $\displaystyle{ \mid x \mid = \left\lbrace \begin{array}{ll} x&\text{if}\quad x > 0\\{-x}&\text{otherwise}\quad \\ \end{array} \right. }$ | \|x\| = { x, if x > 0; -x, otherwise :} |

你也可以使用 `|` 来编写增广矩阵，例如 `[a, b | c; d, e | f]`，它会生成 $\left[ \begin{array}{cc|c} a&b&c\\d&e&f \\ \end{array} \right]$.

## 符号对照手册

### 括号

| 输出 | 源码 | 输出 | 源码 | 输出 | 源码 | 输出 | 源码 |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ \left( \right. }$ | ( | $\displaystyle{ ) }$ | ) | $\displaystyle{ \left. \right. }$ | {: | $\displaystyle{ . }$ | :} |
| $\displaystyle{ \left[ \right. }$ | [ | $\displaystyle{ ] }$ | ] | $\displaystyle{ \left\lbrace \right. }$ | { | $\displaystyle{ \rbrace }$ | } |
| $\displaystyle{ \left\langle \right. }$ | (: | $\displaystyle{ \rangle }$ | :) | $\displaystyle{ \left\lfloor \right. }$ | \|__ | $\displaystyle{ \rfloor }$ | __\| |
| $\displaystyle{ \left\lceil \right. }$ | \|~ | $\displaystyle{ \rceil }$ | ~\| | $\displaystyle{ \mid }$ | \| | $\displaystyle{ \mid x\mid }$ | abs x |
| $\displaystyle{ \left\|\mathbf{ v }\right\| }$ | norm(bb(v)) | $\displaystyle{ \left\lfloor\frac{ x }{ 2 }\right\rfloor }$ | floor(x/2) | $\displaystyle{ \left\lceil\frac{ x }{ 3 }\right\rceil }$ | ceil(x/3) |


### 希腊字母

| 输出 | 源码 | 输出 | 源码 | 输出 | 源码 | 输出 | 源码 |
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


### 运算符

| 输出 | 源码 | 输出 | 源码 | 输出 | 源码 | 输出 | 源码 |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ + }$ | + | $\displaystyle{ {-} }$ | - | $\displaystyle{ \cdot }$ | * | $\displaystyle{ \ast }$ | ** |
| $\displaystyle{ {/} }$ | // | $\displaystyle{ \backslash }$ | \\ | $\displaystyle{ \times }$ | xx | $\displaystyle{ \div }$ | -: |
| $\displaystyle{ \circ }$ | @ | $\displaystyle{ \oplus }$ | o+ | $\displaystyle{ \otimes }$ | ox | $\displaystyle{ \odot }$ | o. |
| $\displaystyle{ \sum }$ | sum | $\displaystyle{ \prod }$ | prod | $\displaystyle{ \wedge }$ | ^^ | $\displaystyle{ \bigwedge }$ | ^^^ |
| $\displaystyle{ \vee }$ | vv | $\displaystyle{ \bigvee }$ | vvv | $\displaystyle{ \cap }$ | nn | $\displaystyle{ \bigcap }$ | nnn |
| $\displaystyle{ \cup }$ | uu | $\displaystyle{ \bigcup }$ | uuu |


### 关系符号

| 输出 | 源码 | 输出 | 源码 | 输出 | 源码 | 输出 | 源码 |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ = }$ | = | $\displaystyle{ \ne }$ | != | $\displaystyle{ \equiv }$ | -= | $\displaystyle{ \not\equiv }$ | !-= |
| $\displaystyle{ \cong }$ | ~= | $\displaystyle{ \approx }$ | ~~ | $\displaystyle{ < }$ | lt | $\displaystyle{ > }$ | gt |
| $\displaystyle{ \ge }$ | ge | $\displaystyle{ \le }$ | le | $\displaystyle{ \leqslant }$ | <= | $\displaystyle{ \geqslant }$ | >= |
| $\displaystyle{ \prec }$ | -< | $\displaystyle{ \succ }$ | >- | $\displaystyle{ \in }$ | in | $\displaystyle{ \notin }$ | !in |
| $\displaystyle{ \subset }$ | sub | $\displaystyle{ \supset }$ | sup | $\displaystyle{ \subseteq }$ | sube | $\displaystyle{ \supseteq }$ | supe |
| $\displaystyle{ \not\sube }$ | !sube | $\displaystyle{ ⊊ }$ | subne | $\displaystyle{ \unlhd }$ | normal | $\displaystyle{ \unrhd }$ | rnormal |
| $\displaystyle{ \lhd }$ | lhd | $\displaystyle{ \rhd }$ | rhd | $\displaystyle{ ∽ }$ | S~ | $\displaystyle{ \propto }$ | prop |


### 逻辑符号

| 输出 | 源码 | 输出 | 源码 | 输出 | 源码 | 输出 | 源码 |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ \text{ and } }$ | and | $\displaystyle{ \text{ or } }$ | or | $\displaystyle{ \neg }$ | not | $\displaystyle{ \Rightarrow }$ | rArr |
| $\displaystyle{ \text{if}\quad }$ | if | $\displaystyle{ \iff }$ | iff | $\displaystyle{ \forall }$ | AA | $\displaystyle{ \exists }$ | EE |
| $\displaystyle{ \bot }$ | _\|_ | $\displaystyle{ \top }$ | TT | $\displaystyle{ \vdash }$ | \|-- | $\displaystyle{ \models }$ | \|== |


### 其他

| 输出 | 源码 | 输出 | 源码 | 输出 | 源码 | 输出 | 源码 |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ \int }$ | int | $\displaystyle{ \iint }$ | iint | $\displaystyle{ \iiint }$ | iiint | $\displaystyle{ \oint }$ | oint |
| $\displaystyle{ \partial }$ | del | $\displaystyle{ \nabla }$ | grad | $\displaystyle{ \pm }$ | +- | $\displaystyle{ \varnothing }$ | O/ |
| $\displaystyle{ \infty }$ | oo | $\displaystyle{ \aleph }$ | aleph | $\displaystyle{ \angle }$ | /_ | $\displaystyle{ \therefore }$ | :. |
| $\displaystyle{ \because }$ | :' | $\displaystyle{ \ldots }$ | ... | $\displaystyle{ \cdots }$ | cdots | $\displaystyle{ \vdots }$ | vdots |
| $\displaystyle{ \ddots }$ | ddots | $\displaystyle{ \left\| \quad \right\| }$ | \| quad \| | $\displaystyle{ \diamond }$ | diamond | $\displaystyle{ \square }$ | square |
| $\displaystyle{ \mathbb{N} }$ | NN | $\displaystyle{ \mathbb{Q} }$ | QQ | $\displaystyle{ \mathbb{R} }$ | RR | $\displaystyle{ \mathbb{C} }$ | CC |


### 数学函数

| 输出 | 源码 | 输出 | 源码 | 输出 | 源码 | 输出 | 源码 |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ \sin }$ | sin | $\displaystyle{ \cos }$ | cos | $\displaystyle{ \tan }$ | tan | $\displaystyle{ \csc }$ | csc |
| $\displaystyle{ \sec }$ | sec | $\displaystyle{ \cot }$ | cot | $\displaystyle{ \sinh }$ | sinh | $\displaystyle{ \cosh }$ | cosh |
| $\displaystyle{ \tanh }$ | tanh | $\displaystyle{ \log }$ | log | $\displaystyle{ \ln }$ | ln | $\displaystyle{ \det }$ | det |
| $\displaystyle{ \dim }$ | dim | $\displaystyle{ \lim }$ | lim | $\displaystyle{ \text{mod} }$ | mod | $\displaystyle{ \gcd }$ | gcd |
| $\displaystyle{ \text{lcm} }$ | lcm | $\displaystyle{ \min }$ | min | $\displaystyle{ \max }$ | max | $\displaystyle{ \text{sgn} }$ | sgn |


### 箭头

| 输出 | 源码 | 输出 | 源码 | 输出 | 源码 | 输出 | 源码 |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ \uparrow }$ | uarr | $\displaystyle{ \downarrow }$ | darr | $\displaystyle{ \rightarrow }$ | rarr | $\displaystyle{ \leftarrow }$ | larr |
| $\displaystyle{ \to }$ | -> | $\displaystyle{ \mapsto }$ | \|-> | $\displaystyle{ \leftrightarrow }$ | harr | $\displaystyle{ \Rightarrow }$ | rArr |
| $\displaystyle{ \Leftarrow }$ | lArr | $\displaystyle{ \Leftrightarrow }$ | hArr | $\displaystyle{ \twoheadrightarrow }$ | ->> | $\displaystyle{ \rightarrowtail }$ | >-> |
| $\displaystyle{ \curvearrowleft }$ | curvArrLt | $\displaystyle{ \curvearrowright }$ | curvArrRt | $\displaystyle{ \circlearrowleft }$ | circArrLt | $\displaystyle{ \circlearrowright }$ | circArrRt |


### 字体

| 输出 | 源码 | 输出 | 源码 | 输出 | 源码 | 输出 | 源码 |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ \mathbf{ A } }$ | bb A | $\displaystyle{ \boldsymbol{ A } }$ | bm A | $\displaystyle{ \mathbb{ A } }$ | bbb A | $\displaystyle{ \mathcal{ A } }$ | cc A |
| $\displaystyle{ \mathtt{ A } }$ | tt A | $\displaystyle{ \mathfrak{ A } }$ | fr A | $\displaystyle{ \mathsf{ A } }$ | sf A | $\displaystyle{ \mathscr{ A } }$ | scr A |


### 注音

| 输出 | 源码 | 输出 | 源码 | 输出 | 源码 | 输出 | 源码 |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ \hat{ x } }$ | hat x | $\displaystyle{ \bar{ x } }$ | bar x | $\displaystyle{ \underline{ x } }$ | ul x | $\displaystyle{ \vec{ x } }$ | vec x |
| $\displaystyle{ \dot{ x } }$ | dot x | $\displaystyle{ \ddot{ x } }$ | ddot x | $\displaystyle{ \stackrel{\frown}{ 123 } }$ | arc 123 | $\displaystyle{ \tilde{ x } }$ | tilde x |


### 上下叠合

| 输出 | 源码 | 输出 | 源码 |
|:-----:|:-----:|:-----:|:-----:|
| $\displaystyle{ \overset{ \text{bala} }{ x } }$ | overset("bala")(x) | $\displaystyle{ \overbrace{ 12345 } ^{ n } }$ | overbrace(12345)^n |
| $\displaystyle{ \underbrace{ 12345 } _{ n } }$ | underbrace(12345)\_n | $\displaystyle{ \xlongequal[ 123 ]{ 456 } }$ | ==\_(123)^(456) |
| $\displaystyle{ \xrightarrow[ a ]{ b } }$ | -->\_(a)^(b) |


### 特殊

| 输出 | 源码 | 输出 | 源码 |
|:-----:|:-----:|:-----:|:-----:|
| $\text{I'm here}$ | text(I'm here) | $\hbar$ | tex(\hbar) |


### 转义符号

| 输出 | 源码 | 输出 | 源码 | 输出 | 源码 | 输出 | 源码 |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| $\#$ | \\# | \$ | \\$ | $\%$ | \\% | $\_$ | \\\_ |
| $\`a$ | "\\`a" | $@$ | \\@ | $\ $ | \\  | $\^a$ | "\\^a" |
| $\,$ | \\, | |  |  |  |  |  |

### 使用 `#` 来插入 `\displaystyle`

| 输出 | 源码 |
|:-----:|:-----:|
| $\displaystyle{ \left[ \begin{array}{cc} \displaystyle \frac{ \partial ^{ 2 } f }{ \partial x ^{ 2 } }&\frac{ \partial ^{ 2 } f }{ \partial x \partial y }\\\frac{ \partial ^{ 2 } f }{ \partial y \partial x }&\displaystyle \frac{ \partial ^{ 2 } f }{ \partial y ^{ 2 } } \\ \end{array} \right] }$ | [#part^2 f x, part^2 f (x y); part^2 f (y x), #part^2 f y] |

## 特别感谢

zmx0142857 的[笔记](https://zmx0142857.github.io/notes)以及他的帮助。

## 遇到问题

请至 [GitHub issue](https://github.com/widcardw/asciimath-parser/issues) 提供能够稳定复现的情况并给出适当的报错信息。

