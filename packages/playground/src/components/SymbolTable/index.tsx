import type { Component } from 'solid-js'
import { For } from 'solid-js'
import type { AsciiMath } from '@am'
import { renderTex } from '~/utils/renerTex'

function arrayToMatrix<T>(arr: T[], cols: number) {
  const res = []
  for (let i = 0; i < arr.length; i += cols)
    res.push(arr.slice(i, i + cols))
  return res
}

const TableRow: Component<{
  am: AsciiMath
  symbols: string[]
}> = ({ am, symbols }) => {
  return (
    <tr>
      <For each={symbols}>
        {b => (
          <>
            <td class="tex tc" innerHTML={renderTex(am, b)}></td>
            <td class="tc">{b}</td>
          </>
        )}
      </For>
    </tr>
  )
}

const SymbolTable: Component<{
  am: AsciiMath
  symbols: string[]
  cols?: number
}> = ({ am, symbols, cols = 4 }) => {
  const symbolMatrix = arrayToMatrix(symbols, cols)
  return (
    <table>
      <For each={symbolMatrix}>
        {a => <TableRow am={am} symbols={a} />}
      </For>
    </table>
  )
}

export {
  SymbolTable,
}
