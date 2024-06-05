import { describe, expect, it } from 'vitest'
import { AsciiMath } from '../src'
import { $_ } from './utils/string-raw'

const examples = [
  {
    i: '    ',
    o: $_``,
  },
  {
    i: 'a',
    o: $_`a`,
  },
  {
    i: 'pi',
    o: $_`\pi`,
  },
  {
    i: '1+2+3',
    o: $_`1 + 2 + 3`,
  },
  {
    i: '1+-2',
    o: $_`1 \pm 2`,
  },
  {
    i: '(1+2]',
    o: $_`\left( 1 + 2 \right]`,
  },
  {
    i: 'sin 11_4^514 19^19_8 1_0',
    o: $_`\sin 11 _{ 4 } ^{ 514 } 19 ^{ 19 } _{ 8 } 1 _{ 0 }`,
  },
  {
    i: '[a;b;c]',
    o: $_`\left[ \begin{array}{c} a \\ b \\ c \end{array} \right]`,
  },
  {
    i: '[a, b; c, d:}',
    o: $_`\left[ \begin{array}{cc} a & b \\ c & d \end{array} \right.`,
  },
  {
    i: 'sqrt x',
    o: $_`\sqrt{ x }`,
  },
  {
    i: 'sqrt (x)',
    o: $_`\sqrt{ x }`,
  },
  {
    i: 'root 3 2.0',
    o: $_`\sqrt[ 3 ]{ 2.0 }`,
  },
  {
    i: 'root (3)  {:2.0}',
    o: $_`\sqrt[ 3 ]{ \left. 2.0 \right\rbrace }`,
  },
  {
    i: 'sum_(n=1)^(+oo) 1/n^2 = pi^2/6',
    o: $_`\sum _{ n = 1 } ^{ + \infty } \frac{ 1 }{ n ^{ 2 } } = \frac{ \pi ^{ 2 } }{ 6 }`,
  },
  {
    i: 'a_1^2 + b_1^2 = c_1^2',
    o: $_`a _{ 1 } ^{ 2 } + b _{ 1 } ^{ 2 } = c _{ 1 } ^{ 2 }`,
  },
  {
    i: 'a/b, a//b',
    o: $_`\frac{ a }{ b } , a {/} b`,
  },
  {
    i: 'sqrt n, root n x, a^2/sqrt b',
    o: $_`\sqrt{ n } , \sqrt[ n ]{ x } , \frac{ a ^{ 2 } }{ \sqrt{ b } }`,
  },
  {
    i: 'lim_(n->oo) (1 + 1/n)^n',
    o: $_`\lim _{ n \to \infty } \left( 1 + \frac{ 1 }{ n } \right) ^{ n }`,
  },
  {
    i: 'sin {: x/2 :}',
    o: $_`\sin { \frac{ x }{ 2 } }`,
  },
  {
    i: 'int_a^b f(x) dx',
    o: $_`\int _{ a } ^{ b } f \left( x \right) {\text{d}x}`,
  },
  {
    i: '(del f)/(del x), (del^3 f)/(del x del y^2)',
    o: $_`\frac{ \partial f }{ \partial x } , \frac{ \partial ^{ 3 } f }{ \partial x \partial y ^{ 2 } }`,
  },
  {
    i: 'frac a b',
    o: $_`\frac{ a }{ b }`,
  },
  {
    i: '"hello world"',
    o: $_`\text{hello world}`,
  },
  {
    i: 'color "red"  a b c',
    o: $_`{ \color{red} a } b c`,
  },
  {
    i: 'hspace "12pt"',
    o: $_`\hspace{12pt}`,
  },
  {
    i: $_`tex "\LaTeX"`,
    o: $_`\LaTeX`,
  },
  {
    i: 'dy/dx, ("d"r)/("d"theta), f\'\'(x)',
    o: $_`\frac{ {\text{d}y} }{ {\text{d}x} } , \frac{ \text{d} r }{ \text{d} \theta } , f ^{\prime\prime} \left( x \right)`,
  },
  {
    i: 'ddfx , dd^2 f x , ddot x',
    o: $_`\frac{ \mathrm{d} f }{ \mathrm{d} x } , \frac{ \mathrm{d} ^{ 2 } f }{ \mathrm{d} x ^{ 2 } } , \ddot{ x }`,
  },
  {
    i: 'ppfx',
    o: $_`\frac{ \partial f }{ \partial x }`,
  },
  {
    i: 'pp {::} x',
    o: $_`\frac{ \partial { } }{ \partial x }`,
  },
  {
    i: 'pp^3 f (x y^2)',
    o: $_`\frac{ \partial ^{ 3 } f }{ \partial x \partial y ^{ 2 } }`,
  },
  {
    i: 'abs(x)',
    o: $_`\left| x \right|`,
  },
  {
    i: '{ a | b }',
    o: $_`\left\lbrace a \mid b \right\rbrace`,
  },
  {
    i: '(a,b)',
    o: $_`\left( a , b \right)`,
  },
  {
    i: '{(x,y)|x^2+y^2<=1}',
    o: $_`\left\lbrace \left( x , y \right) \mid x ^{ 2 } + y ^{ 2 } \leqslant 1 \right\rbrace`,
  },
  {
    i: '|a, b; c, d|',
    o: $_`\left| \begin{array}{cc} a & b \\ c & d \end{array} \right|`,
  },
  {
    i: '|x| = { x, if x > 0; -x, otherwise :}',
    o: $_`\left| x \right| = \left\lbrace \begin{array}{ll} x & \text{if}\quad x > 0 \\ - x & \text{otherwise}\quad \end{array} \right.`,
  },
  {
    i: 'e^-x',
    o: $_`e ^{ {-x } }`,
  },
  {
    i: 'e^-(x^-2+y^2)',
    o: $_`e ^{ {-\left( x ^{ {-2 } } + y ^{ 2 } \right) } }`,
  },
  {
    i: '-(a+b-c)/2',
    o: $_`- \frac{ a + b - c }{ 2 }`,
  },
  {
    i: 'f\'_(+) (x)',
    o: $_`f ^{\prime} _{ + } \left( x \right)`,
  },
  {
    i: 'a^2 choose b^2',
    o: $_`{ a ^{ 2 } \choose b ^{ 2 } }`,
  },
  {
    i: 'n!',
    o: $_`{n !}`,
  },
  {
    i: 'n!!^2/2!',
    o: $_`\frac{ {n !!} ^{ 2 } }{ {2 !} }`,
  },
  {
    i: '|__x__|',
    o: $_`\left\lfloor x \right\rfloor`,
  },
  // matrix examples
  {
    i: '[ ]',
    o: $_`\left[ \right]`,
  },
  {
    i: '[1]',
    o: $_`\left[ 1 \right]`,
  },
  {
    i: '[1,]',
    o: $_`\left[ 1 , \right]`,
  },
  {
    i: '[1;]',
    o: $_`\left[ \begin{array}{c} 1 \end{array} \right]`,
  },
  {
    i: '[1, 2]',
    o: $_`\left[ 1 , 2 \right]`,
  },
  {
    i: '[1, 2; 3]',
    o: $_`\left[ \begin{array}{cc} 1 & 2 \\ 3 \end{array} \right]`,
  },
  {
    i: '[1, 2; ,3]',
    o: $_`\left[ \begin{array}{cc} 1 & 2 \\  & 3 \end{array} \right]`,
  },
  {
    i: '[1, 2;]',
    o: $_`\left[ \begin{array}{cc} 1 & 2 \end{array} \right]`,
  },

  {
    i: '| |',
    o: $_`\left| \right|`,
  },
  {
    i: '|1|',
    o: $_`\left| 1 \right|`,
  },
  {
    i: '|1,|',
    o: $_`\left| 1 , \right|`,
  },
  {
    i: '|1;|',
    o: $_`\left| \begin{array}{c} 1 \end{array} \right|`,
  },
  {
    i: '|1, 2|',
    o: $_`\left| 1 , 2 \right|`,
  },
  {
    i: '|1, 2; 3|',
    o: $_`\left| \begin{array}{cc} 1 & 2 \\ 3 \end{array} \right|`,
  },
  {
    i: '|1, 2; ,3|',
    o: $_`\left| \begin{array}{cc} 1 & 2 \\  & 3 \end{array} \right|`,
  },
  {
    i: '|1, 2;|',
    o: $_`\left| \begin{array}{cc} 1 & 2 \end{array} \right|`,
  },

  {
    i: '[1, 2 | 3; 4, 5 | 6]',
    o: $_`\left[ \begin{array}{cc|c} 1 & 2 & 3 \\ 4 & 5 & 6 \end{array} \right]`,
  },
  {
    i: '[1, 2 | 3; 4 | 5, 6]',
    o: $_`\left[ \begin{array}{c|c|c} 1 & 2 & 3 \\ 4 & 5 & 6 \end{array} \right]`,
  },
  {
    i: '[a, b; [1, 2; 3, 4], d]',
    o: $_`\left[ \begin{array}{cc} a & b \\ \left[ \begin{array}{cc} 1 & 2 \\ 3 & 4 \end{array} \right] & d \end{array} \right]`,
  },
  {
    i: '[|a, b; c,d]',
    o: $_`\left[ \begin{array}{|cc} a & b \\ c & d \end{array} \right]`,
  },
  {
    i: '[a, b|; c,d]',
    o: $_`\left[ \begin{array}{cc|} a & b \\ c & d \end{array} \right]`,
  },
  {
    i: '[|a, b|; c,d]',
    o: $_`\left[ \begin{array}{|cc|} a & b \\ c & d \end{array} \right]`,
  },
  {
    i: '[|hline 1| 2|; hline 3, 4; hline]',
    o: $_`\left[ \begin{array}{|c|c|} \hline 1 & 2 \\ \hline 3 & 4 \\ \hline \end{array} \right]`,
  },
  {
    i: '==^b_a',
    o: '\\xlongequal[ a ]{ b }',
  },
  {
    i: '-->^114_5',
    o: '\\xrightarrow[ 5 ]{ 114 }',
  },
  {
    i: '==^b',
    o: '\\xlongequal[  ]{ b }',
  },
  {
    i: '==_a',
    o: '\\xlongequal[ a ]{  }',
  },
  {
    i: '& 1111\n\n& 2222',
    o: $_`\begin{aligned}& 1111 \\ & 2222\end{aligned}`,
  },
  {
    i: 'hline\na && 111 && 333\n\nhline\nb && 222\n\nhline',
    o: $_`\begin{aligned}\hline a && 111 && 333 \\ \hline b && 222 \\ \hline\end{aligned}`,
  },
  {
    i: '[hline|a|b|;]',
    o: $_`\left[ \begin{array}{|c|c|} \hline a & b \end{array} \right]`,
  },
  {

    i: '{:\n--\n|a|b|;\n--\nc, d;\n--\n:}',
    o: $_`\left. \begin{array}{|c|c|} \hline a & b \\ \hline c & d \\ \hline \end{array} \right.`,
  },
  {
    i: '\uD83D\uDC40',
    o: '\uD83D\uDC40',
  },
  {
    i: '🍎/(🍌+🍍) + 🍌/(🍍+🍎) + 🍍/(🍎+🍌) = 4',
    o: $_`\frac{ 🍎 }{ 🍌 + 🍍 } + \frac{ 🍌 }{ 🍍 + 🍎 } + \frac{ 🍍 }{ 🍎 + 🍌 } = 4`,
  },
  {
    i: $_`"\"`,
    o: $_`\text{\}`,
  },
  {
    i: $_`"some text and \ backslashes \ a"`,
    o: $_`\text{some text and \ backslashes \ a}`,
  },
]

describe('examples provided by zmx0142857', () => {
  const am = new AsciiMath({ display: false })
  it('should match examples', () => {
    examples.forEach(({ i, o }) => {
      expect(am.toTex(i)).toBe(o)
    })
  })
})
