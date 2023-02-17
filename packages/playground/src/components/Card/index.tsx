import type { Component } from 'solid-js'
import { createMemo, createSignal } from 'solid-js'
import { useDebounceFn } from 'solidjs-use'
import katex from 'katex'
import type { AsciiMath } from '@am'
import './index.css'
import { i18nFactory } from '~/i18n'

const Card: Component<{
  am: AsciiMath
}> = (props) => {
  const [amStr, setAmStr] = createSignal('')
  const [tex, setTex] = createSignal('')
  const kHtml = createMemo(() => katex.renderToString(tex(), {
    displayMode: true,
    throwOnError: false,
  }))
  const { t } = i18nFactory()

  function inputAmCb(e: Event) {
    setAmStr((e.target as HTMLTextAreaElement).value)
    setTex(props.am.toTex(amStr()))
  }

  function inputTexCb(e: Event) {
    setTex((e.target as HTMLTextAreaElement).value)
  }

  return (
    <div class="card">
      <textarea
        class="input-area"
        placeholder={t('inputAm')}
        onInput={useDebounceFn(inputAmCb, 800)}
      />
      <textarea
        class="input-area"
        placeholder={t('inputTex')}
        value={tex()}
        onInput={useDebounceFn(inputTexCb, 800)}
      />
      {/* eslint-disable-next-line solid/no-innerhtml */}
      <div class="display" innerHTML={kHtml()} />
    </div>
  )
}

export {
  Card,
}
