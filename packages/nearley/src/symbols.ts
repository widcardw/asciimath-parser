export enum TokenTypes {
  keyword = 'keyword',
  opOA = 'opOA',
  opOAB = 'opOAB',
  lp = 'lp',
  rp = 'rp',
  limits = 'limits',
  sub = 'sub',
  sup = 'sup',
  align = 'align',
  part = 'part',
  opAO = 'opAO',
  opAOB = 'opAOB',
  pipe = 'pipe',
}

interface MathMLConfig {
  tag: string
  attr?: Record<string, string>
  value?: string
}

interface SymbolConfig {
  alias?: string | string[]
  tex: string
  mathml?: MathMLConfig
  strip?: boolean
}

export interface Symbols {
  keyword?: Record<string, SymbolConfig>
  opOA?: Record<string, SymbolConfig>
  opOAB?: Record<string, SymbolConfig>
  lp?: Record<string, SymbolConfig>
  rp?: Record<string, SymbolConfig>
  limits?: Record<string, SymbolConfig>
  sub?: Record<string, SymbolConfig>
  sup?: Record<string, SymbolConfig>
  align?: Record<string, SymbolConfig>
  part?: Record<string, SymbolConfig>
  opAO?: Record<string, SymbolConfig>
  opAOB?: Record<string, SymbolConfig>
  pipe?: Record<string, SymbolConfig>
}

const symbols: Required<Symbols> = {
  keyword: {
    // greek letters
    'alpha': { tex: '\\alpha', mathml: { tag: 'mi', value: '\u03B1' } },
    'beta': { tex: '\\beta', mathml: { tag: 'mi', value: '\u03B2' } },
    'gamma': { tex: '\\gamma', mathml: { tag: 'mi', value: '\u03B3' } },
    'Gamma': { tex: '\\Gamma', mathml: { tag: 'mo', value: '\u0393' } },
    'delta': { tex: '\\delta', mathml: { tag: 'mi', value: '\u03B4' } },
    'Delta': { tex: '\\Delta', mathml: { tag: 'mo', value: '\u0394' } },
    'epsilon': { tex: '\\epsilon', mathml: { tag: 'mi', value: '\u03F5' } },
    'epsi': { alias: 'varepsilon', tex: '\\varepsilon', mathml: { tag: 'mi', value: '\u03B5' } },
    'zeta': { tex: '\\zeta', mathml: { tag: 'mi', value: '\u03B6' } },
    'eta': { tex: '\\eta', mathml: { tag: 'mi', value: '\u03B7' } },
    'theta': { tex: '\\theta', mathml: { tag: 'mi', value: '\u03B8' } },
    'Theta': { tex: '\\Theta', mathml: { tag: 'mo', value: '\u0398' } },
    'vartheta': { tex: '\\vartheta', mathml: { tag: 'mi', value: '\u03D1' } },
    'iota': { tex: '\\iota', mathml: { tag: 'mi', value: '\u03B9' } },
    'kappa': { tex: '\\kappa', mathml: { tag: 'mi', value: '\u03BA' } },
    'lambda': { tex: '\\lambda', mathml: { tag: 'mi', value: '\u03BB' } },
    'Lambda': { tex: '\\Lambda', mathml: { tag: 'mo', value: '\u039B' } },
    'mu': { tex: '\\mu', mathml: { tag: 'mi', value: '\u03BC' } },
    'nu': { tex: '\\nu', mathml: { tag: 'mi', value: '\u03BD' } },
    'xi': { tex: '\\xi', mathml: { tag: 'mi', value: '\u03BE' } },
    'Xi': { tex: '\\Xi', mathml: { tag: 'mo', value: '\u039E' } },
    'pi': { tex: '\\pi', mathml: { tag: 'mi', value: '\u03C0' } },
    'Pi': { tex: '\\Pi', mathml: { tag: 'mo', value: '\u03A0' } },
    'rho': { tex: '\\rho', mathml: { tag: 'mi', value: '\u03C1' } },
    'sigma': { tex: '\\sigma', mathml: { tag: 'mi', value: '\u03C3' } },
    'Sigma': { tex: '\\Sigma', mathml: { tag: 'mo', value: '\u03A3' } },
    'tau': { tex: '\\tau', mathml: { tag: 'mi', value: '\u03C4' } },
    'upsilon': { tex: '\\upsilon', mathml: { tag: 'mi', value: '\u03C5' } },
    'phi': { tex: '\\phi', mathml: { tag: 'mi', value: '\u03D5' } },
    'varphi': { tex: '\\varphi', mathml: { tag: 'mi', value: '\u03C6' } },
    'Phi': { tex: '\\Phi', mathml: { tag: 'mo', value: '\u03A6' } },
    'varPhi': { tex: '\\varPhi', mathml: { tag: 'mi', value: '\u03A6' } },
    'chi': { tex: '\\chi', mathml: { tag: 'mi', value: '\u03C7' } },
    'psi': { tex: '\\psi', mathml: { tag: 'mi', value: '\u03C8' } },
    'Psi': { tex: '\\Psi', mathml: { tag: 'mo', value: '\u03A8' } },
    'omega': { tex: '\\omega', mathml: { tag: 'mi', value: '\u03C9' } },
    'Omega': { tex: '\\Omega', mathml: { tag: 'mo', value: '\u03A9' } },

    // math symbols
    '+': { tex: '+', mathml: { tag: 'mo' } },
    '-': { tex: '-', mathml: { tag: 'mo' } },
    '***': { alias: 'star', tex: '\\star', mathml: { tag: 'mo', value: '\u22C6' } },
    '**': { alias: 'ast', tex: '\\ast', mathml: { tag: 'mo', value: '\u2217' } },
    '*': { alias: 'cdot', tex: '\\cdot', mathml: { tag: 'mo', value: '\u22C5' } },
    '//': { tex: '{/}', mathml: { tag: 'mo', value: '/' } },
    '\\\\': { tex: '\\backslash', mathml: { tag: 'mo', value: '\\' } },
    'setminus': { tex: '\\setminus', mathml: { tag: 'mo', value: '\\' } },
    'xx': { tex: '\\times', mathml: { tag: 'mo', value: '\u00D7' } },
    '|><': { tex: '\\ltimes', mathml: { tag: 'mo', value: '\u22C9' } },
    '><|': { tex: '\\rtimes', mathml: { tag: 'mo', value: '\u22CA' } },
    '|><|': { tex: '\\bowtie', mathml: { tag: 'mo', value: '\u22C8' } },
    '-:': { tex: '\\div', mathml: { tag: 'mo', value: '\u00F7' } },
    '@': { tex: '\\circ', mathml: { tag: 'mo', value: '\u2218' } },
    'o+': { tex: '\\oplus', mathml: { tag: 'mo', value: '\u2295' } },
    'ox': { tex: '\\otimes', mathml: { tag: 'mo', value: '\u2297' } },
    'o.': { tex: '\\odot', mathml: { tag: 'mo', value: '\u2299' } },
    'sum': { tex: '\\sum', mathml: { tag: 'mo', value: '\u2211' } },
    'prod': { tex: '\\prod', mathml: { tag: 'mo', value: '\u220F' } },
    '^^': { tex: '\\wedge', mathml: { tag: 'mo', value: '\u2227' } },
    '^^^': { tex: '\\bigwedge', mathml: { tag: 'mo', value: '\u22C0' } },
    'vv': { tex: '\\vee', mathml: { tag: 'mo', value: '\u2228' } },
    'vvv': { tex: '\\bigvee', mathml: { tag: 'mo', value: '\u22C1' } },
    'nn': { tex: '\\cap', mathml: { tag: 'mo', value: '\u2229' } },
    'nnn': { tex: '\\bigcap', mathml: { tag: 'mo', value: '\u22C2' } },
    'uu': { tex: '\\cup', mathml: { tag: 'mo', value: '\u222A' } },
    'uuu': { tex: '\\bigcup', mathml: { tag: 'mo', value: '\u22C3' } },

    // relation symbols
    '!=': { tex: '\\ne', mathml: { tag: 'mo', value: '\u2260' } },
    'lt': { tex: '<', mathml: { tag: 'mo', value: '<' } },
    '<=': { tex: '\\leqslant', mathml: { tag: 'mo', value: '\u2A7D' } },
    'le': { tex: '\\le', mathml: { tag: 'mo', value: '\u2264' } },
    'gt': { tex: '>', mathml: { tag: 'mo', value: '>' } },
    '>=': { tex: '\\geqslant', mathml: { tag: 'mo', value: '\u2A7E' } },
    'ge': { tex: '\\ge', mathml: { tag: 'mo', value: '\u2265' } },
    '-<': { tex: '\\prec', mathml: { tag: 'mo', value: '\u227A' } },
    '>-': { tex: '\\succ', mathml: { tag: 'mo', value: '\u227B' } },
    '-<=': { tex: '\\preceq', mathml: { tag: 'mo', value: '\u2AAF' } },
    '>-=': { tex: '\\succeq', mathml: { tag: 'mo', value: '\u2AB0' } },
    'in': { tex: '\\in', mathml: { tag: 'mo', value: '\u2208' } },
    '!in': { tex: '\\notin', mathml: { tag: 'mo', value: '\u2209' } },
    'subset': { alias: 'sub', tex: '\\subset', mathml: { tag: 'mo', value: '\u2282' } },
    'supset': { tex: '\\supset', mathml: { tag: 'mo', value: '\u2283' } },
    'sube': { tex: '\\subseteq', mathml: { tag: 'mo', value: '\u2286' } },
    'supe': { tex: '\\supseteq', mathml: { tag: 'mo', value: '\u2287' } },
    '-=': { tex: '\\equiv', mathml: { tag: 'mo', value: '\u2261' } },
    '~=': { tex: '\\cong', mathml: { tag: 'mo', value: '\u2245' } },
    '~': { tex: '\\sim', mathml: { tag: 'mo', value: '~' } },
    '~~': { tex: '\\approx', mathml: { tag: 'mo', value: '\u2248' } },
    '!||': { tex: '\u2226', mathml: { tag: 'mo', value: '\u2226' } },
    'S=': { tex: '\u224C', mathml: { tag: 'mo', value: '\u224C' } },
    'S~': { tex: '\u223D', mathml: { tag: 'mo', value: '\u223D' } },
    '!-=': { tex: '\\not\\equiv', mathml: { tag: 'mo', value: '\u2262' } },
    '!|': { tex: '\u2224', mathml: { tag: 'mo', value: '\u2224' } },
    '!sube': { tex: '\\not\\subseteq', mathml: { tag: 'mo', value: '\u2288' } },
    '!supe': { tex: '\\not\\supseteq', mathml: { tag: 'mo', value: '\u2289' } },
    'subne': { tex: '\\subsetneqq', mathml: { tag: 'mo', value: '\u228A' } },
    'supne': { tex: '\\supsetneqq', mathml: { tag: 'mo', value: '\u228B' } },
    'lhd': { tex: '\\lhd', mathml: { tag: 'mo', value: '\u22B2' } },
    'rhd': { tex: '\\rhd', mathml: { tag: 'mo', value: '\u22B3' } },
    'normal': { tex: '\\unlhd', mathml: { tag: 'mo', value: '\u22B4' } },
    'rnormal': { tex: '\\unrhd', mathml: { tag: 'mo', value: '\u22B5' } },

    // escapes
    '\\#': { tex: '\\#' },
    '\\&': { tex: '\\&' },
    '\\@': { tex: '@' },
    '\\%': { tex: '\\%' },
    '%': { tex: '\\%' },
    '\\_': { tex: '\\_' },
    '\\$': { tex: '\\$' },
    '$': { tex: '\\$' },
    '\\^': { tex: '\\^' },
    '\\`': { tex: '\\`' },

    // spaces
    '\\ ': { tex: '\\ ' },
    '\\,': { tex: '\\,' },
    '\\;': { tex: '\\;' },
    '\\:': { tex: '\\:' },
    '\\!': { tex: '\\!' },
    'enspace': { tex: '\\enspace' },
    'quad': { tex: '\\quad' },
    'qquad': { tex: '\\qquad' },

    // misc symbols
    'prop': { tex: '\\propto' },
    'comp': { tex: '\\complement' },
    'complement': { tex: '\\complement' },
    'not': { tex: '\\neg' },
    '=>': { tex: '\\implies' },
    '<=>': { tex: '\\iff' },
    'iff': { tex: '\\iff' },
    'AA': { tex: '\\forall' },
    'EE': { tex: '\\exists' },
    '_|_': { tex: '\\bot' },
    'TT': { tex: '\\top' },
    '|--': { tex: '\\vdash' },
    '|==': { tex: '\\models' },
    'int': { tex: '\\int' },
    'oint': { tex: '\\oint' },
    'iint': { tex: '\\iint' },
    'iiint': { tex: '\\iiint' },
    'oiint': { tex: '\u222F' },
    'oiiint': { tex: '\u2230' },
    'del': { tex: '\\partial' },
    'partial': { tex: '\\partial' },
    'grad': { tex: '\\nabla' },
    'nabla': { tex: '\\nabla' },
    '+-': { tex: '\\pm' },
    '-+': { tex: '\\mp' },
    'O/': { tex: '\\varnothing' },
    'oo': { tex: '\\infty' },
    'aleph': { tex: '\\aleph' },
    ':.': { tex: '\\therefore' },
    ':\'': { tex: '\\because' },
    '/_': { tex: '\\angle' },
    '...': { tex: '\\ldots' },
    'cdots': { tex: '\\cdots' },
    'vdots': { tex: '\\vdots' },
    'ddots': { tex: '\\ddots' },
    '/_\\': { tex: '\\triangle' },
    'triangle': { tex: '\\triangle' },
    'diamond': { tex: '\\diamond' },
    'square': { tex: '\\square' },
    'CC': { tex: '\\mathbb{C}' },
    'NN': { tex: '\\mathbb{N}' },
    'QQ': { tex: '\\mathbb{Q}' },
    'RR': { tex: '\\mathbb{R}' },
    'ZZ': { tex: '\\mathbb{Z}' },
    '\'': { tex: '^{\\prime}' },
    '\'\'': { tex: '^{\\prime\\prime}' },
    '\'\'\'': { tex: '^{\\prime\\prime\\prime}' },
    'laplace': { tex: '\\Delta' },
    'hline': { tex: '\\hline' },
    '--': { tex: '\\hline' },
    '#': { tex: '\\displaystyle' },
    'mid': { tex: '\\mid' },

    // math text
    'if': { tex: '\\text{if\\quad}' },
    'otherwise': { tex: '\\text{otherwise\\quad}' },
    'and': { tex: '\\text{ and }' },
    'or': { tex: '\\text{ or }' },

    // math functions
    'lim': { tex: '\\lim' },
    'sin': { tex: '\\sin' },
    'cos': { tex: '\\cos' },
    'tan': { tex: '\\tan' },
    'sinh': { tex: '\\sinh' },
    'cosh': { tex: '\\cosh' },
    'tanh': { tex: '\\tanh' },
    'cot': { tex: '\\cot' },
    'sec': { tex: '\\sec' },
    'csc': { tex: '\\csc' },
    'arcsin': { tex: '\\arcsin' },
    'arccos': { tex: '\\arccos' },
    'arctan': { tex: '\\arctan' },
    'coth': { tex: '\\coth' },
    'sech': { tex: '\\operatorname{sech}' },
    'csch': { tex: '\\operatorname{csch}' },
    'exp': { tex: '\\exp' },
    'log': { tex: '\\log' },
    'ln': { tex: '\\ln' },
    'det': { tex: '\\det' },
    'dim': { tex: '\\dim' },
    'gcd': { tex: '\\gcd' },
    'min': { tex: '\\min' },
    'max': { tex: '\\max' },
    'sup': { tex: '\\sup' }, // 上确界
    'inf': { tex: '\\inf' },
    'mod': { tex: '\\operatorname{mod}' },
    'lcm': { tex: '\\operatorname{lcm}' },
    'sgn': { tex: '\\operatorname{sgn}' },

    // arrows
    'uarr': { tex: '\\uparrow' },
    'uparrow': { tex: '\\uparrow' },
    'darr': { tex: '\\downarrow' },
    'downarrow': { tex: '\\downarrow' },
    'rarr': { tex: '\\rightarr' },
    'rightarrow': { tex: '\\rightarrow' },
    'to': { tex: '\\to' },
    '->': { tex: '\\to' },
    '>->': { tex: '\\rightarrowtail' },
    '->>': { tex: '\\twoheadrightarrow' },
    '>->>': { tex: '\u2916' },
    '|->': { tex: '\\mapsto' },
    '<-': { tex: '\\leftarrow' },
    'larr': { tex: '\\leftarrow' },
    'leftarrow': { tex: '\\leftarrow' },
    '<->': { tex: '\\leftrightarrow' },
    'harr': { tex: '\\leftrightarrow' },
    'rArr': { tex: '\\Rightarrow' },
    'lArr': { tex: '\\Leftarrow' },
    'hArr': { tex: '\\Leftrightarrow' },
    'curvArrLt': { tex: '\\curvearrowleft' },
    'curvArrRt': { tex: '\\curvearrowright' },
    'circArrLt': { tex: '\\circlearrowleft' },
    'circArrRt': { tex: '\\circlearrowright' },
  },
  opOA: {
    abs: { tex: '\\left|$1\\right|' },
    norm: { tex: '\\left\\|$1\\right\\|' },
    floor: { tex: '\\left\\lfloor{}$1\\right\\rfloor' },
    ceil: { tex: '\\left\\lceil{}$1\\right\\rceil' },
    sqrt: { tex: '\\sqrt{ $1 }' },
    hat: { tex: '\\hat{ $1 }' },
    widehat: { tex: '\\widehat{ $1 }' },
    Hat: { tex: '\\widehat{ $1 }' },
    tilde: { tex: '\\tilde{ $1 }' },
    widetilde: { tex: '\\widetilde{ $1 }' },
    Tilde: { tex: '\\widetilde{ $1 }' },
    ol: { tex: '\\overline{ $1 }' },
    overline: { tex: '\\overline{ $1 }' },
    arc: { tex: '\\stackrel{\\frown}{ $1 }' },
    bar: { tex: '\\bar{ $1 }' },
    vec: { tex: '\\vec{ $1 }' },
    Vec: { tex: '\\overrightarrow{ $1 }' },
    dot: { tex: '\\dot{ $1 }' },
    ddot: { tex: '\\ddot{ $1 }' },
    ul: { tex: '\\underline{ $1 }' },
    underline: { tex: '\\underline{ $1 }' },
    underbrace: { tex: '\\underbrace{ $1 }' },
    ubrace: { tex: '\\underbrace{ $1 }' },
    overbrace: { tex: '\\overbrace{ $1 }' },
    obrace: { tex: '\\overbrace{ $1 }' },
    phantom: { tex: '\\phantom{ $1 }' },
    mbox: { tex: '\\mbox{$1}' },
    op: { tex: '\\operatorname{ $1 }' },
    // TODO: \cancel is not supported by web mathjax, but supported by mathjax tex2svg?
    cancel: { tex: '\\cancel{ $1 }' },

    // literal string
    hspace: { tex: '\\hspace{$1}' },
    text: { tex: '\\text{$1}' },
    tex: { tex: '{ $1 }' },
    verb: { tex: '' }, // 这里 tex 没有实际意义, verb 需特殊处理

    // font style
    bb: { tex: '\\mathbf{ $1 }' },
    mathbf: { tex: '\\mathbf{ $1 }' },
    sf: { tex: '\\mathsf{ $1 }' },
    mathsf: { tex: '\\mathsf{ $1 }' },
    bbb: { tex: '\\mathbb{ $1 }' },
    mathbb: { tex: '\\mathbb{ $1 }' }, // katex mathbb 只对大写字母有效
    cc: { tex: '\\mathcal{ $1 }' },
    mathcal: { tex: '\\mathcal{ $1 }' }, // mathcal 只对大写字母有效
    tt: { tex: '\\mathtt{ $1 }' },
    mathtt: { tex: '\\mathtt{ $1 }' },
    fr: { tex: '\\mathfrak{ $1 }' },
    mathfrak: { tex: '\\mathfrak{ $1 }' },
    bm: { tex: '\\boldsymbol{ $1 }' },
    rm: { tex: '\\mathrm{ $1 }' },
    mathrm: { tex: '\\mathrm{ $1 }' },
    scr: { tex: '\\mathscr{ $1 }' },
    mathscr: { tex: '\\mathscr{ $1 }' },

    limits: { tex: '\\mathop{ $1 }\\limits' },

    // font size
    tiny: { tex: '{ \\tiny $1 }' },
    small: { tex: '{ \\small $1 }' },
    normalsize: { tex: '{ \\normalsize $1 }' },
    large: { tex: '{ \\large $1 }' },
    huge: { tex: '{ \\huge $1 }' },
  },
  opOAB: {
    root: { tex: '\\sqrt[ $1 ]{ $2 }' },
    frac: { tex: '\\frac{ $1 }{ $2 }' },
    stackrel: { tex: '\\stackrel{ $1 }{ $2 }' },
    overset: { tex: '\\overset{ $1 }{ $2 }' },
    underset: { tex: '\\under{ $1 }{ $2 }' },
    color: { tex: '{ \\color{$1} $2 }' }, // first param is literal string
  },
  lp: {
    '(': { tex: '(' },
    '[': { tex: '[' },
    '{': { tex: '\\lbrace{}' },
    '(:': { tex: '\\langle{}' },
    '{:': { tex: '.' },
    '|__': { tex: '\\lfloor{}' },
    '|~': { tex: '\\lceil{}' },
  },
  rp: {
    ')': { tex: ')' },
    ']': { tex: ']' },
    '}': { tex: '\\rbrace' },
    ':)': { tex: '\\rangle' },
    ':}': { tex: '.' },
    '__|': { tex: '\\rfloor' },
    '~|': { tex: '\\rceil' },
  },
  limits: {
    // TODO: \xlongequal is not supported by web mathjax, but supported by mathjax tex2svg?
    '==': { tex: '\\xlongequal[ $1 ]{ $2 }' },
    '-->': { tex: '\\xrightarrow[ $1 ]{ $2 }' },
  },
  sub: {
    '_+': { tex: '_{ +$1 }' },
    '_-': { tex: '_{ -$1 }' },
    '_': { tex: '_$1' },
  },
  sup: {
    '^+': { tex: '^{ +$1 }' },
    '^-': { tex: '^{ -$1 }' },
    '^': { tex: '^$1' },
  },
  align: {
    '&&': { tex: '&&' },
    '&': { tex: '&' },
  },
  part: {
    pp: { tex: '\\partial' },
    dd: { tex: '\\text{d}' },
  },
  opAO: {
    '!!': { tex: '{ $1!! }', strip: false }, // strip: false 时, op 的参数不会脱去括号
    '!': { tex: '{ $1! }', strip: false },
  },
  opAOB: {
    '/': { tex: '\\frac{ $1 }{ $2 }' },
    'over': { tex: '{ $1 \\over $2 }' },
    'atop': { tex: '{ $1 \\atop $2 }' },
    'choose': { tex: '{ $1 \\choose $2 }' },
  },
  pipe: {
    '|': { tex: '|' },
    '||': { tex: '\\|' },
  },
}

const initSymbols = (extSymbols: Symbols = {}): Required<Symbols> => {
  const res: Symbols = {}
  Object.keys(symbols).forEach((key) => {
    const config = {
      ...symbols[key as TokenTypes],
      ...extSymbols[key as TokenTypes],
    }
    Object.values(config).forEach((value) => {
      if (value.alias) {
        const alias = typeof value.alias === 'string' ? [value.alias] : value.alias
        alias.forEach((key) => {
          if (config[key])
            throw new Error(`Cannot create alias: key "${key}" already exists`)
          else
            config[key] = value
        })
      }
    })
    res[key as TokenTypes] = config
  })
  return res as Required<Symbols>
}

export default initSymbols
