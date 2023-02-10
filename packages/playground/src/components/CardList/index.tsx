import type { Component } from 'solid-js'
import { For, createSignal } from 'solid-js'
import type { AsciiMath } from '@am'
import { Card } from '../Card'

const CardList: Component<{
  am: AsciiMath
}> = ({ am }) => {
  const [items, setItems] = createSignal([0])
  return (
    <>
      <For each={items()}>
        {(item, i) => (
          <div class="mb-4 w-full flex">
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
        style="font-family: KaTeX_Main"
      >+
      </button>
    </>
  )
}

export {
  CardList,
}
