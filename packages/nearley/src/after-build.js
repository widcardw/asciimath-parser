import fs from 'fs'

const filename = './src/parser.js'
fs.promises.readFile(filename, 'utf-8').then(body => {
  const head = 'import lexer from "./lexer"\n'
  fs.promises.writeFile(filename, head + body, 'utf-8')
})
