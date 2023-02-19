/* eslint-disable solid/no-innerhtml */
import type { Component } from 'solid-js'
import { Suspense } from 'solid-js'
import { highlight, languages } from 'prismjs'
import { i18nFactory } from '~/i18n'
import { version } from '~/../package.json'
import './highlight.css'

const installCode = `pnpm install asciimath-parser${version.includes('beta') ? `@${version}` : ''}`
const jsCode = `import { AsciiMath } from 'asciimath-parser'
const am = new AsciiMath()
console.log(am.toTex('sum_1^(+oo)1/n^2=pi^2/6'))
// \\displaystyle{ \\sum _{ n = 1 } ^{ + \\infty } \\frac{ 1 }{ n ^{ 2 } } = \\frac{ \\pi ^{ 2 } }{ 6 } }`

const Caution: Component = () => {
  const { t } = i18nFactory()
  return (
    <>
      <h2>{t('how2use.title')}</h2>
      <p innerHTML={t('how2use.install')} />
      <pre>{installCode}</pre>
      <p innerHTML={t('how2use.import')} />
      <pre innerHTML={highlight(jsCode, languages.js, 'javascript')} />
      <h2>{t('useStory.title')}</h2>
      <ul>
        <li innerHTML={t('useStory.web')} />
        <li innerHTML={t('useStory.obsidian')} />
        <li innerHTML={t('useStory.cli')} />
      </ul>
      <h2>{t('caution.title')}</h2>
      <ul>
        <li innerHTML={t('caution.diff')} />
        <li innerHTML={t('caution.deps')} />
      </ul>
    </>
  )
}

export {
  Caution,
}
