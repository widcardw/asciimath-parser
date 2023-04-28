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
  const [mathml, setMathml] = createSignal('')
  const kHtml = createMemo(() => katex.renderToString(tex(), {
    displayMode: true,
    throwOnError: false,
  }))

  function inputAmCb(e: Event) {
    setAmStr((e.target as HTMLTextAreaElement).value)
    setTex(props.am.toTex(amStr()))
    if ((props.am as AsciiMathNearley).toMathML)
      setMathml((props.am as AsciiMathNearley).toMathML(amStr()).toString())
  }

  function inputTexCb(e: Event) {
    setTex((e.target as HTMLTextAreaElement).value)
  }

  function inputMathmlCb(e: Event) {
    setMathml((e.target as HTMLTextAreaElement).value)
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
      <textarea
        class="input-area"
        rows="4"
        placeholder="Input MathML here"
        value={mathml()}
        onInput={useDebounceFn(inputMathmlCb, 800)}
      />
      <div class="display" data-caption="KaTeX Output" innerHTML={kHtml()} />
      <div class="display" data-caption="MathML Output" innerHTML={mathml()} />
    </div>
  )
}

export {
  Card,
}
