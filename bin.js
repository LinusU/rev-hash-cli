#!/usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')

const neodoc = require('neodoc')
const revHash = require('rev-hash')

const usage = `
Rev Hash.

Usage:
  rev-hash [--rename] <file> [<file>...]

Options:
  --rename     Rename the file so that the rev-hash is part of the filename.
`

const args = neodoc.run(usage, { laxPlacement: true })

for (const file of args['<file>']) {
  const hash = revHash(fs.readFileSync(file))

  console.log(`${hash}  ${file}`)

  if (args['--rename']) {
    const ext = path.extname(file)
    const base = file.slice(0, file.length - ext.length)

    fs.renameSync(file, `${base}-${hash}${ext}`)
  }
}
