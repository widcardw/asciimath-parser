import type { TitleType } from './symbols'

type I18nType = Record<string, TitleType>

const titles: I18nType = {
  examples: {
    zh: '样例',
    en: 'Examples',
  },
  manual: {
    zh: '符号对照手册',
    en: 'Manual',
  },
  theme: {
    zh: '主题',
    en: 'Theme',
  },
  output: {
    zh: '输出',
    en: 'output',
  },
  code: {
    zh: '源码',
    en: 'source',
  },
  display: {
    zh: '使用 <code>#</code> 来插入 <code>\displaystyle</code>',
    en: 'Use <code>#</code> to insert <code>\displaystyle</code>',
  },
  width: {
    zh: '宽度',
    en: 'width',
  },
  spaces: {
    zh: '空白',
    en: 'Spaces',
  },
}

function t(title: TitleType, currentPage: string) {
  let lang = currentPage.split('/')[1] || 'en'
  if (lang !== 'zh')
    lang = 'en'
  return title[lang as keyof TitleType]
}

export type {
  I18nType,
}
export {
  titles,
  t,
}
