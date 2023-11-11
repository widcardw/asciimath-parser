import type { Component } from 'solid-js'
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js'
import { useDebounceFn } from 'solidjs-use'
import katex from 'katex'
import { EditorView } from 'codemirror'
import { placeholder } from '@codemirror/view'
import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import { AsciiMathCore, AsciiMathNearley } from '../../asciimath'
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
  const [mathml, setMathml] = createSignal('')
  // const [amCopied, setAmCopied] = createSignal(false)
  // const [texCopied, setTexCopied] = createSignal(false)
  const kHtml = createMemo(() => katex.renderToString(tex(), {
    displayMode: true,
    throwOnError: false,
  }))

  // const asciiCompletion = getCompletion()
  const [el1, setEl1] = createSignal<HTMLDivElement>()
  const [el2, setEl2] = createSignal<HTMLDivElement>()
  const [el3, setEl3] = createSignal<HTMLDivElement>()
  let amEditor: EditorView | null = null
  let texEditor: EditorView | null = null
  let mathmlEditor: EditorView | null = null

  const amStrUpdated = useDebounceFn(() => {
    setAmStr(amEditor?.state.doc.toString() || '')
    setTex(props.am.toTex(amStr()))
    texEditor?.dispatch({
      changes: { from: 0, to: texEditor.state.doc.length, insert: tex() },
    })
    if (props.am instanceof AsciiMathNearley) {
      setMathml(props.am.toMathML(amStr()).toString())
      mathmlEditor?.dispatch({
        changes: { from: 0, to: mathmlEditor.state.doc.length, insert: mathml() },
      })
    }
  }, 1000)

  const texAreaUpdated = useDebounceFn(() => {
    setTex(texEditor?.state.doc.toString() || '')
  }, 1000)

  const mathmlAreaUpdated = useDebounceFn(() => {
    setMathml(mathmlEditor?.state.doc.toString() || '')
  }, 1000)

  createEffect(async () => {
    if (!amEditor) {
      amEditor = new EditorView({
        parent: el1(),
        extensions: [
          autocompletion({ override: [await myCompletion()], maxRenderedOptions: 10 }),
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
          EditorView.updateListener.of((update) => {
            if (!update.changes.empty)
              texAreaUpdated()
          }),
          // EditorView.inputHandler.of((view, from, to, text, insert) => {
          //   view.dispatch(insert())
          //   texAreaUpdated()
          //   return true
          // }),
        ],
      })
    }

    if (!mathmlEditor) {
      mathmlEditor = new EditorView({
        parent: el3(),
        extensions: [
          closeBrackets(),
          EditorView.lineWrapping,
          placeholder('Input MathML here...'),
          EditorView.updateListener.of((update) => {
            if (!update.changes.empty)
              mathmlAreaUpdated()
          }),
        ],
      })
    }
  })

  onCleanup(() => {
    amEditor?.destroy()
    texEditor?.destroy()
    mathmlEditor?.destroy()
  })

  return (
    <div class="card">
      {/* <textarea
        class="input-area"
        placeholder="Input Asciimath here"
        onInput={useDebounceFn(inputAmCb, 800)}
        onKeyDown={keydownHandlerAm}
      />
      {amCopied() && <div class="copied">Copied!</div>} */}
      <div class="input-area" ref={r => setEl1(r)} />
      {/* <textarea
        class="input-area"
        placeholder="Input KaTeX here"
        value={tex()}
        onInput={useDebounceFn(inputTexCb, 800)}
        onKeyDown={keydownHandlerTex}
      />
      {texCopied() && <div class="copied">Copied!</div>} */}
      <div class="input-area" ref={r => setEl2(r)} />
      <div class="input-area" ref={r => setEl3(r)} />
      <div class="display" innerHTML={kHtml()} />
      <div class="display" innerHTML={mathml()}></div>
    </div>
  )
}

export {
  Card,
}
