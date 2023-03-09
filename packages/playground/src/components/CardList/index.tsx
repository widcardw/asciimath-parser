import type { Component } from 'solid-js'
import { For, createSignal } from 'solid-js'
import { AsciiMath } from '../../asciimath'
import { Card } from '../Card'
import './index.css'

const CardList: Component = () => {
  const [items, setItems] = createSignal([0])
  const am = new AsciiMath()
  return (
    <>
      <For each={items()}>
        {(_item, i) => (
          <div class="mb-4 w-full flex-no">
            <Card am={am} />
            <button
              style={{ 'font-family': 'KaTeX_Main' }}
              onClick={() => setItems(p => [...p.slice(0, i()), ...p.slice(i() + 1)])}
            >-
            </button>
          </div>
        )}
      </For>
      <button
        class="w-full mb-1rem"
        onClick={() => setItems(p => [...p, Date.now()])}
        style={{ 'font-family': 'KaTeX_Main' }}
      >+
      </button>
    </>
  )
}

export {
  CardList,
}
