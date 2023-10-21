import type { Component } from 'solid-js'
import { For, Show, createMemo, createSignal } from 'solid-js'
import { useStorage } from 'solidjs-use'
import { amc, amn } from '../../asciimath'
import { Card } from '../Card'
import './index.css'

const Badge: Component = () => {
  return (
    <div style={{
      'color': 'var(--theme-accent)',
      'font-size': '0.5rem',
      'margin-top': '-0.5rem',
      'background-color': 'var(--theme-bg-accent)',
      'padding': '0.1rem 0.4rem',
      'border-radius': '999px',
    }}
    >
      Beta
    </div>
  )
}

const CardList: Component = () => {
  const [items, setItems] = createSignal([0])
  const selection = {
    Core: { isBeta: false, am: amc },
    Nearley: { isBeta: false, am: amn },
  }
  type CoreType = keyof typeof selection
  const cores = Object.keys(selection) as CoreType[]
  const [currentCore, setCurrentCore] = useStorage<CoreType>('current-core', 'Core')
  const am = createMemo(() => selection[currentCore()].am)
  return (
    <>
      <div class="flex space-x-2 mb-2">
        <For each={cores}>
          {core => (
            <button
              classList={{ 'core-activated': currentCore() === core }}
              onClick={() => setCurrentCore(core)}
            >
              {core}
              <Show when={selection[core].isBeta}>
                <Badge />
              </Show>
            </button>
          )}
        </For>
        {/* <div style={{ flex: 1 }} />
        <div style={{ opacity: 0.5 }}><kbd>⌘</kbd> <kbd>K</kbd> to copy</div> */}
      </div>
      <For each={items()}>
        {(_item, i) => (
          <div class="mb-4 w-full flex-no">
            <Card am={am()} />
            <button
              style={{ 'font-family': 'KaTeX_Main' }}
              onClick={() => setItems(p => [...p.slice(0, i()), ...p.slice(i() + 1)])}
            >
              -
            </button>
          </div>
        )}
      </For>
      <button
        class="w-full mb-1rem"
        onClick={() => setItems(p => [...p, Date.now()])}
        style={{ 'font-family': 'KaTeX_Main' }}
      >
        +
      </button>
    </>
  )
}

export {
  CardList,
}
