function useLanguage() {
  if (typeof window === 'undefined')
    return undefined
  return window.navigator && window.navigator.language
}

export {
  useLanguage,
}
