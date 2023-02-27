import type { Component } from 'solid-js'

const Shield: Component<{
  href: string
  src: string
}> = (props) => {
  return (
    <a href={props.href} target="_blank"><img src={props.src} /></a>
  )
}

export {
  Shield,
}
