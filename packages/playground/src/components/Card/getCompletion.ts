import type { Completion, CompletionContext, CompletionSource } from '@codemirror/autocomplete'
import katex from 'katex'
// import { completeFromList } from '@codemirror/autocomplete'
// import * as jsonCompletion from './snippets.json'

// Warning: this function uses DOM
// function getCompletion() {
//   return completeFromList(((jsonCompletion as any).default as Completion[]).map((i) => {
//     const info = () => {
//       const dom = document.createElement('div')
//       if (typeof i.info === 'string')
//         dom.innerHTML = i.info
//       return dom
//     }
//     return {
//       label: i.label,
//       type: 'keyword',
//       info,
//     }
//   }))
// }

// Warning: this function uses dom
async function myCompletion() {
  const jsonCompletion = await (await fetch('/snippets.json')).json()
  return (context: CompletionContext) => {
    const word = context.matchBefore(/[^\[\]\{\}\(\)\s\d]*/)
    if (!word)
      return null
    if (word.from === word.to && !context.explicit)
      return null

    return {
      from: word.from,
      options: (jsonCompletion as Completion[]).map((i) => {
        const comp: Completion = {
          label: i.label,
          detail: i.detail,
        }

        if (typeof i.info === 'string') {
          comp.info = () => {
            const dom = document.createElement('div')
            dom.innerHTML = i.info as string
            return dom
          }
        }
        return comp
      }),
    }
  }
}

export {
  // getCompletion,
  myCompletion,
}
