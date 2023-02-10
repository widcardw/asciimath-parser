import en from './en.json'
import zh from './zh.json'
import { useLanguage } from '~/utils/useLanguage'

class I18n {
  lngs: Record<string, any>
  lng: string
  constructor() {
    this.lngs = { en, 'zh-CN': zh }
    this.lng = useLanguage() || 'en'
    this.t = this.t.bind(this)
  }

  t(key: string, fallback?: string): string {
    const keys = key.split('.')
    const res = keys.reduce((prev, curr) => {
      return (prev && prev[curr]) || fallback
    }, this.lngs[this.lng])
    return res || key
  }
}

function i18nFactory() {
  const i18n = new I18n()
  return i18n
}

export {
  i18nFactory,
}
