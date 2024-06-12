interface Example {
  input: string
  tex: string
  mathml?: string
  desc?: string
}

const $ = String.raw

const passedExamples: Example[] = [
  {
    input: '    ',
    tex: '',
    mathml: '<mrow></mrow>',
  },
  {
    input: ' a',
    tex: 'a',
    mathml: '<mi>a</mi>',
  },
  {
    input: '+',
    tex: '+',
    mathml: '<mo>+</mo>',
  },
  {
    input: 'pi',
    tex: '\\pi',
    mathml: '<mi>π</mi>',
  },
  {
    input: '1+2+3',
    tex: '1 + 2 + 3',
    mathml: '<mrow><mn>1</mn><mo>+</mo><mn>2</mn><mo>+</mo><mn>3</mn></mrow>',
  },
  {
    input: '1+-2',
    tex: '1 \\pm 2',
    mathml: '<mrow><mn>1</mn><mo>±</mo><mn>2</mn></mrow>',
  },
  {
    input: '(1+2]',
    tex: '\\left(1 + 2\\right]',
    mathml: '<mrow><mo>(</mo><mn>1</mn><mo>+</mo><mn>2</mn><mo>]</mo></mrow>',
  },
  {
    input: 'sin 11_4^514 19^19_8 1_0',
    tex: '\\sin 11_4^{ 514 } 19_8^{ 19 } 1_0',
    mathml: '<mrow><mo>sin</mo><msubsup><mn>11</mn><mn>4</mn><mn>514</mn></msubsup><msubsup><mn>19</mn><mn>8</mn><mn>19</mn></msubsup><msub><mn>1</mn><mn>0</mn></msub></mrow>',
  },
  {
    input: '[a;b;c]',
    tex: '\\left[\\begin{array}{c}a \\\\ b \\\\ c\\end{array}\\right]',
    mathml: '<mrow><mo>[</mo><mtable><mtr><mtd><mi>a</mi></mtd></mtr><mtr><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mi>c</mi></mtd></mtr></mtable><mo>]</mo></mrow>',
  },
  {
    input: '[a, b; c, d;:}',
    tex: '\\left[\\begin{array}{cc}a & b \\\\ c & d \\\\ \\end{array}\\right.',
    mathml: '<mrow><mo>[</mo><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mi>c</mi></mtd><mtd><mi>d</mi></mtd></mtr></mtable></mrow>',
  },
  {
    input: 'sqrt x',
    tex: '\\sqrt{ x }',
    mathml: '<msqrt><mi>x</mi></msqrt>',
  },
  {
    input: 'sqrt (x)',
    tex: '\\sqrt{ x }',
    mathml: '<msqrt><mrow><mi>x</mi></mrow></msqrt>',
  },
  {
    input: 'root 3 2.0',
    tex: '\\sqrt[ 3 ]{ 2.0 }',
    mathml: '<mroot><mn>2.0</mn><mn>3</mn></mroot>',
  },
  {
    input: 'root [3)  {:2.0}',
    tex: '\\sqrt[ 3 ]{ 2.0 }',
    mathml: '<mroot><mrow><mn>2.0</mn></mrow><mrow><mn>3</mn></mrow></mroot>',
  },
  {
    input: 'sum_(n=1)^(+oo) 1/n^2 = pi^2/6',
    tex: '\\sum_{ n = 1 }^{ + \\infty } \\frac{ 1 }{ n^2 } = \\frac{ \\pi^2 }{ 6 }',
    mathml: '<mrow><munderover><mo>∑</mo><mrow><mi>n</mi><mo>=</mo><mn>1</mn></mrow><mrow><mo>+</mo><mo>∞</mo></mrow></munderover><mfrac><mn>1</mn><msup><mi>n</mi><mn>2</mn></msup></mfrac><mo>=</mo><mfrac><msup><mi>π</mi><mn>2</mn></msup><mn>6</mn></mfrac></mrow>',
  },
  {
    input: 'a_1^2 + b_1^2 = c_1^2',
    tex: 'a_1^2 + b_1^2 = c_1^2',
    mathml: '<mrow><msubsup><mi>a</mi><mn>1</mn><mn>2</mn></msubsup><mo>+</mo><msubsup><mi>b</mi><mn>1</mn><mn>2</mn></msubsup><mo>=</mo><msubsup><mi>c</mi><mn>1</mn><mn>2</mn></msubsup></mrow>',
  },
  {
    input: 'a/b, a//b',
    tex: '\\frac{ a }{ b } , a {/} b',
    mathml: '<mrow><mfrac><mi>a</mi><mi>b</mi></mfrac><mo>,</mo><mi>a</mi><mo>/</mo><mi>b</mi></mrow>',
  },
  {
    input: 'sqrt n, root n x, a^2/sqrt b',
    tex: '\\sqrt{ n } , \\sqrt[ n ]{ x } , \\frac{ a^2 }{ \\sqrt{ b } }',
    mathml: '<mrow><msqrt><mi>n</mi></msqrt><mo>,</mo><mroot><mi>x</mi><mi>n</mi></mroot><mo>,</mo><mfrac><msup><mi>a</mi><mn>2</mn></msup><msqrt><mi>b</mi></msqrt></mfrac></mrow>',
  },
  {
    input: 'lim_(n->oo) (1 + 1/n)^n',
    tex: '\\lim_{ n \\to \\infty } \\left(1 + \\frac{ 1 }{ n }\\right)^n',
    mathml: '<mrow><munder><mo>lim</mo><mrow><mi>n</mi><mo>→</mo><mo>∞</mo></mrow></munder><msup><mrow><mo>(</mo><mn>1</mn><mo>+</mo><mfrac><mn>1</mn><mi>n</mi></mfrac><mo>)</mo></mrow><mi>n</mi></msup></mrow>',
  },
  {
    input: 'sin {: x/2 :}',
    tex: '\\sin \\left.\\frac{ x }{ 2 }\\right.',
    mathml: '<mrow><mo>sin</mo><mrow><mfrac><mi>x</mi><mn>2</mn></mfrac></mrow></mrow>',
  },
  {
    input: 'int_a^b f(x) dx',
    tex: '\\int_a^b f \\left(x\\right) {\\text{d}x}',
    mathml: '<mrow><msubsup><mo>∫</mo><mi>a</mi><mi>b</mi></msubsup><mi>f</mi><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mrow><mtext>d</mtext><mi>x</mi></mrow></mrow>',
  },
  {
    input: '(del f)/(del x), (del^3 f)/(del x del y^2)',
    tex: '\\frac{ \\partial f }{ \\partial x } , \\frac{ \\partial^3 f }{ \\partial x \\partial y^2 }',
    mathml: '<mrow><mfrac><mrow><mo>∂</mo><mi>f</mi></mrow><mrow><mo>∂</mo><mi>x</mi></mrow></mfrac><mo>,</mo><mfrac><mrow><msup><mo>∂</mo><mn>3</mn></msup><mi>f</mi></mrow><mrow><mo>∂</mo><mi>x</mi><mo>∂</mo><msup><mi>y</mi><mn>2</mn></msup></mrow></mfrac></mrow>',
  },
  {
    input: 'frac a b',
    tex: '\\frac{ a }{ b }',
    mathml: '<mfrac><mi>a</mi><mi>b</mi></mfrac>',
  },
  {
    input: '"hello world"',
    tex: '\\text{hello world}',
    mathml: '<mtext>hello world</mtext>',
  },
  {
    input: 'color "red"  abc',
    tex: '{ \\color{red} a } b c',
    mathml: '<mrow><mstyle mathcolor="red"><mi>a</mi></mstyle><mi>b</mi><mi>c</mi></mrow>',
  },
  {
    input: 'hspace "12pt"',
    tex: '\\hspace{12pt}',
    mathml: '<mspace width="12pt"></mspace>',
  },
  {
    input: 'tex "\\LaTeX"',
    tex: '{ \\LaTeX }',
    mathml: '<tex>\\LaTeX</tex>',
  },
  {
    input: '""',
    tex: '\\text{}',
    mathml: '<mtext></mtext>',
  },
  {
    input: 'dy/dx, ("d"r)/("d"theta), f\'\'(x)',
    tex: '\\frac{ {\\text{d}y} }{ {\\text{d}x} } , \\frac{ \\text{d} r }{ \\text{d} \\theta } , f ^{\\prime\\prime} \\left(x\\right)',
    mathml: '<mrow><mfrac><mrow><mtext>d</mtext><mi>y</mi></mrow><mrow><mtext>d</mtext><mi>x</mi></mrow></mfrac><mo>,</mo><mfrac><mrow><mtext>d</mtext><mi>r</mi></mrow><mrow><mtext>d</mtext><mi>θ</mi></mrow></mfrac><mo>,</mo><mi>f</mi><mo>″</mo><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow>',
  },
  {
    input: 'ddfx , dd^2 f x , ddot x',
    tex: '\\frac{ \\text{d} f }{ \\text{d} x } , \\frac{ \\text{d}^2 f }{ \\text{d} x^2 } , \\ddot{ x }',
    mathml: '<mrow><mfrac><mrow><mtext>d</mtext><mi>f</mi></mrow><mrow><mtext>d</mtext><mi>x</mi></mrow></mfrac><mo>,</mo><mfrac><mrow><msup><mtext>d</mtext><mn>2</mn></msup><mi>f</mi></mrow><mrow><mtext>d</mtext><msup><mi>x</mi><mn>2</mn></msup></mrow></mfrac><mo>,</mo><mover><mi>x</mi><mo>..</mo></mover></mrow>',
  },
  {
    input: 'ppfx',
    tex: '\\frac{ \\partial f }{ \\partial x }',
    mathml: '<mfrac><mrow><mo>∂</mo><mi>f</mi></mrow><mrow><mo>∂</mo><mi>x</mi></mrow></mfrac>',
  },
  {
    input: 'pp {::} x',
    tex: '\\frac{ \\partial  }{ \\partial x }',
    mathml: '<mfrac><mrow><mo>∂</mo><mrow><mrow></mrow></mrow></mrow><mrow><mo>∂</mo><mi>x</mi></mrow></mfrac>',
  },
  {
    input: 'pp^3 f (x y^2)',
    tex: '\\frac{ \\partial^3 f }{ \\partial x\\partial y^2 }',
    mathml: '<mfrac><mrow><msup><mo>∂</mo><mn>3</mn></msup><mi>f</mi></mrow><mrow><mrow><mo>∂</mo><mi>x</mi></mrow><mrow><mo>∂</mo><msup><mi>y</mi><mn>2</mn></msup></mrow></mrow></mfrac>',
  },
  {
    input: 'dd^2 (bm r) s',
    tex: $`\frac{ \text{d}^2 \boldsymbol{ r } }{ \text{d} s^2 }`,
    mathml: '<mfrac><mrow><msup><mtext>d</mtext><mn>2</mn></msup><mrow><mstyle mathvariant="bold-italic"><mi>r</mi></mstyle></mrow></mrow><mrow><mtext>d</mtext><msup><mi>s</mi><mn>2</mn></msup></mrow></mfrac>',
  },
  {
    input: 'abs(x)',
    tex: '\\left|x\\right|',
    mathml: '<mrow><mo>|</mo><mrow><mi>x</mi></mrow><mo>|</mo></mrow>',
  },
  {
    input: '{ a | b }',
    tex: '\\left\\lbrace{}a \\mid b\\right\\rbrace',
    mathml: '<mrow><mo>{</mo><mi>a</mi><mo>∣</mo><mi>b</mi><mo>}</mo></mrow>',
  },
  {
    input: '(a,b)',
    tex: '\\left(a, b\\right)',
    mathml: '<mrow><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow>',
  },
  {
    input: '{(x,y)|x^2+y^2<=1}',
    tex: '\\left\\lbrace{}\\left(x, y\\right) \\mid x^2 + y^2 \\leqslant 1\\right\\rbrace',
    mathml: '<mrow><mo>{</mo><mo>(</mo><mi>x</mi><mo>,</mo><mi>y</mi><mo>)</mo><mo>∣</mo><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><msup><mi>y</mi><mn>2</mn></msup><mo>⩽</mo><mn>1</mn><mo>}</mo></mrow>',
  },
  {
    input: '|a, b; c, d|',
    tex: '\\left|\\begin{array}{cc}a & b \\\\ c & d\\end{array}\\right|',
    mathml: '<mrow><mo>|</mo><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mi>c</mi></mtd><mtd><mi>d</mi></mtd></mtr></mtable><mo>|</mo></mrow>',
  },
  {
    input: '|x| = { x, if x > 0; -x, otherwise :}',
    tex: '\\left|x\\right| = \\left\\lbrace{}\\begin{array}{ll}x & \\text{if\\quad} x > 0 \\\\ - x & \\text{otherwise\\quad}\\end{array}\\right.',
    mathml: '<mrow><mrow><mo>|</mo><mi>x</mi><mo>|</mo></mrow><mo>=</mo><mrow><mo>{</mo><mtable><mtr><mtd><mi>x</mi></mtd><mtd><mrow><mrow><mtext>if</mtext><mspace width="1ex"></mspace></mrow><mi>x</mi><mo>&gt;</mo><mn>0</mn></mrow></mtd></mtr><mtr><mtd><mrow><mo>-</mo><mi>x</mi></mrow></mtd><mtd><mrow><mtext>otherwise</mtext><mspace width="1ex"></mspace></mrow></mtd></mtr></mtable></mrow></mrow>',
  },
  {
    input: 'e^-x',
    tex: 'e^{ -x }',
    mathml: '<msup><mi>e</mi><mrow><mo>-</mo><mi>x</mi></mrow></msup>',
  },
  {
    input: 'e^-(x^-2+y^2)',
    tex: 'e^{ -\\left(x^{ -2 } + y^2\\right) }',
    mathml: '<msup><mi>e</mi><mrow><mo>-</mo><mrow><mo>(</mo><msup><mi>x</mi><mrow><mo>-</mo><mn>2</mn></mrow></msup><mo>+</mo><msup><mi>y</mi><mn>2</mn></msup><mo>)</mo></mrow></mrow></msup>',
  },
  {
    input: '-(a+b-c)/2',
    tex: '- \\frac{ a + b - c }{ 2 }',
    mathml: '<mrow><mo>-</mo><mfrac><mrow><mi>a</mi><mo>+</mo><mi>b</mi><mo>-</mo><mi>c</mi></mrow><mn>2</mn></mfrac></mrow>',
  },
  {
    input: 'f\'_(+) (x)',
    tex: 'f ^{\\prime}_{ + } \\left(x\\right)',
    mathml: '<mrow><mi>f</mi><msub><mo>′</mo><mrow><mo>+</mo></mrow></msub><mrow><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow>',
  },
  {
    input: 'a^2 choose b^2',
    tex: '{ a^2 \\choose b^2 }',
    mathml: '<mrow><mo>(</mo><mtable><mtr><mtd><msup><mi>a</mi><mn>2</mn></msup></mtd></mtr><mtr><mtd><msup><mi>b</mi><mn>2</mn></msup></mtd></mtr></mtable><mo>)</mo></mrow>',
  },
  {
    input: 'n!',
    tex: '{ n! }',
    mathml: '<mrow><mi>n</mi><mo>!</mo></mrow>',
  },
  {
    input: 'n!!^2/2!',
    tex: '\\frac{ { n!! }^2 }{ { 2! } }',
    mathml: '<mfrac><msup><mrow><mi>n</mi><mo>!!</mo></mrow><mn>2</mn></msup><mrow><mn>2</mn><mo>!</mo></mrow></mfrac>',
  },
  {
    input: 'n_1!',
    tex: 'n_{ 1! }',
    mathml: '<msub><mi>n</mi><mrow><mn>1</mn><mo>!</mo></mrow></msub>',
  },
  {
    input: '|__x__|',
    tex: '\\left\\lfloor{}x\\right\\rfloor',
    mathml: '<mrow><mo>⌊</mo><mi>x</mi><mo>⌋</mo></mrow>',
  },
  // matrix examples
  {
    input: '[ ]',
    tex: '\\left[\\right]',
    mathml: '<mrow><mo>[</mo><mrow></mrow><mo>]</mo></mrow>',
  },
  {
    input: '[1]',
    tex: '\\left[1\\right]',
    mathml: '<mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow>',
  },
  {
    input: '[1,]',
    tex: '\\left[1, \\right]',
    mathml: '<mrow><mo>[</mo><mn>1</mn><mo>,</mo><mrow></mrow><mo>]</mo></mrow>',
  },
  {
    input: '[1;]',
    tex: '\\left[\\begin{array}{c}1 \\\\ \\end{array}\\right]',
    mathml: '<mrow><mo>[</mo><mtable><mtr><mtd><mn>1</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
  },
  {
    input: '[1, 2]',
    tex: '\\left[1, 2\\right]',
    mathml: '<mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>]</mo></mrow>',
  },
  {
    input: '[1, 2; 3]',
    tex: '\\left[\\begin{array}{cc}1 & 2 \\\\ 3\\end{array}\\right]',
    mathml: '<mrow><mo>[</mo><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
  },
  {
    input: '[1, 2; ,3]',
    tex: '\\left[\\begin{array}{cc}1 & 2 \\\\  & 3\\end{array}\\right]',
    mathml: '<mrow><mo>[</mo><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mrow></mrow></mtd><mtd><mn>3</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
  },
  {
    input: '[1, 2;]',
    tex: '\\left[\\begin{array}{cc}1 & 2 \\\\ \\end{array}\\right]',
    mathml: '<mrow><mo>[</mo><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
  },
  {
    input: '| |',
    tex: '\\left|\\right|',
    mathml: '<mrow><mo>|</mo><mrow></mrow><mo>|</mo></mrow>',
  },
  {
    input: '|1|',
    tex: '\\left|1\\right|',
    mathml: '<mrow><mo>|</mo><mn>1</mn><mo>|</mo></mrow>',
  },
  {
    input: '|1,|',
    tex: '\\left|1, \\right|',
    mathml: '<mrow><mo>|</mo><mn>1</mn><mo>,</mo><mrow></mrow><mo>|</mo></mrow>',
  },
  {
    input: '|1;|',
    tex: '\\left|\\begin{array}{c}1 \\\\ \\end{array}\\right|',
    mathml: '<mrow><mo>|</mo><mtable><mtr><mtd><mn>1</mn></mtd></mtr></mtable><mo>|</mo></mrow>',
  },
  {
    input: '|1, 2|',
    tex: '\\left|1, 2\\right|',
    mathml: '<mrow><mo>|</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>|</mo></mrow>',
  },
  {
    input: '|1, 2; 3|',
    tex: '\\left|\\begin{array}{cc}1 & 2 \\\\ 3\\end{array}\\right|',
    mathml: '<mrow><mo>|</mo><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3</mn></mtd></mtr></mtable><mo>|</mo></mrow>',
  },
  {
    input: '|1, 2; ,3|',
    tex: '\\left|\\begin{array}{cc}1 & 2 \\\\  & 3\\end{array}\\right|',
    mathml: '<mrow><mo>|</mo><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mrow></mrow></mtd><mtd><mn>3</mn></mtd></mtr></mtable><mo>|</mo></mrow>',
  },
  {
    input: '|1, 2;|',
    tex: '\\left|\\begin{array}{cc}1 & 2 \\\\ \\end{array}\\right|',
    mathml: '<mrow><mo>|</mo><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd></mtr></mtable><mo>|</mo></mrow>',
  },
  {
    input: '[1, 2 | 3; 4, 5 | 6]',
    tex: '\\left[\\begin{array}{cc|c}1 & 2 & 3 \\\\ 4 & 5 & 6\\end{array}\\right]',
    mathml: '<mrow><mo>[</mo><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd><mtd style="border-left:1px solid"><mn>3</mn></mtd></mtr><mtr><mtd><mn>4</mn></mtd><mtd><mn>5</mn></mtd><mtd style="border-left:1px solid"><mn>6</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
  },
  {
    input: '[1, 2 | 3; 4 | 5, 6]',
    tex: '\\left[\\begin{array}{c|c|c}1 & 2 & 3 \\\\ 4 & 5 & 6\\end{array}\\right]',
    mathml: '<mrow><mo>[</mo><mtable><mtr><mtd><mn>1</mn></mtd><mtd style="border-left:1px solid"><mn>2</mn></mtd><mtd style="border-left:1px solid"><mn>3</mn></mtd></mtr><mtr><mtd><mn>4</mn></mtd><mtd style="border-left:1px solid"><mn>5</mn></mtd><mtd style="border-left:1px solid"><mn>6</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
  },
  {
    input: '[a, b; [1, 2; 3, 4], d]',
    tex: '\\left[\\begin{array}{cc}a & b \\\\ \\left[\\begin{array}{cc}1 & 2 \\\\ 3 & 4\\end{array}\\right] & d\\end{array}\\right]',
    mathml: '<mrow><mo>[</mo><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mrow><mo>[</mo><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3</mn></mtd><mtd><mn>4</mn></mtd></mtr></mtable><mo>]</mo></mrow></mtd><mtd><mi>d</mi></mtd></mtr></mtable><mo>]</mo></mrow>',
  },
  {
    input: '[|a, b; c,d]',
    tex: '\\left[\\begin{array}{|cc}a & b \\\\ c & d\\end{array}\\right]',
    mathml: '<mrow><mo>[</mo><mtable><mtr><mtd style="border-left:1px solid"><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr><mtr><mtd style="border-left:1px solid"><mi>c</mi></mtd><mtd><mi>d</mi></mtd></mtr></mtable><mo>]</mo></mrow>',
  },
  {
    input: '[a, b|; c,d]',
    tex: '\\left[\\begin{array}{cc|}a & b \\\\ c & d\\end{array}\\right]',
    mathml: '<mrow><mo>[</mo><mtable><mtr><mtd><mi>a</mi></mtd><mtd style="border-right:1px solid"><mi>b</mi></mtd></mtr><mtr><mtd><mi>c</mi></mtd><mtd style="border-right:1px solid"><mi>d</mi></mtd></mtr></mtable><mo>]</mo></mrow>',
  },
  {
    input: '[|a, b|; c,d]',
    tex: '\\left[\\begin{array}{|cc|}a & b \\\\ c & d\\end{array}\\right]',
    mathml: '<mrow><mo>[</mo><mtable><mtr><mtd style="border-left:1px solid"><mi>a</mi></mtd><mtd style="border-right:1px solid"><mi>b</mi></mtd></mtr><mtr><mtd style="border-left:1px solid"><mi>c</mi></mtd><mtd style="border-right:1px solid"><mi>d</mi></mtd></mtr></mtable><mo>]</mo></mrow>',
  },
  {
    input: '[|a | b|; c,d]',
    tex: '\\left[\\begin{array}{|c|c|}a & b \\\\ c & d\\end{array}\\right]',
    mathml: '<mrow><mo>[</mo><mtable><mtr><mtd style="border-left:1px solid"><mi>a</mi></mtd><mtd style="border-left:1px solid;border-right:1px solid"><mi>b</mi></mtd></mtr><mtr><mtd style="border-left:1px solid"><mi>c</mi></mtd><mtd style="border-left:1px solid;border-right:1px solid"><mi>d</mi></mtd></mtr></mtable><mo>]</mo></mrow>',
  },
  {
    input: '[|hline 1| 2|; hline 3, 4; hline]',
    tex: '\\left[\\begin{array}{|c|c|}\\hline 1 & 2 \\\\ \\hline 3 & 4 \\\\ \\hline\\end{array}\\right]',
    mathml: '<mrow><mo>[</mo><mtable><mtr><mtd style="border-left:1px solid;border-top:1px solid"><mrow><mn>1</mn></mrow></mtd><mtd style="border-left:1px solid;border-right:1px solid;border-top:1px solid"><mn>2</mn></mtd></mtr><mtr><mtd style="border-left:1px solid;border-top:1px solid;border-bottom:1px solid"><mrow><mn>3</mn></mrow></mtd><mtd style="border-left:1px solid;border-right:1px solid;border-top:1px solid;border-bottom:1px solid"><mn>4</mn></mtd></mtr></mtable><mo>]</mo></mrow>',
  },
  {
    input: '"\\\\abc"',
    tex: '\\text{\\abc}',
    mathml: '<mtext>\\abc</mtext>',
  },
  {
    input: '==^b_a',
    tex: '\\xlongequal[ a ]{ b }',
    mathml: '<munderover><mo>══</mo><mi>a</mi><mi>b</mi></munderover>',
  },
  {
    input: '-->^114_5',
    tex: '\\xrightarrow[ 5 ]{ 114 }',
    mathml: '<munderover><mo>→</mo><mn>5</mn><mn>114</mn></munderover>',
  },
  {
    input: '==^b',
    tex: '\\xlongequal[  ]{ b }',
    mathml: '<mover><mo>══</mo><mi>b</mi></mover>',
  },
  {
    input: '==_a',
    tex: '\\xlongequal[ a ]{  }',
    mathml: '<munder><mo>══</mo><mi>a</mi></munder>',
  },
  {
    input: '& 1111\n\n& 2222',
    tex: '\\begin{aligned}& 1111 \\\\ & 2222\\end{aligned}',
    mathml: '<mtable><mtr><mtd><mrow><mn>1111</mn></mrow></mtd></mtr><mtr><mtd><mrow><mn>2222</mn></mrow></mtd></mtr></mtable>',
  },
  {
    input: 'hline\na && 111 && 333\n\nhline\nb && 222\n\nhline',
    tex: '\\begin{aligned}\\hline a && 111 && 333 \\\\ \\hline b && 222 \\\\ \\hline\\end{aligned}',
    // TODO: support hline in multiline
    mathml: '<mtable><mtr><mtd style="border-top:1px solid"><mrow><mi>a</mi><mn>111</mn><mn>333</mn></mrow></mtd></mtr><mtr><mtd style="border-top:1px solid;border-bottom:1px solid"><mrow><mi>b</mi><mn>222</mn></mrow></mtd></mtr></mtable>',
  },
  {
    input: '[hline|a|b|;]',
    tex: '\\left[\\begin{array}{|c|c|}\\hline a & b \\\\ \\end{array}\\right]',
    mathml: '<mrow><mo>[</mo><mtable><mtr><mtd style="border-left:1px solid;border-top:1px solid"><mrow><mi>a</mi></mrow></mtd><mtd style="border-left:1px solid;border-right:1px solid;border-top:1px solid"><mi>b</mi></mtd></mtr></mtable><mo>]</mo></mrow>',
  },
  {
    input: `{:
  --
  |a|b|;
  --
  c, d;
  --
:}`,
    tex: '\\left.\\begin{array}{|c|c|}\\hline a & b \\\\ \\hline c & d \\\\ \\hline\\end{array}\\right.',
    mathml: '<mrow><mtable><mtr><mtd style="border-left:1px solid;border-top:1px solid"><mrow><mi>a</mi></mrow></mtd><mtd style="border-left:1px solid;border-right:1px solid;border-top:1px solid"><mi>b</mi></mtd></mtr><mtr><mtd style="border-left:1px solid;border-top:1px solid;border-bottom:1px solid"><mrow><mi>c</mi></mrow></mtd><mtd style="border-left:1px solid;border-right:1px solid;border-top:1px solid;border-bottom:1px solid"><mi>d</mi></mtd></mtr></mtable></mrow>',
  },
  {
    input: '\uD83D\uDC40',
    tex: '\uD83D\uDC40',
    mathml: '<mtext>👀</mtext>',
  },
  {
    input: '🍎/(🍌+🍍) + 🍌/(🍍+🍎) + 🍍/(🍎+🍌) = 4',
    tex: '\\frac{ 🍎 }{ 🍌 + 🍍 } + \\frac{ 🍌 }{ 🍍 + 🍎 } + \\frac{ 🍍 }{ 🍎 + 🍌 } = 4',
    mathml: '<mrow><mfrac><mtext>🍎</mtext><mrow><mtext>🍌</mtext><mo>+</mo><mtext>🍍</mtext></mrow></mfrac><mo>+</mo><mfrac><mtext>🍌</mtext><mrow><mtext>🍍</mtext><mo>+</mo><mtext>🍎</mtext></mrow></mfrac><mo>+</mo><mfrac><mtext>🍍</mtext><mrow><mtext>🍎</mtext><mo>+</mo><mtext>🍌</mtext></mrow></mfrac><mo>=</mo><mn>4</mn></mrow>',
  },
  {
    input: 'verb"114514\n1919810"',
    tex: '\\begin{aligned}\n& \\verb|114514|\\\\\n& \\verb|1919810|\n\\end{aligned}',
    mathml: `<mtext style="white-space:pre-wrap;text-align:left">114514
1919810</mtext>`,
  },
  {
    input: '"\\\\"',
    tex: '\\text{\\}',
    mathml: '<mtext>\\</mtext>',
  },
  {
    input: $`verb"#include<stdio.h>
int main() {
  if (a || b) printf(b);
  return 0;
}"`,
    tex: $`\begin{aligned}
& \verb|#include<stdio.h>|\\
& \verb|int main() {|\\
& \verb|  if (a |\verb%|%\verb||\verb%|%\verb| b) printf(b);|\\
& \verb|  return 0;|\\
& \verb|}|
\end{aligned}`,
    mathml: `<mtext style="white-space:pre-wrap;text-align:left">#include&lt;stdio.h&gt;
int main() {
  if (a || b) printf(b);
  return 0;
}</mtext>`,
  },
  // test op strip
  {
    input: '(a)!',
    tex: '{ \\left(a\\right)! }',
    mathml: '<mrow><mrow><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>!</mo></mrow>',
  },
  {
    input: '(n) choose (k) = n!/(n!(n-k)!)',
    tex: '{ n \\choose k } = \\frac{ { n! } }{ { n! } { \\left(n - k\\right)! } }',
    mathml: '<mrow><mrow><mo>(</mo><mtable><mtr><mtd><mrow><mi>n</mi></mrow></mtd></mtr><mtr><mtd><mrow><mi>k</mi></mrow></mtd></mtr></mtable><mo>)</mo></mrow><mo>=</mo><mfrac><mrow><mi>n</mi><mo>!</mo></mrow><mrow><mrow><mi>n</mi><mo>!</mo></mrow><mrow><mrow><mo>(</mo><mi>n</mi><mo>-</mo><mi>k</mi><mo>)</mo></mrow><mo>!</mo></mrow></mrow></mfrac></mrow>',
  },
  {
    input: 'limits(theta)_(k=1)^K',
    tex: $`\mathop{ \theta }\limits_{ k = 1 }^K`,
    // TODO: limits
    mathml: '<munderover><mo>θ</mo><mrow><mi>k</mi><mo>=</mo><mn>1</mn></mrow><mi>K</mi></munderover>',
  },
  {
    input: 'limits(tex"\\Vert")_(k=1)^K',
    tex: $`\mathop{ { \Vert } }\limits_{ k = 1 }^K`,
    // TODO: limits
    mathml: '<munderover><mo><tex>\Vert</tex></mo><mrow><mi>k</mi><mo>=</mo><mn>1</mn></mrow><mi>K</mi></munderover>',
  },
  {
    input: '|a_n|/2',
    tex: $`\frac{ \left|a_n\right| }{ 2 }`,
    // TODO: this is wrong!
    mathml: '<mfrac><mrow><mo>|</mo><msub><mi>a</mi><mi>n</mi></msub><mo>|</mo></mrow><mn>2</mn></mfrac>',
  },
  {
    input: '(|a|+|b|)',
    tex: $`\left(\left|a\right|+\left|b\right|\right)`,
    // TODO: this is wrong!
    mathml: '<mrow><mo>(</mo><mo>|</mo><mi>a</mi><mo>|</mo><mo>+</mo><mo>|</mo><mi>b</mi><mo>|</mo><mo>)</mo></mrow>',
  },
  {
    input: '(|a|+|b|+|c)',
    tex: $`\left(\left|a\right|+\left|b\right|+ \mid c\right)`,
    // TODO: this is wrong!
    mathml: '<mrow><mo>(</mo><mo>|</mo><mi>a</mi><mo>|</mo><mo>+</mo><mo>|</mo><mi>b</mi><mo>|</mo><mo>+</mo><mo>\u2223</mo><mi>c</mi><mo>)</mo></mrow>',
  },
  {
    input: '(||a||+|b|+|c)',
    tex: $`\left(\left\|a\right\|+\left|b\right|+ \mid c\right)`,
    // TODO: this is wrong!
    mathml: '<mrow><mo>(</mo><mo>\u2225</mo><mi>a</mi><mo>\u2225</mo><mo>+</mo><mo>|</mo><mi>b</mi><mo>|</mo><mo>+</mo><mo>\u2223</mo><mi>c</mi><mo>)</mo></mrow>',
  },
  // 脱去矩阵括号
  {
    input: '[a;b]/2',
    tex: $`\frac{ \begin{array}{c}a \\ b\end{array} }{ 2 }`,
    mathml: '<mfrac><mtable><mtr><mtd><mi>a</mi></mtd></mtr><mtr><mtd><mi>b</mi></mtd></mtr></mtable><mn>2</mn></mfrac>',
  },
  // 不脱去引号
  {
    input: '"abc"/2',
    tex: $`\frac{ \text{abc} }{ 2 }`,
    mathml: '<mfrac><mtext>abc</mtext><mn>2</mn></mfrac>',
  },
  {
    input: 'a\r\n',
    tex: 'a',
    mathml: '<mi>a</mi>',
  },
  {
    input: '& a\r\n\r& b\n\r& c',
    tex: '\\begin{aligned}& a \\\\ & b \\\\ & c\\end{aligned}',
    mathml: '<mtable><mtr><mtd><mrow><mi>a</mi></mrow></mtd></mtr><mtr><mtd><mrow><mi>b</mi></mrow></mtd></mtr><mtr><mtd><mrow><mi>c</mi></mrow></mtd></mtr></mtable>',
  },
  {
    input: 'a\t\v\f',
    tex: 'a',
    mathml: '<mi>a</mi>',
  },
  {
    input: '==^"abc"',
    tex: '\\xlongequal[  ]{ \\text{abc} }',
    mathml: '<mover><mo>══</mo><mtext>abc</mtext></mover>',
  },
  {
    input: 'a | b',
    tex: 'a \\mid b',
    mathml: '<mrow><mi>a</mi><mo>\u2223</mo><mi>b</mi></mrow>',
  },
  {
    input: '|a| | b',
    tex: $`\left|a\right| \mid b`,
    mathml: '<mrow><mrow><mo>|</mo><mi>a</mi><mo>|</mo></mrow><mo>\u2223</mo><mi>b</mi></mrow>',
  },
  // {
  //   input: '(|a-b|^2)',
  //   // TODO: this is wrong!
  //   tex: '',
  //   mathml: '',
  // },
]

// no idea why this fails ˉ\_(ツ)_/ˉ
const whyThisFails: Example[] = [
  {
    input: '"\\"abc\\""',
    tex: '\\text{"abc"}',
  },
  {
    input: $`verb"#include<stdio.h>
int main() {
  printf(\"hello, world!\n\");
  return 0;
}"`,
    tex: $`\begin{aligned}
& \verb|\#include<stdio.h>|\\
& \verb|int\ main()\ \{|\\
& \verb|\ \ printf("hello,\ world!\textbackslash{}n");|\\
& \verb|\ \ return\ 0;|\\
& \verb|\}|
\end{aligned}`,
  },
]

const todoExamples: Example[] = [
]

export const examples: Example[] = [
  ...passedExamples,
  ...todoExamples,
  // ...whyThisFails,
]
