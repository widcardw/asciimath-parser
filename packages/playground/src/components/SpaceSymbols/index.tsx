import type { Component } from 'solid-js'
import { For } from 'solid-js'
import { amcToDom } from '../../utils/am-to-dom'
import { t, titles } from '../../utils/i18n'
import { spaces } from '../../utils/symbols'

const SpaceSymbols: Component<{
  currentPage: string
}> = (props) => {
  return (
    <table>
      <thead>
        <tr>
          <td>{t(titles.output, props.currentPage)}</td>
          <td>{t(titles.code, props.currentPage)}</td>
          <td>{t(titles.width, props.currentPage)}</td>
        </tr>
      </thead>
      <tbody>
        <For each={Object.values(spaces)}>
          {s => (
            <tr>
              <td innerHTML={amcToDom(s.code)} />
              <td>{s.code}</td>
              <td>{s.width}</td>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  )
}

export {
  SpaceSymbols,
}
