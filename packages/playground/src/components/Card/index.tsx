import type { Component } from 'solid-js'
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js'
import { useDebounceFn } from 'solidjs-use'
import katex from 'katex'
import { EditorView } from 'codemirror'
import { placeholder } from '@codemirror/view'
import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import type { AsciiMathCore, AsciiMathNearley } from '../../asciimath'
import { myCompletion } from './getCompletion'

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
  // const [amCopied, setAmCopied] = createSignal(false)
  // const [texCopied, setTexCopied] = createSignal(false)
  const kHtml = createMemo(() => katex.renderToString(tex(), {
    displayMode: true,
    throwOnError: false,
  }))

  // const asciiCompletion = getCompletion()
  const [el1, setEl1] = createSignal<HTMLDivElement>()
  const [el2, setEl2] = createSignal<HTMLDivElement>()
  let amEditor: EditorView | null = null
  let texEditor: EditorView | null = null

  const amStrUpdated = useDebounceFn(() => {
    setAmStr(amEditor?.state.doc.toString() || '')
    setTex(props.am.toTex(amStr()))
    texEditor?.dispatch({
      changes: { from: 0, to: texEditor.state.doc.length, insert: tex() },
    })
  }, 1000)

  createEffect(async () => {
    if (!amEditor) {
      amEditor = new EditorView({
        parent: el1(),
        extensions: [
          autocompletion({ override: [await myCompletion()], maxRenderedOptions: 10 }),
          // closeBrackets(),
          placeholder('Input asciimath here...'),
          EditorView.lineWrapping,
          EditorView.updateListener.of((update) => {
            if (!update.changes.empty)
              amStrUpdated()
          }),
        ],
        // dispatch: (tr) => {
        //   amEditor?.update([tr])
        //   if (!tr.changes.empty && tr.isUserEvent('input.type'))
        //     console.log(tr)
        // },
      })
    }

    if (!texEditor) {
      texEditor = new EditorView({
        parent: el2(),
        extensions: [
          closeBrackets(),
          EditorView.lineWrapping,
          placeholder('Input KaTeX here...'),
        ],
      })
    }
  })

  // function inputAmCb(e: Event) {
  //   setAmStr((e.target as HTMLTextAreaElement).value)
  //   setTex(props.am.toTex(amStr()))
  // }

  // function inputTexCb(e: Event) {
  //   setTex((e.target as HTMLTextAreaElement).value)
  // }

  // function keydownHandler(e: TextAreaKeydownEvent) {
  //   if (e.isComposing)
  //     return false
  //   if (e.code === 'KeyK' && e.metaKey) {
  //     window.navigator.clipboard.writeText((e.target as HTMLTextAreaElement).value)
  //     return true
  //   }
  //   return false
  // }

  // function keydownHandlerAm(e: TextAreaKeydownEvent) {
  //   if (keydownHandler(e)) {
  //     setAmCopied(true)
  //     setTimeout(() => {
  //       setAmCopied(false)
  //     }, 1000)
  //   }
  // }

  // function keydownHandlerTex(e: TextAreaKeydownEvent) {
  //   if (keydownHandler(e)) {
  //     setTexCopied(true)
  //     setTimeout(() => {
  //       setTexCopied(false)
  //     }, 1000)
  //   }
  // }

  onCleanup(() => {
    amEditor?.destroy()
    texEditor?.destroy()
  })

  return (
    <div class="card">
      <div style={{ position: 'relative' }}>
        {/* <textarea
          class="input-area"
          placeholder="Input Asciimath here"
          onInput={useDebounceFn(inputAmCb, 800)}
          onKeyDown={keydownHandlerAm}
        />
        {amCopied() && <div class="copied">Copied!</div>} */}
        <div class="input-area" ref={r => setEl1(r)} />
      </div>
      <div style={{ position: 'relative' }}>
        {/* <textarea
          class="input-area"
          placeholder="Input KaTeX here"
          value={tex()}
          onInput={useDebounceFn(inputTexCb, 800)}
          onKeyDown={keydownHandlerTex}
        />
        {texCopied() && <div class="copied">Copied!</div>} */}
        <div class="input-area" ref={r => setEl2(r)} />
      </div>
      <div class="display" innerHTML={kHtml()} />
    </div>
  )
}

export {
  Card,
}
