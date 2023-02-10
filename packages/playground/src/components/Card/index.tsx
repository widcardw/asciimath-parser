import type { Component } from 'solid-js'
import { createMemo, createSignal } from 'solid-js'
import katex from 'katex'
import type { AsciiMath } from '@am'
import { throttle } from '~/utils/throttle'
import './index.css'
import { i18nFactory } from '~/i18n'

const Card: Component<{
  am: AsciiMath
}> = ({ am }) => {
  const [amStr, setAmStr] = createSignal('')
  const [tex, setTex] = createSignal('')
  const kHtml = createMemo(() => katex.renderToString(tex(), {
    displayMode: true,
    throwOnError: false,
  }))
  const { t } = i18nFactory()

  function inputAmCb(e: Event) {
    setAmStr((e.target as HTMLTextAreaElement).value)
    setTex(am.toTex(amStr()))
  }

  function inputTexCb(e: Event) {
    setTex((e.target as HTMLTextAreaElement).value)
  }

  return (
    <div class="card">
      <textarea
        class="input-area"
        placeholder={t('inputAm')}
        onInput={throttle(inputAmCb, 800)}
      />
      <textarea
        class="input-area"
        placeholder={t('inputTex')}
        value={tex()}
        onInput={throttle(inputTexCb, 800)}
      />
      <div class="display" innerHTML={kHtml()}></div>
    </div>
  )
}

export {
  Card,
}
