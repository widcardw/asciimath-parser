import type { Component } from 'solid-js'
import { For } from 'solid-js'
import { amcToDom } from '../../utils/am-to-dom'
import { t, titles } from '../../utils/i18n'

function splitSymbols(symbols: string[], cols: number) {
  const res: string[][] = []
  for (let i = 0; i < symbols.length; i += cols)
    res.push(symbols.slice(i, i + cols))

  return res
}

const SymbolRow: Component<{
  symbols: string[]
}> = (props) => {
  return (
    <tr>
      <For each={props.symbols}>
        {s => (
          <>
            <td style={{ 'text-align': 'center' }} innerHTML={amcToDom(s)} />
            <td style={{ 'text-align': 'center' }}>{s}</td>
          </>
        )}
      </For>
    </tr>
  )
}

const SymbolTable: Component<{
  symbols: string[]
  cols: number
  currentPage: string
}> = (props) => {
  const matSymbols = splitSymbols(props.symbols, props.cols)
  return (
    <table>
      <thead>
        <For each={Array.from({ length: props.cols })}>
          {() => (
            <>
              <td style={{ 'text-align': 'center' }}>{t(titles.output, props.currentPage)}</td>
              <td style={{ 'text-align': 'center' }}>{t(titles.code, props.currentPage)}</td>
            </>
          )}
        </For>
      </thead>
      <tbody>
        <For each={matSymbols}>
          {symbols => <SymbolRow symbols={symbols} />}
        </For>
      </tbody>
    </table>
  )
}

export {
  SymbolTable,
}
