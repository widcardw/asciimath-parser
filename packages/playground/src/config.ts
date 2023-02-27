export const SITE = {
  title: 'Asciimath Parser',
  description: 'Write LaTeX faster!',
  defaultLanguage: 'en_US',
}

// This is the type of the frontmatter you put in the docs markdown files.
export interface Frontmatter {
  title: string
  description: string
  layout: string
  image?: { src: string; alt: string }
  dir?: 'ltr' | 'rtl'
  ogLocale?: string
  lang?: string
}

export const KNOWN_LANGUAGES = {
  English: 'en',
  中文: 'zh',
} as const
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES)

export type Sidebar = Record<
  typeof KNOWN_LANGUAGE_CODES[number],
  string
>
export const SIDEBAR: Sidebar = {
  en: 'en/introduction',
  zh: 'zh/introduction',
}
