import { getLocaleFromNavigator, init, register } from 'svelte-i18n'

register('en', () => import('./en.json'))
register('zh-CN', () => import('./zh.json'))
// en, en-US and pt are not available yet

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
})
