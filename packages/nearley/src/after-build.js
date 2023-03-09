import fs from 'fs'

const filename = './src/grammar.js'
fs.promises.readFile(filename, 'utf-8').then((body) => {
  const lines = body.split('\n')
  const res = [
    '/* eslint-disable */',
    lines[0], // comment
    lines[1], // comment
    'export default function (lexer) {',
    ...lines.slice(3, -7),
    'return grammar;',
    '}',
  ]
  fs.promises.writeFile(filename, res.join('\n'), 'utf-8')
})
