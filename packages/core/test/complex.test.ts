import { describe, expect, it } from 'vitest'
import { codegen } from '../src/codegen'
import { parser } from '../src/parser'
import { createTrie } from '../src/trie'
import { dedent } from 'ts-dedent'
import { type PR, removeTex } from './utils/remove-position'
import { removeValue } from './utils/removeValue'
import { $_ } from './utils/string-raw'

describe('obsidian-asciimath #26', () => {
  it('should not fall into infinite loop', () => {
    const formula = dedent`
        {EE cc P_4 in RR[X] \\; "t.q." \\; AA n in NN, D_(cc L_1)(n)*D_(cc L_2)(n) 

        <= (cc P_4(n))^2 = cc P_5 in RR[X]; :}`

    const trie = createTrie()
    const tokens = trie.tryParsingAll(formula)
    const ast = parser(tokens)
    const output = codegen(ast)
    expect(removeTex(tokens)).toMatchSnapshot()
    expect(removeValue(ast)).toMatchSnapshot()
    expect(output).toBe($_`\left\lbrace \begin{array}{ll} \exists \mathcal{ P } _{ 4 } \in \mathbb{R} \left[ X \right] \; \text{t.q.} \; \forall n \in \mathbb{N} & D _{ \mathcal{ L } _{ 1 } } \left( n \right) \cdot D _{ \mathcal{ L } _{ 2 } } \left( n \right) \\ \leqslant \left( \mathcal{ P } _{ 4 } \left( n \right) \right) ^{ 2 } = \mathcal{ P } _{ 5 } \in \mathbb{R} \left[ X \right] \end{array} \right.`)
  })
})
