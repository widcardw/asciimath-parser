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

## 特别感谢

zmx0142857 的[笔记](https://zmx0142857.github.io/note)以及他的帮助。

## 遇到问题

请至 [GitHub issue](https://github.com/widcardw/asciimath-parser/issues) 提供能够稳定复现的情况并给出适当的报错信息。

