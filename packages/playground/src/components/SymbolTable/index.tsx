/* eslint-disable solid/no-innerhtml */
import type { Component } from 'solid-js'
import { For, mergeProps } from 'solid-js'
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
}> = (props) => {
  return (
    <tr>
      <For each={props.symbols}>
        {b => (
          <>
            <td class="tex tc" innerHTML={renderTex(props.am, b)} />
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
}> = (_props) => {
  const props = mergeProps({ cols: 4 }, _props)
  // eslint-disable-next-line solid/reactivity
  const symbolMatrix = arrayToMatrix(props.symbols, props.cols)
  return (
    <table>
      <For each={symbolMatrix}>
        {a => <TableRow am={props.am} symbols={a} />}
      </For>
    </table>
  )
}

export {
  SymbolTable,
}
