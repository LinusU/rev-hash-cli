/* eslint-env mocha */

'use strict'

const assert = require('assert')
const fs = require('fs')

const execa = require('execa')
const revHash = require('rev-hash')
const rimraf = require('rimraf')

describe('print hashes', () => {
  it('should print the rev-hash of a file', () => {
    const expectedHash = revHash(fs.readFileSync('test.js'))
    const expectedOutput = `${expectedHash}  test.js`
    const actualOutput = execa.shellSync('node ./bin.js test.js').stdout

    assert.strictEqual(actualOutput, expectedOutput)
  })

  it('should print the rev-hash of multiple files', () => {
    const expectedHash1 = revHash(fs.readFileSync('test.js'))
    const expectedHash2 = revHash(fs.readFileSync('bin.js'))
    const expectedHash3 = revHash(fs.readFileSync('package.json'))
    const expectedOutput = `${expectedHash1}  test.js\n${expectedHash2}  bin.js\n${expectedHash3}  package.json`
    const actualOutput = execa.shellSync('node ./bin.js test.js bin.js package.json').stdout

    assert.strictEqual(actualOutput, expectedOutput)
  })
})

describe('rename files', () => {
  const emptyRevHash = revHash('')

  before(() => {
    fs.mkdirSync('test-fixtures')
    fs.writeFileSync('test-fixtures/a.txt', '')
    fs.writeFileSync('test-fixtures/b.txt', '')
    fs.writeFileSync('test-fixtures/c.txt', '')
    fs.writeFileSync('test-fixtures/d.txt', '')
    fs.writeFileSync(`test-fixtures/e-${emptyRevHash}.txt`, '')
  })

  after(() => {
    rimraf.sync('test-fixtures/')
  })

  it('should rename a file', () => {
    execa.shellSync('node ./bin.js --rename test-fixtures/a.txt')

    assert.strictEqual(fs.existsSync('test-fixtures/a.txt'), false)
    assert.strictEqual(fs.existsSync(`test-fixtures/a-${emptyRevHash}.txt`), true)
  })

  it('should rename multiple files', () => {
    execa.shellSync('node ./bin.js --rename test-fixtures/b.txt test-fixtures/c.txt test-fixtures/d.txt')

    assert.strictEqual(fs.existsSync('test-fixtures/b.txt'), false)
    assert.strictEqual(fs.existsSync(`test-fixtures/b-${emptyRevHash}.txt`), true)

    assert.strictEqual(fs.existsSync('test-fixtures/c.txt'), false)
    assert.strictEqual(fs.existsSync(`test-fixtures/c-${emptyRevHash}.txt`), true)

    assert.strictEqual(fs.existsSync('test-fixtures/d.txt'), false)
    assert.strictEqual(fs.existsSync(`test-fixtures/d-${emptyRevHash}.txt`), true)
  })

  it('should only add hash once', () => {
    execa.shellSync(`node ./bin.js --rename test-fixtures/e-${emptyRevHash}.txt`)

    assert.strictEqual(fs.existsSync(`test-fixtures/e-${emptyRevHash}.txt`), true)
    assert.strictEqual(fs.existsSync(`test-fixtures/e-${emptyRevHash}-${emptyRevHash}.txt`), false)
  })
})
