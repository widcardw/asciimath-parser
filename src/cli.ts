#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'
import { cac } from 'cac'
import prompts from 'prompts'
import { AsciiMath } from '.'

function toArray(a: string | string[]) {
  if (typeof a === 'undefined')
    return []
  if (Array.isArray(a))
    return a
  return [a]
}

const cli = cac('am-parse')

cli
  .option('-i <input_file>', 'Choose input file')
  .option('-d <delimiter>', 'Specify a delimiter', { default: '`' })
  .option('--display <display_mode>', 'Whether to enable display mode in inline formula', { default: false })

cli.help()

const parsed = cli.parse()

const inputFiles = toArray(parsed.options.i)

if (parsed.args.length) {
  const { args } = parsed
  const singleOrMulti = args.length > 1 ? 'all these files' : 'the file'
  const etc = args.length > 1 ? ' etc.' : ''
  console.log(`Oops, maybe you missed the \`-i\` option.\nThe program will parse ${singleOrMulti} (\`${args.slice(0, 1)}\`${etc}) with default configuration.`)
  prompts({
    type: 'confirm',
    message: 'Are you sure to continue?',
    name: 'sureToContinue',
    initial: true,
  })
    .then(async ({ sureToContinue }) => {
      if (sureToContinue)
        await processFiles(args)
    })
}
else if (inputFiles.length === 0 && !parsed.options.h) {
  cli.outputHelp()
}
else {
  processFiles(inputFiles)
}

async function processFiles(files: readonly string[]) {
  const delimiter = parsed.options.d as string
  const display = parsed.options.display as boolean

  const am = new AsciiMath({ display })
  const PATTERN = new RegExp(`${delimiter}(.*?)${delimiter}`, 'g')

  Promise.all(files.map(async (fileName) => {
    const content = String(await fs.readFile(fileName))
    const res = content.replace(PATTERN, (_match, $1: string) => `$${am.toTex($1)}$`)
    const outputName = `${path.basename(fileName, path.extname(fileName))}__am-parsed.tex`
    await fs.writeFile(outputName, res)
    console.log(`Successfully processed \`${fileName}\`, please checkout \`${outputName}\``)
  }))
}
