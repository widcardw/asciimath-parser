import type { Component } from 'solid-js'
import { For } from 'solid-js'
import { amcToDom } from '../../utils/am-to-dom'
import type { OneExampleType } from '../../utils/symbols'
import { t, titles } from '../../utils/i18n'

const ExampleTable: Component<{
  examples: OneExampleType[]
  currentPage: string
}> = (props) => {
  return (
    <table>
      <thead>
        <tr>
          <td>{t(titles.theme, props.currentPage)}</td>
          <td>{t(titles.output, props.currentPage)}</td>
          <td>{t(titles.code, props.currentPage)}</td>
        </tr>
      </thead>
      <tbody>
        <For each={props.examples}>
          {example => (
            <tr>
              <td>{t(example.theme, props.currentPage)}</td>
              <td innerHTML={amcToDom(example.code)}></td>
              <td>{example.code}</td>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  )
}

export {
  ExampleTable,
}
