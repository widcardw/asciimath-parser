interface TitleType {
  en: string
  zh: string
}

interface OneSymbolType {
  title: TitleType
  symbols: string[]
  cols: number
}

type SymbolType = Record<string, OneSymbolType>

const symbols: SymbolType = {
  greek: {
    title: {
      en: 'Greek Alphabet',
      zh: '希腊字母',
    },
    symbols: [
      'alpha', 'beta', 'chi', 'delta',
      'Delta', 'epsi', 'epsilon', 'eta',
      'gamma', 'Gamma', 'iota', 'kappa',
      'lambda', 'Lambda', 'mu', 'nu',
      'omega', 'Omega', 'phi', 'varphi',
      'Phi', 'varPhi', 'pi', 'Pi',
      'psi', 'Psi', 'rho', 'sigma', 'Sigma',
      'tau', 'theta', 'vartheta', 'Theta',
      'upsilon', 'xi', 'Xi', 'zeta',
    ],
    cols: 4,
  },
  paren: {
    title: {
      zh: '括号',
      en: 'Paren',
    },
    symbols: [
      '(', ')', '{:', ':}',
      '[', ']', '{', '}',
      '(:', ':)', '|__', '__|',
      '|~', '~|', '|', 'abs(x)',
      'norm(bb(v))', 'floor(x/2)', 'ceil(x/3)',
    ],
    cols: 4,
  },
  op: {
    title: {
      zh: '算数运算符',
      en: 'Operator',
    },
    symbols: [
      '+', '-', '*', '**',
      '//', '\\\\', 'xx', '-:',
      '@', 'o+', 'ox', 'o.',
      'sum', 'prod', '^^', '^^^',
      'vv', 'vvv', 'nn', 'nnn',
      'uu', 'uuu', '%',
    ],
    cols: 4,
  },
  relation: {
    title: {
      zh: '关系运算符',
      en: 'Relation Symbol',
    },
    symbols: [
      '=', '!=', '-=', '!-=',
      '~=', '~~', 'lt', 'gt',
      'ge', 'le', '<=', '>=',
      '-<', '>-', 'in', '!in',
      'sub', 'sup', 'sube', 'supe',
      '!sube', 'subne', 'normal', 'rnormal',
      'lhd', 'rhd', 'S~', 'prop',
    ],
    cols: 4,
  },
  logic: {
    title: {
      zh: '逻辑运算符',
      en: 'Logical Operator',
    },
    symbols: [
      'and', 'or', 'not', 'rArr',
      'if', 'iff', 'AA', 'EE',
      '_|_', 'TT', '|--', '|==',
    ],
    cols: 4,
  },
  others: {
    title: {
      zh: '杂项',
      en: 'Others',
    },
    symbols: [
      'int', 'iint', 'iiint', 'oint',
      'del', 'grad', '+-', 'O/',
      'oo', 'aleph', '/_', ':.',
      ':\'', '...', 'cdots', 'vdots',
      'ddots', 'square', 'NN', 'QQ',
      'RR', 'CC',
    ],
    cols: 4,
  },
  mathFn: {
    title: {
      zh: '数学函数',
      en: 'Math Function',
    },
    symbols: [
      'sin', 'cos', 'tan', 'csc',
      'sec', 'cot', 'sinh', 'cosh',
      'tanh', 'log', 'ln', 'det',
      'dim', 'lim', 'mod', 'gcd',
      'lcm', 'min', 'max', 'sgn',
    ],
    cols: 4,
  },
  arrow: {
    title: {
      zh: '箭头',
      en: 'Arrow',
    },
    symbols: [
      'uarr', 'darr', 'rarr', 'larr',
      '->', '|->', 'harr', 'rArr',
      'lArr', 'hArr', '->>', '>->',
      'curvArrLt', 'curvArrRt', 'circArrLt', 'circArrRt',
    ],
    cols: 4,
  },
  font: {
    title: {
      zh: '字体',
      en: 'Font',
    },
    symbols: [
      'bf A', 'bb A', 'bm A', 'bbb A',
      'tt A', 'fr A', 'sf A', 'scr A',
    ],
    cols: 4,
  },
  notation: {
    title: {
      zh: '注音符号',
      en: 'Notation',
    },
    symbols: [
      'hat x', 'bar x', 'ul x', 'vec x',
      'dot x', 'ddot x', 'arc x', 'tilde x',
      'Vec(AB)', 'Hat(AB)', 'Tilde(AB)',
    ],
    cols: 4,
  },
  supsub: {
    title: {
      zh: '上下叠合',
      en: 'Superposition',
    },
    symbols: [
      'overset("bala")(x)', 'overbrace(12345)^n',
      'underbrace(12345)_n', '==_(123)^(456)',
      '-->_(a)^(b)',
    ],
    cols: 2,
  },
  special: {
    title: {
      zh: '特殊',
      en: 'Special',
    },
    symbols: [
      'text(I\'m here)', 'tex"\\hbar"',
      'color(red)(abc)',
    ],
    cols: 2,
  },
  escape: {
    title: {
      zh: '转义符号',
      en: 'Escape',
    },
    symbols: [
      '\\#', '\\$', '\\@', '\\_',
    ],
    cols: 4,
  },
}

const displaySymbol = {
  title: {
    zh: '使用 <code>#</code> 来插入 <code>\displaystyle</code>',
    en: 'Use <code>#</code> to insert <code>\displaystyle</code>',
  },
  symbol: '[#part^2 f x, part^2 f (x y); part^2 f (y x), #part^2 f y]',
}

interface OneExampleType {
  theme: TitleType
  code: string
}

const examples: OneExampleType[] = [
  {
    theme: {
      zh: '上下标', en: 'Super and subscript',
    },
    code: 'a_1^2 + b_1^2 = c_1^2',
  },
  {
    theme: {
      zh: '文本', en: 'Text',
    },
    code: '"hello world',
  },
  {
    theme: {
      zh: '分式', en: 'Fraction',
    },
    code: 'a/b, a//b',
  },
  {
    theme: {
      zh: '根式', en: 'Square root',
    },
    code: 'sqrt n, root n x, a^2/sqrt b',
  },
  {
    theme: {
      zh: '极限', en: 'Limit',
    },
    code: 'lim_(n->oo) (1+1/n)^n',
  },
  {
    theme: {
      zh: '积分', en: 'Integral',
    },
    code: 'int_a^b f(x) dx',
  },
  {
    theme: {
      zh: '隐形括号', en: 'Hidden parens',
    },
    code: 'sin {: x/2 :}',
  },
  {
    theme: {
      zh: '微分', en: 'Differential',
    },
    code: 'dy/dx, ("d"r)/("d"theta), f\'\'(x)',
  },
  {
    theme: {
      zh: '微分（实验性）', en: 'Differential (exprimental)',
    },
    code: 'ddfx , dd^2 f x , ddot x',
  },
  {
    theme: {
      zh: '偏微分', en: 'Partial',
    },
    code: '(del f)/(del x), (del^3 f)/(del x del y^2)',
  },
  {
    theme: {
      zh: '偏微分（实验性）', en: 'Partial (experiment)',
    },
    code: 'ppfx, pp^3 f (x y^2), pp {::} x',
  },
  {
    theme: {
      zh: '矩阵', en: 'Matrix',
    },
    code: '[a, b; c, d], [a, b | c; d, e | f]',
  },
  {
    theme: {
      zh: '分段函数', en: 'Piecewise function',
    },
    code: '|x| = { x, if x > 0; -x, otherwise :}',
  },
]

const alignedSection = {
  title: {
    zh: '使用 <code>aligned</code> 环境',
    en: 'With <code>aligned</code> environment',
  },
  code: {
    zh: `f(x) & = x "e"^x
                            <-- 一个空行
f'(x) & = (x + 1) "e"^x
                            <-- 一个空行
f''(x) & = (x + 2) "e"^x`,
    en: `f(x) & = x "e"^x
                            <-- a blank line here
f'(x) & = (x + 1) "e"^x
                            <-- a blank line here
f''(x) & = (x + 2) "e"^x`,
  },
  res: 'f(x) & = x "e"^x\n\nf\'(x) & = (x + 1) "e"^x\n\nf\'\'(x) & = (x + 2) "e"^x',
  caution: {
    zh: '<p><strong>注意</strong> <code>&amp;</code> 相当于 LaTeX 中的 <code>&amp;</code>，而上述的空行相当于 LaTeX 中的 <code>\\\\</code> 换行</p>',
    en: '<p><strong>Caution</strong> The <code>&amp;</code> acts as <code>&amp;</code> in <code>aligned</code> env, and the blank lines act as <code>\\\\</code> in LaTeX.</p>',
  },
}

const spaces = {
  quad: {
    code: 'a quad b',
    width: '1 em',
  },
  qquad: {
    code: 'a qquad b',
    width: '2 em',
  },
  enspace: {
    code: 'a enspace b',
    width: '0.5 em',
  },
  semi: {
    code: 'a \\; b',
    width: '5/18 em',
  },
  colon: {
    code: 'a \\: b',
    width: '4/18 em',
  },
  comma: {
    code: 'a \\, b',
    width: '3/18 em',
  },
  excl: {
    code: 'a \\! b',
    width: '-3/18 em',
  },
  hspace: {
    code: 'a hspace(12pt) b',
    width: '12 pt',
  },
}

export type {
  TitleType,
  OneSymbolType,
  OneExampleType,
}

export {
  symbols,
  examples,
  displaySymbol,
  alignedSection,
  spaces,
}
