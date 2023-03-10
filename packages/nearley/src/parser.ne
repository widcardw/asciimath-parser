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

# 一系列非空的表达式
expr -> ((subsup | infix | part) _):+ {% d => d[0].map(e => e[0]) %}

# 偏微分
part -> %part (_ "^" _ simple):? _ subsup _ subsup {% d => ({ type: 'part', value: d[0], exp: d[1] ? d[1][3] : '', sup: d[3], sub: d[5] }) %}

# 分数
infix -> subsup _ %opAOB _ subsup {% d => ({ type: 'opOAB', value: 'frac', $1: d[0], $2: d[4] }) %}

# 上下标
subsup -> simple _ "_" _ simple _ "^" _ simple {% d => ({ type: 'subsup', value: d[0], sub: d[4], sup: d[8] }) %}
  | simple _ "^" _ simple _ "_" _ simple {% d => ({ type: 'subsup', value: d[0], sub: d[8], sup: d[4] }) %}
  | simple _ "_" _ simple {% d => ({ type: 'subsup', value: d[0], sub: d[4] }) %}
  | simple _ "^" _ simple {% d => ({ type: 'subsup', value: d[0], sup: d[4] }) %}
  | simple {% id %} # id 等价于 d => d[0]

simple -> matrix {% id %} # 矩阵
  # | %lp _ expr:? %rp {% d => ({ type: 'paren', left: d[0], right: d[3], value: d[2] }) %}
  # 括号表达式, 形如 (a, b, c, | d, e)
  | %lp _ matrixRow:? (%pipe _ matrixRow):? %rp {%
    d => ({
      type: 'paren',
      left: d[0],
      right: d[4],
      leftItems: d[2] || [],
      mid: d[3] ? { type: 'keyword', value: 'mid' } : null,
      rightItems: d[3] ? d[3][2] : [],
    })
  %}
  # 一元操作符
  | %opOA _ simple {% d => ({ type:'opOA', value: d[0].value, $1: d[2] }) %}
  # 二元操作符
  | %opOAB _ simple _ simple {% d => ({ type: 'opOAB', value: d[0].value, $1: d[2], $2: d[4] }) %}
  # 文本
  | %text %textContent:? %textEnd {%d => ({ type: 'text', value: d[1] ? d[1].value : '' }) %}
  # 竖线
  | %pipe _ expr:? %pipe {% d => ({ type: 'pipe', left: d[0], value: d[2], right: d[3] }) %}
  | value {% id %}

# 矩阵至少含有一个分号, 即: 矩阵至少有两行
matrix -> (%lp | %pipe) _ matrixRow (%semicolon _ matrixRow):+ (%semicolon _):? (%rp | %pipe) {%
    d => ({
      type: 'matrix',
      left: d[0][0],
      right: d[5][0],
      value: [d[2], ...d[3].map(row => row[2])]
    })
  %}

# 矩阵每行至少有一元素
matrixRow -> expr (%comma _ expr):* (%comma _):? {% d => [d[0], ...d[1].map(item => item[2])] %}

value -> %literal {% id %}
  | %number {% id %}
  | %keyword {% id %}
