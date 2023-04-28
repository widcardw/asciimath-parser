import type { Component } from 'solid-js'
import { createMemo, createSignal } from 'solid-js'
import { useDebounceFn } from 'solidjs-use'
import katex from 'katex'
import type { AsciiMathCore, AsciiMathNearley } from '../../asciimath'
import './index.css'

type TextAreaKeydownEvent = KeyboardEvent & {
  currentTarget: HTMLTextAreaElement
  target: Element
}

const Card: Component<{
  am: AsciiMathCore | AsciiMathNearley
}> = (props) => {
  const [amStr, setAmStr] = createSignal('')
  const [tex, setTex] = createSignal('')
  const [amCopied, setAmCopied] = createSignal(false)
  const [texCopied, setTexCopied] = createSignal(false)
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

  function keydownHandler(e: TextAreaKeydownEvent) {
    if (e.isComposing)
      return false
    if (e.code === 'KeyK' && e.metaKey) {
      window.navigator.clipboard.writeText((e.target as HTMLTextAreaElement).value)
      return true
    }
    return false
  }

  function keydownHandlerAm(e: TextAreaKeydownEvent) {
    if (keydownHandler(e)) {
      setAmCopied(true)
      setTimeout(() => {
        setAmCopied(false)
      }, 1000)
    }
  }

  function keydownHandlerTex(e: TextAreaKeydownEvent) {
    if (keydownHandler(e)) {
      setTexCopied(true)
      setTimeout(() => {
        setTexCopied(false)
      }, 1000)
    }
  }

  return (
    <div class="card">
      <div style={{ position: 'relative' }}>
        <textarea
          class="input-area"
          placeholder="Input Asciimath here"
          onInput={useDebounceFn(inputAmCb, 800)}
          onKeyDown={keydownHandlerAm}
        />
        {amCopied() && <div class="copied">Copied!</div>}
      </div>
      <div style={{ position: 'relative' }}>
        <textarea
          class="input-area"
          placeholder="Input KaTeX here"
          value={tex()}
          onInput={useDebounceFn(inputTexCb, 800)}
          onKeyDown={keydownHandlerTex}
        />
        {texCopied() && <div class="copied">Copied!</div>}
      </div>
      <div class="display" innerHTML={kHtml()} />
    </div>
  )
}

export {
  Card,
}
