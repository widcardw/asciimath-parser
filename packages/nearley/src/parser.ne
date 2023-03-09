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

am -> _ expr:? {% d => d[1] %}

# 原则上空格后置
# good: (subsup _):+
# bad: (_ subsup):+
expr -> ((subsup | infix) _):+ {% d => d[0].map(e => e[0]) %}

infix -> subsup _ %opAOB _ subsup {% d => ({ type: 'opOAB', value: 'frac', $1: d[0], $2: d[4] }) %}

subsup -> simple _ "_" _ simple _ "^" _ simple {% d => ({ type: 'subsup', value: d[0], sub: d[4], sup: d[8] }) %}
  | simple _ "^" _ simple _ "_" _ simple {% d => ({ type: 'subsup', value: d[0], sub: d[8], sup: d[4] }) %}
  | simple _ "_" _ simple {% d => ({ type: 'subsup', value: d[0], sub: d[4] }) %}
  | simple _ "^" _ simple {% d => ({ type: 'subsup', value: d[0], sup: d[4] }) %}
  | simple {% id %} # id 等价于 d => d[0]

simple -> matrix {% id %}
  | %lp _ expr %rp {% d => ({ type: 'paren', left: d[0], right: d[3], value: d[2] }) %}
  | %opOA _ simple {% d => ({ type:'opOA', value: d[0].value, $1: d[2] }) %}
  | %opOAB _ simple _ simple {% d => ({ type: 'opOAB', value: d[0].value, $1: d[2], $2: d[4] }) %}
  | %color %literal %colorEnd _ simple {% d => ({ type: 'opOAB', value: 'color', $1: d[1], $2: d[4] }) %}
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
matrix_row -> expr (%comma _ expr):* %comma:? _ {%
    d => [d[0], ...d[1].map(item => item[2])].flat()
  %}

value -> %literal {% id %}
  | %number {% id %}
  | %keyword {% id %}
