# Asciimath Parser

A parser that transforms asciimath to LaTeX.

[![NPM version](https://img.shields.io/npm/v/asciimath-parser?color=a1b858&label=npm)](https://www.npmjs.com/package/asciimath-parser)

## What is asciimath

A js implementation of simple mathematical formula markup language. Easier to learn and easier to use than LaTeX.

- Without tedious backslashes of LaTeX, it is readable.
- Even if the formula has syntax errors, only a single formula is affected, but the entire page is not affected.
- Asciimath precedence is complicated, but you can just add **parentheses** when in doubt.

## How to use

#### CLI

```sh
pnpm i asciimath-parser-cli
pnpx am-parse input_file.txt
# This will parse delimitered asciimath formulas into LaTeX formulas.
```

| Options  |        | 
|----------|--------|
| `-d <delimiter>`           | Specify a delimiter (default: `) |
| `--display <display_mode>` | Whether to enable display mode in inline formula (default: false) |
| `-h, --help`               |    Display this message |
