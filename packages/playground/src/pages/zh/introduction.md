---
title: AsciiMath Parser
description: 编写可读性更好的公式
layout: ../../layouts/MainLayout.astro
---

## Asciimath 是什么？

一种 JavaScript 实现的简易的数学公式标记语言，相比 $\LaTeX$ 更加易学易用。

## 如何使用

### API

你可以使用 `asciimath-parser` 或者 `asciimath-parser-nearley`，如果想要使用前者，阅读本文档即可，而如果是后者，可能存在一些区别，请参照其 [README](https://github.com/widcardw/asciimath-parser/tree/main/packages/nearley).

#### 基本使用

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

#### 配置参数与扩展语法

以下为 `AsciiMath` 在构造时接受的参数类型

```ts
type ReplaceLaw = [RegExp | string, string | ((substring: string, ...args: any[]) => string)]

interface AsciiMathConfig {
  display?: boolean
  replaceBeforeTokenizing?: ReplaceLaw[]
  symbols?: Array<[string, SymbolValueType]> | Record<string, SymbolValueType>
}
```

-   `display` 指定生成的公式是否被包含在 `\displaystyle` 环境下，默认值为 `true`

-   `replaceBeforeTokenizing` 在公式被处理之前，将**匹配到的字符串**替换为**目标串**，然后再传入 AsciiMath 处理

    例如这样指定它

    ```ts
    const cfg: AsciiMathConfig = {
      replaceBeforeTokenizing: [
        [/d0/g, '{:"d"theta:}'],
        [/x(\d+)/g, (_, $1) => `x^(${$1})`],
      ]
    }
    const am = new AsciiMath(cfg) // 实例化
    console.log(am.toTex('...'))
    ```

    那么，在公式被解析之前，会先进行如下操作
    -    将字符串 `d0` 转换为 `{:"d"theta:}`，然后 AsciiMath 将 `{:"d"theta:}` 处理为 `{ \text{d} \theta }`
    -    将类似 `x2`, `x10` 转换为 `x^(2)` 以及 `x^(10)`，然后 AsciiMath 再将其分别转换为 `x^{ 2 }` 和 `x^{ 10 }`

-   `symbols` 指定扩展的 `TokenType`，所有的 Token 类型可参考 [_`symbols.ts`_](https://github.com/widcardw/asciimath-parser/blob/main/packages/core/src/symbols.ts)，但是**不建议随意扩展 Token**。下面列出建议扩展的类型：

    ```ts
    enum TokenTypes {
      Const, // 将匹配到的字符串翻译为目标 tex 代码
      OperatorOA, // 带有一个参数的操作符，例如绝对值 `abs(a)`
      OperatorOAB, // 带有两个参数的操作符，例如分数 `frac(a)(b)`
      OperatorAOB, // 中缀操作符，例如除法 `a / b`
      OperatorAO, // 后缀操作符，例如阶乘 `!`
    }
    ```

    例如，指定 `symbols` 的值为

    ```ts
    const cfg: AsciiMathConfig = {
      symbols: {
        dx: { type: TokenTypes.Const, tex: '{\\mathrm{d}x}' },
        rm: { type: TokenTypes.OperatorOA, tex: '\\mathrm{$1}', eatNext: true },
        frac: { type: TokenTypes.OperatorOAB, tex: '\\frac{ $1 }{ $2 }' },
        over: { type: TokenTypes.OperatorAOB, tex: '{ $1 \\over $2 }' },
      }
    }
    const am = new AsciiMath(cfg) // 实例化
    console.log(am.toTex('...'))
    ```

    那么 `dx`, `rm`, `frac`, `over` 将会成为对应的 Token 被识别，最终会达到下面的效果

    -   `dx` 生成的代码就是 `{\mathrm{d}x}`
    -   `rm(absc)` 生成的代码为 `\mathrm{absc}`，其中 `absc` 即为 `rm` 这个操作符的参数，`$1` 将会被 `absc` 替换

        > 其中 `eatNext` 的作用是，直接将下一个单词读取为字符串，而不识别其中的任何 token.
        > 上面的例子中，`absc` 包含的关键字 `abs`，但是程序并不会将它读取为 `abs` 和 `c`，而将它直接处理为 `absc` 字符串，并用它替换掉模板中的 `$1`.
        >
        > 如果不设置 `eatNext` 为 `true`，那么得到的结果就是 `\mathrm{ \left|c\right| }`.
        >
        > 如果你想要读取更长的字符串，可以用**双引号**或者**圆括号**来包裹这个串，例如 `rm "here is a mathrm block"`.
        >
        > `eatNext` 参数只建议与 `OperatorOA` 和 `OperatorOAB` 两种类型一起使用.

    -   `frac(m)(n)` 生成的代码为 `\frac{ m }{ n }`，`$1` 和 `$2` 会分别被 `m` 和 `n` 替换
    -   `a over b` 生成的代码为 `{ a \over b }`，`$1` 和 `$2` 会分别被 `a` 和 `b` 替换

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

## 特别感谢

zmx0142857 的[笔记](https://zmx0142857.github.io/note)以及他的帮助。

## 遇到问题

请至 [GitHub issue](https://github.com/widcardw/asciimath-parser/issues) 提供能够稳定复现的情况并给出适当的报错信息。

