# @{%
# const lexer = require('./lexer')
# %}

@lexer lexer # Pass your lexer object using the @lexer option:
@builtin "whitespace.ne" # _ means optional whitespace

# Parsing ASCII math expressions with the following grammar
# v ::= [A-Za-z] | greek letters | numbers | other constant symbols
# u ::= sqrt | text | bb | other unary symbols for font commands
# b ::= frac | root | stackrel         binary symbols
# l ::= ( | [ | { | (: | {:            left brackets
# r ::= ) | ] | } | :) | :}            right brackets
# S ::= v | lEr | uS | bSS             Simple expression
# I ::= S_S | S^S | S_S^S | S          Intermediate expression
# E ::= IE | I/I                       Expression

# 原则上空格后置
# good: (infix _):+
# bad: (_ infix):+
expr -> (infix _):+ {% d => d[0].map(e => e[0]) %}
  | infix _ %opAOB _ infix {% d => ({ type: 'fraction', $1: d[0], $2: d[4] }) %}

infix -> simple _ "_" _ simple _ "^" _ simple {% d => ({ type: 'infix', value: d[0], sub: d[4], sup: d[8] }) %}
  | simple _ "^" _ simple _ "_" _ simple {% d => ({ type: 'infix', value: d[0], sub: d[8], sup: d[4] }) %}
  | simple _ "_" _ simple {% d => ({ type: 'infix', value: d[0], sub: d[4] }) %}
  | simple _ "^" _ simple {% d => ({ type: 'infix', value: d[0], sup: d[4] }) %}
  | simple {% id %} # id 等价于 d => d[0]

simple -> matrix {% id %}
  | %lp _ expr _ %rp {% d => ({ type: 'paren', left: d[0], right: d[4], value: d[2] }) %}
  | %opA _ simple {% d => ({ type:'opA', value: d[0], $1: d[2] }) %}
  | %opAB _ simple _ simple {% d => ({ type: 'opAB', value: d[0], $1: d[2], $2: d[4] }) %}
  | value {% id %}

# 矩阵至少含有一个分号
matrix -> %lp _ matrix_row (%semicolon _ matrix_row):+ %semicolon:? _ %rp {%
    d => ({
      type: 'matrix',
      left: d[0],
      right: d[6],
      value: [d[2], ...d[3].map(row => row[2])]
    })
  %}

# 矩阵每行至少有一元素
matrix_row -> expr _ (%comma _ expr _):* %comma:? _ {%
    d => [d[0], ...d[2].map(item => item[2])].flat()
  %}

value -> %literal {% id %}
  | %number {% id %}
  | %keyword {% id %}
