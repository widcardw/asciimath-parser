import type { Component } from 'solid-js'
import { For } from 'solid-js'
import { AsciiMath } from '@am'
import { CardList } from './components/CardList'

import {
  arrows, fonts, logic, mathFn, operators,
  others, parens, rela, special, subp, updown, xila,
} from './utils/symbols'
import { SymbolTable } from './components/SymbolTable'
import { ExampleTable } from './components/ExampleTable'
import { i18nFactory } from './i18n'
import { Footer } from './components/Footer'
import { Caution } from './components/Caution'

const bandages = [
  { href: 'https://npmjs.com/package/asciimath-parser', src: 'https://img.shields.io/npm/v/asciimath-parser?color=a1b858&label=npm' },
  { href: 'https://npmjs.com/package/asciimath-parser-cli', src: 'https://img.shields.io/static/v1?label=npm&message=cli&color=orange' },
  { href: 'https://github.com/widcardw/asciimath-parser', src: 'https://img.shields.io/badge/GitHub-blue' },
]

const display = [
  { title: 'manual_list.parens', symbols: parens, cols: 4 },
  { title: 'manual_list.greek', symbols: xila, cols: 4 },
  { title: 'manual_list.operator', symbols: operators, cols: 4 },
  { title: 'manual_list.rela', symbols: rela, cols: 4 },
  { title: 'manual_list.logic', symbols: logic, cols: 4 },
  { title: 'manual_list.other', symbols: others, cols: 4 },
  { title: 'manual_list.mathFn', symbols: mathFn, cols: 4 },
  { title: 'manual_list.arrow', symbols: arrows, cols: 4 },
  { title: 'manual_list.font', symbols: fonts, cols: 4 },
  { title: 'manual_list.notation', symbols: subp, cols: 4 },
  { title: 'manual_list.superposition', symbols: updown, cols: 2 },
  { title: 'manual_list.special', symbols: special, cols: 2 },
]

const am = new AsciiMath()

const App: Component = () => {
  const { t } = i18nFactory()
  return (
    <main>
      <h1>Asciimath Parser</h1>
      <div class="space-x-1">
        <For each={bandages}>
          {b => (
            <a href={b.href} target="_blank"><img src={b.src} /></a>
          )}
        </For>
      </div>
      <CardList am={am} />
      <Caution />
      <h2>{t('examples')}</h2>
      <ExampleTable am={am} />
      <h2>{t('manual')}</h2>
      <For each={display}>
        {item => (
          <>
            <h3>{t(item.title)}</h3>
            <SymbolTable am={am} symbols={item.symbols} cols={item.cols} />
          </>
        )}
      </For>
      <Footer />
    </main>
  )
}

export default App
