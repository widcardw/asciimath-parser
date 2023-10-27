@{%
const matrixPostProcess = (d, pipeIndex) => {
  if (d[3].length) { // 至少有两行
    const rows = [d[2], ...d[3].map(row => row[2])]
    return {
      type: 'matrix',
      left: d[0],
      right: d[4],
      value: rows.map(row => row.value),
      pipeIndex: pipeIndex ? Object.assign({}, ...rows.map(row => row.pipeIndex)) : null,
    }
  } else { // 只有一行
    return {
      type: 'paren',
      left: d[0],
      right: d[4],
      value: d[2].value,
      pipeIndex: pipeIndex ? d[2].pipeIndex : null
    }
  }
}

const matrixRowPostProcess = (d) => {
  const pipeIndex = {}
  const firstItem = String(d[0])
  const hasHeadline = firstItem === 'hline' || firstItem === '--'
  const offset = d[0] && !hasHeadline ? 1 : 0
  d[1].forEach((item, index) => {
    if (item[0][0].type === 'pipeEnd') {
      pipeIndex[index + offset] = item[0][0].value
    }
  })
  let value = [d[0], ...d[1].map(item => item[2])]

  // 允许 [|a, b|; c, d] => \begin{array}{|cc|}
  const begin = pipeIndex[0] ? 1 : 0
  const lastItem = d[1][d[1].length - 1]
  const end = lastItem?.[0]?.[0]?.type === 'pipeEnd' && lastItem?.[2] === null ? -1 : undefined

  /* 允许 hline 写在竖线前, 如
   * [
   * hline
   * |a|b|;
   * ]
   * 要实现这个功能, 只需把 hline 和竖线位置交换
   */
  if (hasHeadline && begin === 1) {
    if (value[1])
      value[1] = [d[0][0], ...value[1]]
    else
      value[1] = d[0]
  }
  return { value: value.slice(begin, end), pipeIndex }
}
%}

@lexer lexer # Pass your lexer object using the @lexer option:
# @builtin "whitespace.ne" # _ means optional whitespace

# Parsing ASCII math expressions with the following grammar
# v ::= [A-Za-z] | greek letters | numbers | other constant symbols
# u ::= sqrt | text | bb | other unary symbols for font commands
# b ::= frac | root | stackrel         binary symbols
# l ::= ( | [ | { | (: | {:            left brackets
# r ::= ) | ] | } | :) | :}            right brackets
# S ::= v | lEr | uS | bSS             Simple expression
# I ::= S_S | S^S | S_S^S | S          Intermediate expression
# E ::= IE | I/I                       Expression

# 多行公式
am -> _ expr:? (%newlines _ expr):* {% d => {
    const rows = d[2].map(row => row[2])
    return { type: 'am', value: d[1] ? [d[1], ...rows] : rows }
  }
  %}

# 空格, tab 以及换行, 但不含连续换行
_ -> (%space | %newline):* {% d => ' ' %}

# 一行非空的表达式
expr -> ((subsup | infix | part) _):+ {% d => d[0].map(e => e[0]) %}

# 偏微分
part -> %part (_ "^" _ simple):? _ subsup _ subsup {% d => ({ type: 'part', value: d[0], exp: d[1] ? d[1][3] : '', sup: d[3], sub: d[5] }) %}

# 中缀运算符, 如分数
infix -> subsup _ %opAOB _ subsup {% d => ({ type: 'opAOB', value: d[2].value, $1: d[0], $2: d[4] }) %}

# 上下标
subsup -> simple _ %sub _ simple _ %sup _ simple {% d => ({ type: 'subsup', value: d[0], sub: d[2].value, sup: d[6].value, $1: d[4], $2: d[8] }) %}
  | simple _ %sup _ simple _ %sub _ simple {% d => ({ type: 'subsup', value: d[0], sub: d[6].value, sup: d[2].value, $1: d[8], $2: d[4] }) %}
  | simple _ %sub _ simple {% d => ({ type: 'subsup', value: d[0], sub: d[2].value, $1: d[4] }) %}
  | simple _ %sup _ simple {% d => ({ type: 'subsup', value: d[0], sup: d[2].value, $2: d[4] }) %}
  | simple {% id %} # id 等价于 d => d[0]

# 简单表达式
simple -> matrix {% id %} # 矩阵
  # | %lp _ expr:? %rp {% d => ({ type: 'paren', left: d[0], right: d[3], value: d[2] }) %}
  # 一元操作符
  | %opOA _ simple {% d => ({ type: 'opOA', value: d[0].value, $1: d[2] }) %}
  # 后缀一元操作符 https://nearley.js.org/docs/how-to-grammar-good#dont-shy-away-from-left-recursion
  | simple _ %opAO {% d => ({ type: 'opAO', value: d[2].value, $1: d[0] }) %}
  # 二元操作符
  | %opOAB _ simple _ simple {% d => ({ type: 'opOAB', value: d[0].value, $1: d[2], $2: d[4] }) %}
  # 文本
  | %text %textEnd {%d => ({ type: 'text', value: d[1] ? d[1].value.slice(0, -1) : '' }) %}
  | %limits {% id %}
  | %align {% id %}
  | value {% id %}

matrix -> %lp _ matrixRow (%semicolon _ matrixRow):* %rp {% d => matrixPostProcess(d, true) %}
  | %pipe _ detRow (%semicolon _ detRow):* %pipeEnd {% d => matrixPostProcess(d, false) %}
  | %pipe {% d => ({ type: 'keyword', value: 'mid' }) %}

# 矩阵行, 可以为空
matrixRow -> expr:? ((%comma | %pipeEnd) _ expr:?):* {% matrixRowPostProcess %}

# 行列式的一行, 可以为空. 里面不能有竖线
detRow -> expr:? (%comma _ expr:?):* {% d => ({ value: [d[0], ...d[1].map(item => item[2])] }) %}

value -> %literal {% id %}
  | %number {% id %}
  | %keyword {% id %}
