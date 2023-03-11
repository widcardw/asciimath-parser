import type { Component } from 'solid-js'
import { createMemo, createSignal } from 'solid-js'
import { useDebounceFn } from 'solidjs-use'
import katex from 'katex'
import type { AsciiMathCore, AsciiMathNearley } from '../../asciimath'
import './index.css'

const Card: Component<{
  am: AsciiMathCore | AsciiMathNearley
}> = (props) => {
  const [amStr, setAmStr] = createSignal('')
  const [tex, setTex] = createSignal('')
  const kHtml = createMemo(() => katex.renderToString(tex(), {
    displayMode: true,
    throwOnError: false,
  }))

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
        placeholder="Input Asciimath here"
        onInput={useDebounceFn(inputAmCb, 800)}
      />
      <textarea
        class="input-area"
        placeholder="Input KaTeX here"
        value={tex()}
        onInput={useDebounceFn(inputTexCb, 800)}
      />
      <div class="display" innerHTML={kHtml()} />
    </div>
  )
}

export {
  Card,
}
