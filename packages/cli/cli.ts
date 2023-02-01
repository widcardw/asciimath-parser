#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'
import { cac } from 'cac'
import { AsciiMath } from '../core/src'

const cli = cac('am-parse')

cli
  .command('[...input_files]', 'Input files')
  .option('-d <delimiter>', 'Specify a delimiter', { default: '`' })
  .option('--display <display_mode>', 'Whether to enable display mode in inline formula', { default: false })

cli.help()

const parsed = cli.parse()

if (parsed.args.length === 0 && !parsed.options.h)
  cli.outputHelp()

else
  processFiles(parsed.args)

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
