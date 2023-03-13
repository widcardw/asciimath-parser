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

interface SymbolConfig {
  tex: string
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
    'alpha': { tex: '\\alpha' },
    'beta': { tex: '\\beta' },
    'gamma': { tex: '\\gamma' },
    'Gamma': { tex: '\\Gamma' },
    'delta': { tex: '\\delta' },
    'Delta': { tex: '\\Delta' },
    'epsi': { tex: '\\varepsilon' },
    'epsilon': { tex: '\\epsilon' },
    'varepsilon': { tex: '\\varepsilon' },
    'zeta': { tex: '\\zeta' },
    'eta': { tex: '\\eta' },
    'theta': { tex: '\\theta' },
    'Theta': { tex: '\\Theta' },
    'vartheta': { tex: '\\vartheta' },
    'iota': { tex: '\\iota' },
    'kappa': { tex: '\\kappa' },
    'lambda': { tex: '\\lambda' },
    'Lambda': { tex: '\\Lambda' },
    'mu': { tex: '\\mu' },
    'nu': { tex: '\\nu' },
    'xi': { tex: '\\xi' },
    'Xi': { tex: '\\Xi' },
    'pi': { tex: '\\pi' },
    'Pi': { tex: '\\Pi' },
    'rho': { tex: '\\rho' },
    'sigma': { tex: '\\sigma' },
    'Sigma': { tex: '\\Sigma' },
    'tau': { tex: '\\tau' },
    'upsilon': { tex: '\\upsilon' },
    'phi': { tex: '\\phi' },
    'varphi': { tex: '\\varphi' },
    'Phi': { tex: '\\Phi' },
    'varPhi': { tex: '\\varPhi' },
    'chi': { tex: '\\chi' },
    'psi': { tex: '\\psi' },
    'Psi': { tex: '\\Psi' },
    'omega': { tex: '\\omega' },
    'Omega': { tex: '\\Omega' },

    // math symbols
    '+': { tex: '+' },
    '-': { tex: '-' },
    '***': { tex: '\\star' },
    'star': { tex: '\\star' },
    '**': { tex: '\\ast' },
    'ast': { tex: '\\ast' },
    '*': { tex: '\\cdot' },
    'cdot': { tex: '\\cdot' },
    '//': { tex: '{/}' },
    '\\\\': { tex: '\\backslash' },
    'setminus': { tex: '\\setminus' },
    'xx': { tex: '\\times' },
    '|><': { tex: '\\ltimes' },
    '><|': { tex: '\\rtimes' },
    '|><|': { tex: '\\bowtie' },
    '-:': { tex: '\\div' },
    '@': { tex: '\\circ' },
    'o+': { tex: '\\oplus' },
    'ox': { tex: '\\otimes' },
    'o.': { tex: '\\odot' },
    'sum': { tex: '\\sum' },
    'prod': { tex: '\\prod' },
    '^^': { tex: '\\wedge' },
    '^^^': { tex: '\\bigwedge' },
    'vv': { tex: '\\vee' },
    'vvv': { tex: '\\bigvee' },
    'nn': { tex: '\\cap' },
    'nnn': { tex: '\\bigcap' },
    'uu': { tex: '\\cup' },
    'uuu': { tex: '\\bigcup' },

    // relation symbols
    '!=': { tex: '\\ne' },
    'lt': { tex: '<' },
    '<=': { tex: '\\leqslant' },
    'le': { tex: '\\le' },
    'gt': { tex: '>' },
    '>=': { tex: '\\geqslant' },
    'ge': { tex: '\\ge' },
    '-<': { tex: '\\prec' },
    '>-': { tex: '\\succ' },
    '-<=': { tex: '\\preceq' },
    '>-=': { tex: '\\succeq' },
    'in': { tex: '\\in' },
    '!in': { tex: '\\notin' },
    'sub': { tex: '\\sub' },
    'supset': { tex: '\\supset' }, // ⊃
    'sube': { tex: '\\sube' },
    'supe': { tex: '\\supe' },
    '-=': { tex: '\\equiv' },
    '~=': { tex: '\\cong' },
    '~': { tex: '\\sim' },
    '~~': { tex: '\\approx' },
    '!||': { tex: '\u2226' },
    'S=': { tex: '\u224C' },
    'S~': { tex: '\u223D' },
    '!-=': { tex: '\\not\\equiv' },
    '!|': { tex: '\u2224' },
    '!sube': { tex: '\\not\\sube' },
    '!supe': { tex: '\\not\\supe' },
    'subne': { tex: '\\subne' },
    'supne': { tex: '\\supne' },
    'lhd': { tex: '\\lhd' },
    'rhd': { tex: '\\rhd' },
    'normal': { tex: '\\unlhd' },
    'rnormal': { tex: '\\unrhd' },

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
    'sech': { tex: '\\sech' },
    'csch': { tex: '\\csch' },
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
    'larr': { tex: '\\leftarrow' },
    'leftarrow': { tex: '\\leftarrow' },
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
    floor: { tex: '\\left\\lfloor$1\\right\\rfloor' },
    ceil: { tex: '\\left\\lceil$1\\right\\rceil' },
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
    text: { tex: '\\text{$1}' },
    tex: { tex: '{ $1 }' },
    mbox: { tex: '\\mbox{$1}' },
    op: { tex: '\\operatorname{ $1 }' },
    cancel: { tex: '\\cancel{ $1 }' },
    hspace: { tex: '\\hspace{$1}' },

    // font command
    bb: { tex: '\\mathbf{ $1 }' },
    mathbf: { tex: '\\mathbf{ $1 }' },
    sf: { tex: '\\mathsf{ $1 }' },
    mathsf: { tex: '\\mathsf{ $1 }' },
    bbb: { tex: '\\mathbb{ $1 }' },
    mathbb: { tex: '\\mathbb{ $1 }' },
    cc: { tex: '\\mathcal{ $1 }' },
    mathcal: { tex: '\\mathcal{ $1 }' },
    tt: { tex: '\\mathtt{ $1 }' },
    mathtt: { tex: '\\mathtt{ $1 }' },
    fr: { tex: '\\mathfrak{ $1 }' },
    mathfrak: { tex: '\\mathfrak{ $1 }' },
    bm: { tex: '\\boldsymbol{ $1 }' },
    rm: { tex: '\\mathrm{ $1 }' },
    mathrm: { tex: '\\mathrm{ $1 }' },
    scr: { tex: '\\mathscr{ $1 }' },
    mathscr: { tex: '\\mathscr{ $1 }' },

    // font size
    tiny: { tex: '{ \\tiny $1 }' },
    small: { tex: '{ \\small $1 }' },
    large: { tex: '{ \\large $1 }' },
    huge: { tex: '{ \\huge $1 }' },
  },
  opOAB: {
    root: { tex: '\\sqrt[ $1 ]{ $2 }' },
    frac: { tex: '\\frac{ $1 }{ $2 }' },
    stackrel: { tex: '\\stackrel{ $1 }{ $2 }' },
    overset: { tex: '\\overset{ $1 }{ $2 }' },
    underset: { tex: '\\under{ $1 }{ $2 }' },
    color: { tex: '{ \\color{$1} $2 }' },
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
    '!!': { tex: '{ $1!! }' },
    '!': { tex: '{ $1! }' },
  },
  opAOB: {
    '/': { tex: '\\frac{ $1 }{ $2 }' },
    'over': { tex: '{ $1 \\over $2 }' },
    'atop': { tex: '{ $1 \\atop $2 }' },
    'choose': { tex: '{ $1 \\choose $2 }' },
  },
  pipe: {
    '|': { tex: '|' },
    '||': { tex: '\\Vert' },
  },
}

const initSymbols = (extSymbols: Symbols = {}): Required<Symbols> => {
  const res: Symbols = {}
  Object.keys(symbols).forEach((key) => {
    res[key as TokenTypes] = {
      ...symbols[key as TokenTypes],
      ...extSymbols[key as TokenTypes],
    }
  })
  return res as Required<Symbols>
}

export default initSymbols
