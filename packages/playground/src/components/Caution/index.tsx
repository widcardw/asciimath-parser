import type { Component } from 'solid-js'
import { i18nFactory } from '~/i18n'

const Caution: Component = () => {
  const { t } = i18nFactory()
  return (
    <>
      <h2>{t('usageScenario.title')}</h2>
      <ul>
        <li innerHTML={t('usageScenario.web')}></li>
        <li innerHTML={t('usageScenario.obsidian')}></li>
      </ul>
      <h2>{t('caution.title')}</h2>
      <p innerHTML={t('caution.message')} />
    </>
  )
}

export {
  Caution,
}
