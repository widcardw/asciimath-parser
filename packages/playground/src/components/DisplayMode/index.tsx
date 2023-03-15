import type { Component } from 'solid-js'
import { amcToDom } from '../../utils/am-to-dom'
import { t, titles } from '../../utils/i18n'
import { displaySymbol } from '../../utils/symbols'

const DisplayMode: Component<{
  currentPage: string
}> = (props) => {
  return (
    <table>
      <thead>
        <tr>
          <td style={{ 'text-align': 'center' }}>{t(titles.output, props.currentPage)}</td>
          <td style={{ 'text-align': 'center' }}>{t(titles.code, props.currentPage)}</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ 'text-align': 'center' }} innerHTML={amcToDom(displaySymbol.symbol)}></td>
          <td style={{ 'text-align': 'center' }}>{displaySymbol.symbol}</td>
        </tr>
      </tbody>
    </table>
  )
}

export {
  DisplayMode,
}
