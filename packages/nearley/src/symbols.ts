import type { IMathVdom } from './math-vdom'
import { MathVdom } from './math-vdom'

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

export interface SymbolConfig {
  tex: string
  mathml?: IMathVdom
  alias?: string | string[] // 别名
  limits?: boolean // 使用 underover 而不是 subsup
  strip?: boolean // strip: false 时, op 的参数不会脱去括号
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

const { before, after, brace, binary } = MathVdom

const symbols: Required<Symbols> = {
  keyword: {
    // greek letters
    'alpha': { tex: '\\alpha', mathml: { tag: 'mi', children: '\u03B1' } },
    'beta': { tex: '\\beta', mathml: { tag: 'mi', children: '\u03B2' } },
    'gamma': { tex: '\\gamma', mathml: { tag: 'mi', children: '\u03B3' } },
    'Gamma': { tex: '\\Gamma', mathml: { tag: 'mo', children: '\u0393' } },
    'delta': { tex: '\\delta', mathml: { tag: 'mi', children: '\u03B4' } },
    'Delta': { alias: 'laplace', tex: '\\Delta', mathml: { tag: 'mo', children: '\u0394' } },
    'epsilon': { tex: '\\epsilon', mathml: { tag: 'mi', children: '\u03F5' } },
    'epsi': { alias: 'varepsilon', tex: '\\varepsilon', mathml: { tag: 'mi', children: '\u03B5' } },
    'zeta': { tex: '\\zeta', mathml: { tag: 'mi', children: '\u03B6' } },
    'eta': { tex: '\\eta', mathml: { tag: 'mi', children: '\u03B7' } },
    'theta': { tex: '\\theta', mathml: { tag: 'mi', children: '\u03B8' } },
    'Theta': { tex: '\\Theta', mathml: { tag: 'mo', children: '\u0398' } },
    'vartheta': { tex: '\\vartheta', mathml: { tag: 'mi', children: '\u03D1' } },
    'iota': { tex: '\\iota', mathml: { tag: 'mi', children: '\u03B9' } },
    'kappa': { tex: '\\kappa', mathml: { tag: 'mi', children: '\u03BA' } },
    'lambda': { tex: '\\lambda', mathml: { tag: 'mi', children: '\u03BB' } },
    'Lambda': { tex: '\\Lambda', mathml: { tag: 'mo', children: '\u039B' } },
    'mu': { tex: '\\mu', mathml: { tag: 'mi', children: '\u03BC' } },
    'nu': { tex: '\\nu', mathml: { tag: 'mi', children: '\u03BD' } },
    'xi': { tex: '\\xi', mathml: { tag: 'mi', children: '\u03BE' } },
    'Xi': { tex: '\\Xi', mathml: { tag: 'mo', children: '\u039E' } },
    'pi': { tex: '\\pi', mathml: { tag: 'mi', children: '\u03C0' } },
    'Pi': { tex: '\\Pi', mathml: { tag: 'mo', children: '\u03A0' } },
    'rho': { tex: '\\rho', mathml: { tag: 'mi', children: '\u03C1' } },
    'sigma': { tex: '\\sigma', mathml: { tag: 'mi', children: '\u03C3' } },
    'Sigma': { tex: '\\Sigma', mathml: { tag: 'mo', children: '\u03A3' } },
    'tau': { tex: '\\tau', mathml: { tag: 'mi', children: '\u03C4' } },
    'upsilon': { tex: '\\upsilon', mathml: { tag: 'mi', children: '\u03C5' } },
    'phi': { tex: '\\phi', mathml: { tag: 'mi', children: '\u03D5' } },
    'varphi': { tex: '\\varphi', mathml: { tag: 'mi', children: '\u03C6' } },
    'Phi': { tex: '\\Phi', mathml: { tag: 'mo', children: '\u03A6' } },
    'varPhi': { tex: '\\varPhi', mathml: { tag: 'mi', children: '\u03A6' } },
    'chi': { tex: '\\chi', mathml: { tag: 'mi', children: '\u03C7' } },
    'psi': { tex: '\\psi', mathml: { tag: 'mi', children: '\u03C8' } },
    'Psi': { tex: '\\Psi', mathml: { tag: 'mo', children: '\u03A8' } },
    'omega': { tex: '\\omega', mathml: { tag: 'mi', children: '\u03C9' } },
    'Omega': { tex: '\\Omega', mathml: { tag: 'mo', children: '\u03A9' } },

    // math symbols
    '+': { tex: '+', mathml: { tag: 'mo' } },
    '-': { tex: '-', mathml: { tag: 'mo' } },
    '***': { alias: 'star', tex: '\\star', mathml: { tag: 'mo', children: '\u22C6' } },
    '**': { alias: 'ast', tex: '\\ast', mathml: { tag: 'mo', children: '\u2217' } },
    '*': { alias: 'cdot', tex: '\\cdot', mathml: { tag: 'mo', children: '\u22C5' } },
    '//': { tex: '{/}', mathml: { tag: 'mo', children: '/' } },
    '\\\\': { tex: '\\backslash', mathml: { tag: 'mo', children: '\\' } },
    'setminus': { tex: '\\setminus', mathml: { tag: 'mo', children: '\\' } },
    'xx': { tex: '\\times', mathml: { tag: 'mo', children: '\u00D7' } },
    '|><': { tex: '\\ltimes', mathml: { tag: 'mo', children: '\u22C9' } },
    '><|': { tex: '\\rtimes', mathml: { tag: 'mo', children: '\u22CA' } },
    '|><|': { tex: '\\bowtie', mathml: { tag: 'mo', children: '\u22C8' } },
    '-:': { tex: '\\div', mathml: { tag: 'mo', children: '\u00F7' } },
    '@': { tex: '\\circ', mathml: { tag: 'mo', children: '\u2218' } },
    'o+': { tex: '\\oplus', mathml: { tag: 'mo', children: '\u2295' } },
    'ox': { tex: '\\otimes', mathml: { tag: 'mo', children: '\u2297' } },
    'o.': { tex: '\\odot', mathml: { tag: 'mo', children: '\u2299' } },
    'sum': { limits: true, tex: '\\sum', mathml: { tag: 'mo', children: '\u2211' } },
    'prod': { limits: true, tex: '\\prod', mathml: { tag: 'mo', children: '\u220F' } },
    '^^': { tex: '\\wedge', mathml: { tag: 'mo', children: '\u2227' } },
    '^^^': { limits: true, tex: '\\bigwedge', mathml: { tag: 'mo', children: '\u22C0' } },
    'vv': { tex: '\\vee', mathml: { tag: 'mo', children: '\u2228' } },
    'vvv': { limits: true, tex: '\\bigvee', mathml: { tag: 'mo', children: '\u22C1' } },
    'nn': { tex: '\\cap', mathml: { tag: 'mo', children: '\u2229' } },
    'nnn': { limits: true, tex: '\\bigcap', mathml: { tag: 'mo', children: '\u22C2' } },
    'uu': { tex: '\\cup', mathml: { tag: 'mo', children: '\u222A' } },
    'uuu': { limits: true, tex: '\\bigcup', mathml: { tag: 'mo', children: '\u22C3' } },

    // relation symbols
    '!=': { tex: '\\ne', mathml: { tag: 'mo', children: '\u2260' } },
    'lt': { tex: '<', mathml: { tag: 'mo', children: '&lt;' } },
    '<=': { tex: '\\leqslant', mathml: { tag: 'mo', children: '\u2A7D' } },
    'le': { tex: '\\le', mathml: { tag: 'mo', children: '\u2264' } },
    'gt': { tex: '>', mathml: { tag: 'mo', children: '&gt;' } },
    '>=': { tex: '\\geqslant', mathml: { tag: 'mo', children: '\u2A7E' } },
    'ge': { tex: '\\ge', mathml: { tag: 'mo', children: '\u2265' } },
    '-<': { tex: '\\prec', mathml: { tag: 'mo', children: '\u227A' } },
    '>-': { tex: '\\succ', mathml: { tag: 'mo', children: '\u227B' } },
    '-<=': { tex: '\\preceq', mathml: { tag: 'mo', children: '\u2AAF' } },
    '>-=': { tex: '\\succeq', mathml: { tag: 'mo', children: '\u2AB0' } },
    'in': { tex: '\\in', mathml: { tag: 'mo', children: '\u2208' } },
    '!in': { tex: '\\notin', mathml: { tag: 'mo', children: '\u2209' } },
    'subset': { alias: 'sub', tex: '\\subset', mathml: { tag: 'mo', children: '\u2282' } },
    'supset': { tex: '\\supset', mathml: { tag: 'mo', children: '\u2283' } },
    'sube': { tex: '\\subseteq', mathml: { tag: 'mo', children: '\u2286' } },
    'supe': { tex: '\\supseteq', mathml: { tag: 'mo', children: '\u2287' } },
    '-=': { tex: '\\equiv', mathml: { tag: 'mo', children: '\u2261' } },
    '~=': { tex: '\\cong', mathml: { tag: 'mo', children: '\u2245' } },
    '~': { tex: '\\sim', mathml: { tag: 'mo' } },
    '~~': { tex: '\\approx', mathml: { tag: 'mo', children: '\u2248' } },
    '!||': { tex: '\u2226', mathml: { tag: 'mo', children: '\u2226' } },
    'S=': { tex: '\u224C', mathml: { tag: 'mo', children: '\u224C' } },
    'S~': { tex: '\u223D', mathml: { tag: 'mo', children: '\u223D' } },
    '!-=': { tex: '\\not\\equiv', mathml: { tag: 'mo', children: '\u2262' } },
    '!|': { tex: '\u2224', mathml: { tag: 'mo', children: '\u2224' } },
    '!sube': { tex: '\\not\\subseteq', mathml: { tag: 'mo', children: '\u2288' } },
    '!supe': { tex: '\\not\\supseteq', mathml: { tag: 'mo', children: '\u2289' } },
    'subne': { tex: '\\subsetneqq', mathml: { tag: 'mo', children: '\u228A' } },
    'supne': { tex: '\\supsetneqq', mathml: { tag: 'mo', children: '\u228B' } },
    'lhd': { tex: '\\lhd', mathml: { tag: 'mo', children: '\u22B2' } },
    'rhd': { tex: '\\rhd', mathml: { tag: 'mo', children: '\u22B3' } },
    'normal': { tex: '\\unlhd', mathml: { tag: 'mo', children: '\u22B4' } },
    'rnormal': { tex: '\\unrhd', mathml: { tag: 'mo', children: '\u22B5' } },

    // escapes
    '\\#': { tex: '\\#', mathml: { tag: 'mtext', children: '#' } },
    '\\&': { tex: '\\&', mathml: { tag: 'mtext', children: '&amp;' } },
    '\\@': { tex: '@', mathml: { tag: 'mtext', children: '@' } },
    '\\%': { alias: '%', tex: '\\%', mathml: { tag: 'mtext', children: '%' } },
    '\\_': { tex: '\\_', mathml: { tag: 'mtext', children: '_' } },
    '\\$': { alias: '$', tex: '\\$', mathml: { tag: 'mtext', children: '$' } },
    '\\^': { tex: '\\^', mathml: { tag: 'mtext', children: '^' } },
    '\\`': { tex: '\\`', mathml: { tag: 'mtext', children: '`' } },

    // spaces
    '\\ ': { tex: '\\ ', mathml: { tag: 'mspace', attr: { width: '1ex' } } },
    '\\,': { tex: '\\,', mathml: { tag: 'mspace', attr: { width: '0.17em' } } },
    '\\;': { tex: '\\;', mathml: { tag: 'mspace', attr: { width: '0.28em' } } },
    '\\:': { tex: '\\:', mathml: { tag: 'mspace', attr: { width: '0.22em' } } },
    '\\!': { tex: '\\!', mathml: { tag: 'mspace', attr: { width: '-0.17em' } } },
    'enspace': { tex: '\\enspace', mathml: { tag: 'mspace', attr: { width: '0.5em' } } },
    'quad': { tex: '\\quad', mathml: { tag: 'mspace', attr: { width: '1em' } } },
    'qquad': { tex: '\\qquad', mathml: { tag: 'mspace', attr: { width: '2em' } } },

    // misc symbols
    'prop': { tex: '\\propto', mathml: { tag: 'mo', children: '\u221D' } },
    'comp': { alias: 'complement', tex: '\\complement', mathml: { tag: 'mo', children: '\u2201' } },
    'not': { tex: '\\neg', mathml: { tag: 'mo', children: '\u00AC' } },
    '=>': { tex: '\\implies', mathml: { tag: 'mo', children: '\u21D2' } },
    '<=>': { alias: 'iff', tex: '\\iff', mathml: { tag: 'mo', children: '\u21D4' } },
    'AA': { tex: '\\forall', mathml: { tag: 'mo', children: '\u2200' } },
    'EE': { tex: '\\exists', mathml: { tag: 'mo', children: '\u2203' } },
    '_|_': { tex: '\\bot', mathml: { tag: 'mo', children: '\u22A5' } },
    'TT': { tex: '\\top', mathml: { tag: 'mo', children: '\u22A4' } },
    '|--': { tex: '\\vdash', mathml: { tag: 'mo', children: '\u22A2' } },
    '|==': { tex: '\\models', mathml: { tag: 'mo', children: '\u22A8' } },
    'int': { tex: '\\int', mathml: { tag: 'mo', children: '\u222B' } },
    'oint': { tex: '\\oint', mathml: { tag: 'mo', children: '\u222E' } },
    'iint': { tex: '\\iint', mathml: { tag: 'mo', children: '\u222C' } },
    'iiint': { tex: '\\iiint', mathml: { tag: 'mo', children: '\u222D' } },
    'oiint': { tex: '\u222F', mathml: { tag: 'mo', children: '\u222F' } },
    'oiiint': { tex: '\u2230', mathml: { tag: 'mo', children: '\u2230' } },
    'del': { alias: 'partial', tex: '\\partial', mathml: { tag: 'mo', children: '\u2202' } },
    'grad': { alias: 'nabla', tex: '\\nabla', mathml: { tag: 'mo', children: '\u2207' } },
    '+-': { tex: '\\pm', mathml: { tag: 'mo', children: '\u00B1' } },
    '-+': { tex: '\\mp', mathml: { tag: 'mo', children: '\u2213' } },
    'O/': { tex: '\\varnothing', mathml: { tag: 'mo', children: '\u2205' } },
    'oo': { tex: '\\infty', mathml: { tag: 'mo', children: '\u221E' } },
    'aleph': { tex: '\\aleph', mathml: { tag: 'mo', children: '\u2135' } },
    ':.': { tex: '\\therefore', mathml: { tag: 'mo', children: '\u2234' } },
    ':\'': { tex: '\\because', mathml: { tag: 'mo', children: '\u2235' } },
    '/_': { tex: '\\angle', mathml: { tag: 'mo', children: '\u2220' } },
    '...': { tex: '\\ldots', mathml: { tag: 'mo', children: '...' } },
    'cdots': { tex: '\\cdots', mathml: { tag: 'mo', children: '\u22EF' } },
    'vdots': { tex: '\\vdots', mathml: { tag: 'mo', children: '\u22EE' } },
    'ddots': { tex: '\\ddots', mathml: { tag: 'mo', children: '\u22F1' } },
    '/_\\': { alias: 'triangle', tex: '\\triangle', mathml: { tag: 'mo', children: '\u25B3' } },
    'diamond': { tex: '\\diamond', mathml: { tag: 'mo', children: '\u22C4' } },
    'square': { tex: '\\square', mathml: { tag: 'mo', children: '\u25A1' } },
    'CC': { tex: '\\mathbb{C}', mathml: { tag: 'mo', children: '\u2102' } },
    'NN': { tex: '\\mathbb{N}', mathml: { tag: 'mo', children: '\u2115' } },
    'QQ': { tex: '\\mathbb{Q}', mathml: { tag: 'mo', children: '\u211A' } },
    'RR': { tex: '\\mathbb{R}', mathml: { tag: 'mo', children: '\u211D' } },
    'ZZ': { tex: '\\mathbb{Z}', mathml: { tag: 'mo', children: '\u2124' } },
    '\'': { tex: '^{\\prime}', mathml: { tag: 'mo', children: '\u2032' } },
    '\'\'': { tex: '^{\\prime\\prime}', mathml: { tag: 'mo', children: '\u2033' } },
    '\'\'\'': { tex: '^{\\prime\\prime\\prime}', mathml: { tag: 'mo', children: '\u2034' } },
    'mid': { tex: '\\mid', mathml: { tag: 'mo', children: '\u2223' } },

    // misc tex command
    '--': { alias: 'hline', tex: '\\hline' },
    '#': { tex: '\\displaystyle' },

    // math text
    'if': { tex: '\\text{if\\quad}', mathml: { tag: 'mtext', children: 'if ' } },
    'otherwise': { tex: '\\text{otherwise\\quad}', mathml: { tag: 'mtext', children: 'otherwise ' } },
    'and': { tex: '\\text{ and }', mathml: { tag: 'mtext', children: ' and ' } },
    'or': { tex: '\\text{ or }', mathml: { tag: 'mtext', children: ' or ' } },

    // math functions
    'lim': { limits: true, tex: '\\lim', mathml: { tag: 'mo' } },
    'sin': { tex: '\\sin', mathml: { tag: 'mo' } },
    'cos': { tex: '\\cos', mathml: { tag: 'mo' } },
    'tan': { tex: '\\tan', mathml: { tag: 'mo' } },
    'sinh': { tex: '\\sinh', mathml: { tag: 'mo' } },
    'cosh': { tex: '\\cosh', mathml: { tag: 'mo' } },
    'tanh': { tex: '\\tanh', mathml: { tag: 'mo' } },
    'cot': { tex: '\\cot', mathml: { tag: 'mo' } },
    'sec': { tex: '\\sec', mathml: { tag: 'mo' } },
    'csc': { tex: '\\csc', mathml: { tag: 'mo' } },
    'arcsin': { tex: '\\arcsin', mathml: { tag: 'mo' } },
    'arccos': { tex: '\\arccos', mathml: { tag: 'mo' } },
    'arctan': { tex: '\\arctan', mathml: { tag: 'mo' } },
    'coth': { tex: '\\coth', mathml: { tag: 'mo' } },
    'sech': { tex: '\\operatorname{sech}', mathml: { tag: 'mo' } },
    'csch': { tex: '\\operatorname{csch}', mathml: { tag: 'mo' } },
    'exp': { tex: '\\exp', mathml: { tag: 'mo' } },
    'log': { tex: '\\log', mathml: { tag: 'mo' } },
    'ln': { tex: '\\ln', mathml: { tag: 'mo' } },
    'det': { tex: '\\det', mathml: { tag: 'mo' } },
    'dim': { tex: '\\dim', mathml: { tag: 'mo' } },
    'gcd': { tex: '\\gcd', mathml: { tag: 'mo' } },
    'min': { limits: true, tex: '\\min', mathml: { tag: 'mo' } },
    'max': { limits: true, tex: '\\max', mathml: { tag: 'mo' } },
    'sup': { limits: true, tex: '\\sup', mathml: { tag: 'mo' } }, // 上确界
    'inf': { limits: true, tex: '\\inf', mathml: { tag: 'mo' } },
    'mod': { tex: '\\operatorname{mod}', mathml: { tag: 'mo' } },
    'lcm': { tex: '\\operatorname{lcm}', mathml: { tag: 'mo' } },
    'sgn': { tex: '\\operatorname{sgn}', mathml: { tag: 'mo' } },

    // arrows
    'uarr': { alias: 'uparrow', tex: '\\uparrow', mathml: { tag: 'mo', children: '\u2191' } },
    'darr': { alias: 'downarrow', tex: '\\downarrow', mathml: { tag: 'mo', children: '\u2193' } },
    'rarr': { alias: 'rightarrow', tex: '\\rightarr', mathml: { tag: 'mo', children: '\u2192' } },
    '->': { alias: 'to', tex: '\\to', mathml: { tag: 'mo', children: '\u2192' } },
    '>->': { tex: '\\rightarrowtail', mathml: { tag: 'mo', children: '\u21A3' } },
    '->>': { tex: '\\twoheadrightarrow', mathml: { tag: 'mo', children: '\u21A0' } },
    '>->>': { tex: '\u2916', mathml: { tag: 'mo', children: '\u2916' } },
    '|->': { tex: '\\mapsto', mathml: { tag: 'mo', children: '\u21A6' } },
    '<-': { alias: ['leftarrow', 'larr'], tex: '\\leftarrow', mathml: { tag: 'mo', children: '\u2190' } },
    '<->': { alias: 'harr', tex: '\\leftrightarrow', mathml: { tag: 'mo', children: '\u2194' } },
    'rArr': { tex: '\\Rightarrow', mathml: { tag: 'mo', children: '\u21D2' } },
    'lArr': { tex: '\\Leftarrow', mathml: { tag: 'mo', children: '\u21D0' } },
    'hArr': { tex: '\\Leftrightarrow', mathml: { tag: 'mo', children: '\u21D4' } },
    'curvArrLt': { tex: '\\curvearrowleft', mathml: { tag: 'mo', children: '\u21B6' } },
    'curvArrRt': { tex: '\\curvearrowright', mathml: { tag: 'mo', children: '\u21B7' } },
    'circArrLt': { tex: '\\circlearrowleft', mathml: { tag: 'mo', children: '\u21BA' } },
    'circArrRt': { tex: '\\circlearrowright', mathml: { tag: 'mo', children: '\u21BB' } },
  },
  opOA: {
    abs: { tex: '\\left|$1\\right|', mathml: brace('|', '|') },
    norm: { tex: '\\left\\|$1\\right\\|', mathml: brace('\u2225', '\u2225') },
    floor: { tex: '\\left\\lfloor{}$1\\right\\rfloor', mathml: brace('\u230A', '\u230B') },
    ceil: { tex: '\\left\\lceil{}$1\\right\\rceil', mathml: brace('\u2308', '\u2309') },
    sqrt: { tex: '\\sqrt{ $1 }', mathml: { tag: 'msqrt' } },
    hat: { tex: '\\hat{ $1 }', mathml: after('^', 'mover') },
    Hat: { alias: 'widehat', tex: '\\widehat{ $1 }', mathml: after('^', 'mover') },
    tilde: { tex: '\\tilde{ $1 }', mathml: after('~', 'mover') },
    Tilde: { alias: 'widetilde', tex: '\\widetilde{ $1 }', mathml: after('~', 'mover') },
    ol: { alias: 'overline', tex: '\\overline{ $1 }', mathml: after('\u00AF', 'mover') },
    arc: { tex: '\\stackrel{\\frown}{ $1 }', mathml: after('\u23DC', 'mover') },
    bar: { tex: '\\bar{ $1 }', mathml: after('\u00AF', 'mover') },
    vec: { tex: '\\vec{ $1 }', mathml: after('\u2192', 'mover') },
    Vec: { tex: '\\overrightarrow{ $1 }', mathml: after('\u2192', 'mover') },
    dot: { tex: '\\dot{ $1 }', mathml: after('.', 'mover') },
    ddot: { tex: '\\ddot{ $1 }', mathml: after('..', 'mover') },
    ul: { alias: 'underline', tex: '\\underline{ $1 }', mathml: after('\u0332', 'munder') },
    ubrace: { limits: true, alias: 'underbrace', tex: '\\underbrace{ $1 }', mathml: after('\u23DF', 'munder') },
    obrace: { limits: true, alias: 'overbrace', tex: '\\overbrace{ $1 }', mathml: after('\u23DE', 'mover') },
    phantom: { tex: '\\phantom{ $1 }', mathml: { tag: 'mphantom' } },
    boxed: { tex: '\\boxed{$1}', mathml: { tag: 'menclose', attr: { notation: 'box' } } },
    op: { tex: '\\operatorname{ $1 }', mathml: { tag: 'mo' } },
    // TODO: \cancel is not supported by web mathjax, but supported by mathjax tex2svg?
    cancel: { tex: '\\cancel{ $1 }', mathml: { tag: 'menclose', attr: { notation: 'updiagonalstrike' } } },

    // literal string
    hspace: { tex: '\\hspace{$1}', mathml: { tag: 'mspace', attr: { width: '$1' }, children: '' } },
    text: { tex: '\\text{$1}', mathml: { tag: 'mtext' } },
    tex: { tex: '{ $1 }', mathml: { tag: 'mtext' } },
    verb: { tex: '', mathml: { tag: 'mtext' } }, // 这里 tex 没有实际意义, verb 需特殊处理

    // font style
    bb: { alias: 'mathbf', tex: '\\mathbf{ $1 }', mathml: { tag: 'mstyle', attr: { mathvariant: 'bold' } } },
    sf: { alias: 'mathsf', tex: '\\mathsf{ $1 }', mathml: { tag: 'mstyle', attr: { mathvariant: 'sans-serif' } } },
    bbb: { alias: 'mathbb', tex: '\\mathbb{ $1 }', mathml: { tag: 'mstyle', attr: { mathvariant: 'double-struck' } } }, // katex mathbb 只对大写字母有效
    cc: { alias: 'mathcal', tex: '\\mathcal{ $1 }', mathml: { tag: 'mstyle', attr: { mathvariant: 'script' } } }, // mathcal 只对大写字母有效
    tt: { alias: 'mathtt', tex: '\\mathtt{ $1 }', mathml: { tag: 'mstyle', attr: { mathvariant: 'monospace' } } },
    fr: { alias: 'mathfrak', tex: '\\mathfrak{ $1 }', mathml: { tag: 'mstyle', attr: { mathvariant: 'fraktur' } } },
    bm: { tex: '\\boldsymbol{ $1 }', mathml: { tag: 'mstyle', attr: { mathvariant: 'bold-italic' } } },
    rm: { alias: 'mathrm', tex: '\\mathrm{ $1 }', mathml: { tag: 'mstyle', attr: { mathvariant: 'serif' } } },
    scr: { alias: 'mathscr', tex: '\\mathscr{ $1 }', mathml: { tag: 'mstyle', attr: { mathvariant: 'script' } } }, // mathml cannot tell difference between cc and scr

    limits: { tex: '\\mathop{ $1 }\\limits' },

    // font size
    tiny: { tex: '{ \\tiny $1 }' },
    small: { tex: '{ \\small $1 }' },
    normalsize: { tex: '{ \\normalsize $1 }' },
    large: { tex: '{ \\large $1 }' },
    huge: { tex: '{ \\huge $1 }' },
  },
  opOAB: {
    root: { tex: '\\sqrt[ $1 ]{ $2 }', mathml: binary('$2', '$1', 'mroot') },
    frac: { tex: '\\frac{ $1 }{ $2 }', mathml: binary('$1', '$2', 'mfrac') },
    stackrel: { tex: '\\stackrel{ $1 }{ $2 }', mathml: binary('$2', '$1', 'mover') },
    overset: { tex: '\\overset{ $1 }{ $2 }', mathml: binary('$2', '$1', 'mover') },
    underset: { tex: '\\under{ $1 }{ $2 }', mathml: binary('$2', '$1', 'munder') },
    color: { tex: '{ \\color{$1} $2 }', mathml: { tag: 'mstyle', attr: { mathcolor: '$1' }, children: [{ tag: '$2' }] } }, // first param is literal string
  },
  lp: {
    '(': { tex: '(', mathml: { tag: 'mo' } },
    '[': { tex: '[', mathml: { tag: 'mo' } },
    '{': { tex: '\\lbrace{}', mathml: { tag: 'mo' } },
    '(:': { tex: '\\langle{}', mathml: { tag: 'mo', children: '\u2329' } },
    '{:': { tex: '.', mathml: { tag: 'mo', children: '' } },
    '|__': { tex: '\\lfloor{}', mathml: { tag: 'mo', children: '\u230A' } },
    '|~': { tex: '\\lceil{}', mathml: { tag: 'mo', children: '\u2308' } },
  },
  rp: {
    ')': { tex: ')', mathml: { tag: 'mo' } },
    ']': { tex: ']', mathml: { tag: 'mo' } },
    '}': { tex: '\\rbrace', mathml: { tag: 'mo' } },
    ':)': { tex: '\\rangle', mathml: { tag: 'mo', children: '\u232A' } },
    ':}': { tex: '.', mathml: { tag: 'mo', children: '' } },
    '__|': { tex: '\\rfloor', mathml: { tag: 'mo', children: '\u230B' } },
    '~|': { tex: '\\rceil', mathml: { tag: 'mo', children: '\u2309' } },
  },
  pipe: {
    '|': { tex: '|', mathml: { tag: 'mo', children: '|' } },
    '||': { tex: '\\|', mathml: { tag: 'mo', children: '\u2225' } },
  },
  limits: {
    // TODO: \xlongequal is not supported by web mathjax, but supported by mathjax tex2svg?
    '==': { tex: '\\xlongequal[ $1 ]{ $2 }', mathml: { tag: 'mo', children: '\u2550\u2550' } },
    '-->': { tex: '\\xrightarrow[ $1 ]{ $2 }', mathml: { tag: 'mo', children: '\u2192' } },
  },
  sub: {
    '_+': { tex: '_{ +$1 }', mathml: before('+') },
    '_-': { tex: '_{ -$1 }', mathml: before('-') },
    '_': { tex: '_$1' },
  },
  sup: {
    '^+': { tex: '^{ +$1 }', mathml: before('+') },
    '^-': { tex: '^{ -$1 }', mathml: before('-') },
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
    '!!': { tex: '{ $1!! }', strip: false, mathml: after('!!') }, // strip: false 时, op 的参数不会脱去括号
    '!': { tex: '{ $1! }', strip: false, mathml: after('!') },
  },
  opAOB: {
    '/': { tex: '\\frac{ $1 }{ $2 }', mathml: binary('$1', '$2', 'mfrac') },
    'over': { tex: '{ $1 \\over $2 }', mathml: binary('$1', '$2', 'mfrac') },
    'atop': { tex: '{ $1 \\atop $2 }' },
    'choose': { tex: '{ $1 \\choose $2 }' },
  },
}

const initSymbols = (extSymbols: Symbols = {}): Required<Symbols> => {
  const res: Symbols = {}
  Object.keys(symbols).forEach((key) => {
    const symbol = {
      ...symbols[key as TokenTypes],
      ...extSymbols[key as TokenTypes],
    }
    Object.values(symbol).forEach((value) => {
      if (value.alias) {
        const alias = typeof value.alias === 'string' ? [value.alias] : value.alias
        alias.forEach((key) => {
          if (symbol[key])
            throw new Error(`Cannot create alias: key "${key}" already exists`)
          else
            symbol[key] = value
        })
      }
    })
    res[key as TokenTypes] = symbol
  })
  return res as Required<Symbols>
}

export default initSymbols
