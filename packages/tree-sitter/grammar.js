module.exports = grammar({
  name: 'asciimath',
  rules: {
    source_file: $ => repeat($._expression),
    _expression: $ => choice(
      $.identifier,
      $.unary_expression,
      $.binary_expression
    ),

    unary_expression: $ => prec(3, seq(
      $.operator,
      $._expression
    )),

    binary_expression: $ => prec.right(2, seq(
      $._expression,
      $.operator,
      $._expression
    )),

    identifier: $ => /[A-Za-z_][A-Za-z0-9_]*/,
    operator: $ => /[\+\-\*\/]/,
  }
})
