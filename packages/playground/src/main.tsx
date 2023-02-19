import { render } from 'solid-js/web'

import 'katex/dist/katex.min.css'
import './index.css'
import 'prism-theme-vars'
import App from './App'

render(() => <App />, document.getElementById('root') as HTMLElement)
