interface Example {
  input: string
  tex: string
  mathml?: string
  desc?: string
}

const $ = String.raw

const passedExamples: Example[] = [
  { input: '    ', tex: '' },
  { input: ' a', tex: 'a' },
  { input: '+', tex: '+' },
  { input: 'pi', tex: '\\pi' },
  { input: '1+2+3', tex: '1 + 2 + 3' },
  { input: '1+-2', tex: '1 \\pm 2' },
  { input: '(1+2]', tex: '\\left(1 + 2\\right]' },
  { input: 'sin 11_4^514 19^19_8 1_0', tex: '\\sin 11_4^{ 514 } 19_8^{ 19 } 1_0' },
  { input: '[a;b;c]', tex: '\\left[\\begin{array}{c}a \\\\ b \\\\ c\\end{array}\\right]' },
  { input: '[a, b; c, d;:}', tex: '\\left[\\begin{array}{cc}a & b \\\\ c & d \\\\ \\end{array}\\right.' },
  { input: 'sqrt x', tex: '\\sqrt{ x }' },
  { input: 'sqrt (x)', tex: '\\sqrt{ x }' },
  { input: 'root 3 2.0', tex: '\\sqrt[ 3 ]{ 2.0 }' },
  { input: 'root [3)  {:2.0}', tex: '\\sqrt[ 3 ]{ 2.0 }' },
  { input: 'sum_(n=1)^(+oo) 1/n^2 = pi^2/6', tex: '\\sum_{ n = 1 }^{ + \\infty } \\frac{ 1 }{ n^2 } = \\frac{ \\pi^2 }{ 6 }' },
  { input: 'a_1^2 + b_1^2 = c_1^2', tex: 'a_1^2 + b_1^2 = c_1^2' },
  { input: 'a/b, a//b', tex: '\\frac{ a }{ b } , a {/} b' },
  { input: 'sqrt n, root n x, a^2/sqrt b', tex: '\\sqrt{ n } , \\sqrt[ n ]{ x } , \\frac{ a^2 }{ \\sqrt{ b } }' },
  { input: 'lim_(n->oo) (1 + 1/n)^n', tex: '\\lim_{ n \\to \\infty } \\left(1 + \\frac{ 1 }{ n }\\right)^n' },
  { input: 'sin {: x/2 :}', tex: '\\sin \\left.\\frac{ x }{ 2 }\\right.' },
  { input: 'int_a^b f(x) dx', tex: '\\int_a^b f \\left(x\\right) {\\text{d}x}' },
  { input: '(del f)/(del x), (del^3 f)/(del x del y^2)', tex: '\\frac{ \\partial f }{ \\partial x } , \\frac{ \\partial^3 f }{ \\partial x \\partial y^2 }' },
  { input: 'frac a b', tex: '\\frac{ a }{ b }' },
  { input: '"hello world"', tex: '\\text{hello world}' },
  { input: 'color "red"  abc', tex: '{ \\color{red} a } b c' },
  { input: 'hspace "12pt"', tex: '\\hspace{12pt}' },
  { input: 'tex "\\LaTeX"', tex: '{ \\LaTeX }' },
  { input: '""', tex: '\\text{}' },
  { input: 'dy/dx, ("d"r)/("d"theta), f\'\'(x)', tex: '\\frac{ {\\text{d}y} }{ {\\text{d}x} } , \\frac{ \\text{d} r }{ \\text{d} \\theta } , f ^{\\prime\\prime} \\left(x\\right)' },
  { input: 'ddfx , dd^2 f x , ddot x', tex: '\\frac{ \\text{d} f }{ \\text{d} x } , \\frac{ \\text{d}^2 f }{ \\text{d} x^2 } , \\ddot{ x }' },
  { input: 'ppfx', tex: '\\frac{ \\partial f }{ \\partial x }' },
  { input: 'pp {::} x', tex: '\\frac{ \\partial  }{ \\partial x }' },
  { input: 'pp^3 f (x y^2)', tex: '\\frac{ \\partial^3 f }{ \\partial x\\partial y^2 }' },
  { input: 'dd^2 (bm r) s', tex: $`\frac{ \text{d}^2 \boldsymbol{ r } }{ \text{d} s^2 }` },
  { input: 'abs(x)', tex: '\\left|x\\right|' },
  { input: '{ a | b }', tex: '\\left\\lbrace{}a \\mid b\\right\\rbrace' },
  { input: '(a,b)', tex: '\\left(a, b\\right)' },
  { input: '{(x,y)|x^2+y^2<=1}', tex: '\\left\\lbrace{}\\left(x, y\\right) \\mid x^2 + y^2 \\leqslant 1\\right\\rbrace' },
  { input: '|a, b; c, d|', tex: '\\left|\\begin{array}{cc}a & b \\\\ c & d\\end{array}\\right|' },
  { input: '|x| = { x, if x > 0; -x, otherwise :}', tex: '\\left|x\\right| = \\left\\lbrace{}\\begin{array}{ll}x & \\text{if\\quad} x > 0 \\\\ - x & \\text{otherwise\\quad}\\end{array}\\right.' },
  { input: 'e^-x', tex: 'e^{ -x }' },
  { input: 'e^-(x^-2+y^2)', tex: 'e^{ -\\left(x^{ -2 } + y^2\\right) }' },
  { input: '-(a+b-c)/2', tex: '- \\frac{ a + b - c }{ 2 }' },
  { input: 'f\'_(+) (x)', tex: 'f ^{\\prime}_{ + } \\left(x\\right)' },
  { input: 'a^2 choose b^2', tex: '{ a^2 \\choose b^2 }' },
  { input: 'n!', tex: '{ n! }' },
  { input: 'n!!^2/2!', tex: '\\frac{ { n!! }^2 }{ { 2! } }' },
  { input: 'n_1!', tex: 'n_{ 1! }' },
  { input: '|__x__|', tex: '\\left\\lfloor{}x\\right\\rfloor' },
  // matrix examples
  { input: '[ ]', tex: '\\left[\\right]' },
  { input: '[1]', tex: '\\left[1\\right]' },
  { input: '[1,]', tex: '\\left[1, \\right]' },
  { input: '[1;]', tex: '\\left[\\begin{array}{c}1 \\\\ \\end{array}\\right]' },
  { input: '[1, 2]', tex: '\\left[1, 2\\right]' },
  { input: '[1, 2; 3]', tex: '\\left[\\begin{array}{cc}1 & 2 \\\\ 3\\end{array}\\right]' },
  { input: '[1, 2; ,3]', tex: '\\left[\\begin{array}{cc}1 & 2 \\\\  & 3\\end{array}\\right]' },
  { input: '[1, 2;]', tex: '\\left[\\begin{array}{cc}1 & 2 \\\\ \\end{array}\\right]' },

  { input: '| |', tex: '\\left|\\right|' },
  { input: '|1|', tex: '\\left|1\\right|' },
  { input: '|1,|', tex: '\\left|1, \\right|' },
  { input: '|1;|', tex: '\\left|\\begin{array}{c}1 \\\\ \\end{array}\\right|' },
  { input: '|1, 2|', tex: '\\left|1, 2\\right|' },
  { input: '|1, 2; 3|', tex: '\\left|\\begin{array}{cc}1 & 2 \\\\ 3\\end{array}\\right|' },
  { input: '|1, 2; ,3|', tex: '\\left|\\begin{array}{cc}1 & 2 \\\\  & 3\\end{array}\\right|' },
  { input: '|1, 2;|', tex: '\\left|\\begin{array}{cc}1 & 2 \\\\ \\end{array}\\right|' },

  { input: '[1, 2 | 3; 4, 5 | 6]', tex: '\\left[\\begin{array}{cc|c}1 & 2 & 3 \\\\ 4 & 5 & 6\\end{array}\\right]' },
  { input: '[1, 2 | 3; 4 | 5, 6]', tex: '\\left[\\begin{array}{c|c|c}1 & 2 & 3 \\\\ 4 & 5 & 6\\end{array}\\right]' },
  { input: '[a, b; [1, 2; 3, 4], d]', tex: '\\left[\\begin{array}{cc}a & b \\\\ \\left[\\begin{array}{cc}1 & 2 \\\\ 3 & 4\\end{array}\\right] & d\\end{array}\\right]' },
  { input: '[|a, b; c,d]', tex: '\\left[\\begin{array}{|cc}a & b \\\\ c & d\\end{array}\\right]' },
  { input: '[a, b|; c,d]', tex: '\\left[\\begin{array}{cc|}a & b \\\\ c & d\\end{array}\\right]' },
  { input: '[|a, b|; c,d]', tex: '\\left[\\begin{array}{|cc|}a & b \\\\ c & d\\end{array}\\right]' },
  { input: '[|hline 1| 2|; hline 3, 4; hline]', tex: '\\left[\\begin{array}{|c|c|}\\hline 1 & 2 \\\\ \\hline 3 & 4 \\\\ \\hline\\end{array}\\right]' },
  { input: '"\\\\abc"', tex: '\\text{\\abc}' },
  { input: '==^b_a', tex: '\\xlongequal[ a ]{ b }' },
  { input: '-->^114_5', tex: '\\xrightarrow[ 5 ]{ 114 }' },
  { input: '==^b', tex: '\\xlongequal[  ]{ b }' },
  { input: '==_a', tex: '\\xlongequal[ a ]{  }' },
  { input: '& 1111\n\n& 2222', tex: '\\begin{aligned}& 1111 \\\\ & 2222\\end{aligned}' },
  { input: 'hline\na && 111 && 333\n\nhline\nb && 222\n\nhline', tex: '\\begin{aligned}\\hline a && 111 && 333 \\\\ \\hline b && 222 \\\\ \\hline\\end{aligned}' },
  { input: '[hline|a|b|;]', tex: '\\left[\\begin{array}{|c|c|}\\hline a & b \\\\ \\end{array}\\right]' },
  {
    input: `{:
  --
  |a|b|;
  --
  c, d;
  --
:}`,
    tex: '\\left.\\begin{array}{|c|c|}\\hline a & b \\\\ \\hline c & d \\\\ \\hline\\end{array}\\right.',
  },
  { input: '\uD83D\uDC40', tex: '\uD83D\uDC40' },
  { input: '🍎/(🍌+🍍) + 🍌/(🍍+🍎) + 🍍/(🍎+🍌) = 4', tex: '\\frac{ 🍎 }{ 🍌 + 🍍 } + \\frac{ 🍌 }{ 🍍 + 🍎 } + \\frac{ 🍍 }{ 🍎 + 🍌 } = 4' },
  { input: 'verb"114514\n1919810"', tex: '\\begin{aligned}\n& \\verb|114514|\\\\\n& \\verb|1919810|\n\\end{aligned}' },
  { input: '"\\\\"', tex: '\\text{\\}' },
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
  },
  { input: '(a)!', tex: '{ \\left(a\\right)! }' }, // test op strip
  { input: '(n) choose (k) = n!/(n!(n-k)!)', tex: '{ n \\choose k } = \\frac{ { n! } }{ { n! } { \\left(n - k\\right)! } }' },
  { input: 'limits(theta)_(k=1)^K', tex: $`\mathop{ \theta }\limits_{ k = 1 }^K` },
  { input: 'limits(tex"\\Vert")_(k=1)^K', tex: $`\mathop{ { \Vert } }\limits_{ k = 1 }^K` },
  { input: '|a_n|/2', tex: $`\frac{ \left|a_n\right| }{ 2 }` },
  { input: '(|a|+|b|)', tex: $`\left(\left|a\right|+\left|b\right|\right)` },
  { input: '(|a|+|b|+|c)', tex: $`\left(\left|a\right|+\left|b\right|+ \mid c\right)` },
  { input: '(||a||+|b|+|c)', tex: $`\left(\left\|a\right\|+\left|b\right|+ \mid c\right)` },
  { input: '[a;b]/2', tex: $`\frac{ \begin{array}{c}a \\ b\end{array} }{ 2 }` }, // 脱去矩阵括号
  { input: '"abc"/2', tex: $`\frac{ \text{abc} }{ 2 }` }, // 不脱去引号
  { input: 'a\r\n', tex: 'a' },
  { input: '& a\r\n\r& b\n\r& c', tex: '\\begin{aligned}& a \\\\ & b \\\\ & c\\end{aligned}' },
  { input: 'a\t\v\f', tex: 'a' },
  { input: '==^"abc"', tex: '\\xlongequal[  ]{ \\text{abc} }' },
  { input: 'a | b', tex: 'a \\mid b' },
  { input: '|a| | b', tex: $`\left|a\right| \mid b` },
]

// no idea why this fails ˉ\_(ツ)_/ˉ
const whyThisFails: Example[] = [
  { input: '"\\"abc\\""', tex: '\\text{"abc"}' },
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
