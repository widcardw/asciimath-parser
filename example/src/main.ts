import { waitLocale } from 'svelte-i18n'
import './app.css'
import App from './App.svelte'
import 'katex/dist/katex.min.css'
import './i18n'

await waitLocale()

const app = new App({
  target: document.getElementById('app'),
})

export default app
