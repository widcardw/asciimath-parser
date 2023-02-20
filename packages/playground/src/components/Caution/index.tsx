/* eslint-disable solid/no-innerhtml */
import type { Component } from 'solid-js'
import type { AsciiMath } from '@am'
import { highlight, languages } from 'prismjs'
import { i18nFactory } from '~/i18n'
import { version } from '~/../package.json'
import './highlight.css'

const installCode = `pnpm install asciimath-parser${version.includes('beta') ? `@${version}` : ''}`

const Caution: Component<{
  am: AsciiMath
// eslint-disable-next-line solid/no-destructure
}> = ({ am }) => {
  const { t } = i18nFactory()
  const f = 'sum_(n=1)^(+oo)1/n^2=pi^2/6'
  const jsCode = `import { AsciiMath } from 'asciimath-parser'
const am = new AsciiMath()
console.log(am.toTex('${f}'))
// ${am.toTex(f)}`
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
