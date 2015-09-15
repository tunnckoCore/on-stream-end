/*!
 * on-stream-end <https://github.com/tunnckoCore/on-stream-end>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

// var test = require('assertit')
// var onStreamEnd = require('./index')

// test('on-stream-end:', function () {
//   // body
// })

var assert = require('assert')
var eos = require('./index')

var expected = 8
var fs = require('fs')
var cp = require('child_process')
var net = require('net')

var ws = fs.createWriteStream('/dev/null')
eos(ws, function (err) {
  expected--
  assert(!!err)
  if (!expected) process.exit(0)
})
ws.close()

var rs1 = fs.createReadStream('/dev/random')
eos(rs1, function (err) {
  expected--
  assert(!!err)
  if (!expected) process.exit(0)
})
rs1.close()

var rs2 = fs.createReadStream(__filename)
eos(rs2, function (err) {
  expected--
  assert(!err)
  if (!expected) process.exit(0)
})
rs2.pipe(fs.createWriteStream('/dev/null'))

var rs3 = fs.createReadStream(__filename)
eos(rs3, function () {
  throw new Error('no go')
})()
rs3.pipe(fs.createWriteStream('/dev/null'))

var exec = cp.exec('echo hello world')
eos(exec, function (err) {
  expected--
  assert(!err)
  if (!expected) process.exit(0)
})

var spawn = cp.spawn('echo', ['hello world'])
eos(spawn, function (err) {
  expected--
  assert(!err)
  if (!expected) process.exit(0)
})

var socket = net.connect(50000)
eos(socket, function (err) {
  expected--
  assert(!!err)
  if (!expected) process.exit(0)
})

var server = net.createServer(function (socket) {
  eos(socket, function () {
    expected--
    if (!expected) process.exit(0)
  })
  socket.destroy()
})
server.listen(30000, function () {
  var socket = net.connect(30000)
  eos(socket, function () {
    expected--
    if (!expected) process.exit(0)
  })
})

setTimeout(function () {
  assert(expected === 0)
  process.exit(0)
}, 1000)
