import type { Component } from 'solid-js'
import './index.css'

const Footer: Component = () => {
  return (
    <footer>
      <span class="op-70">Playground made with </span><a href="https://solidjs.com">Solidjs</a>
      &nbsp;&nbsp;&nbsp;
      <span class="op-70">Deploys on </span><a href="https://netlify.app">Netlify</a>
    </footer>
  )
}

export {
  Footer,
}
