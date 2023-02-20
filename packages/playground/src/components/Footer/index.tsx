/* eslint-disable solid/no-innerhtml */
import type { Component } from 'solid-js'
import { i18nFactory } from '~/i18n'
import './index.css'

const Footer: Component = () => {
  const { t } = i18nFactory()
  return (
    <>
      <h2>{t('thanks.title')}</h2>
      <p innerHTML={t('thanks.content')} />
      <h2>{t('reportIssue.title')}</h2>
      <p innerHTML={t('reportIssue.content')} />
      <footer>
        <span class="op-70">Playground made with </span><a href="https://solidjs.com">Solidjs</a>
        &nbsp;&nbsp;&nbsp;
        <span class="op-70">Deploys on </span><a href="https://netlify.app">Netlify</a>
      </footer>
    </>
  )
}

export {
  Footer,
}
