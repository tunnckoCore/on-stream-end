/*!
 * on-stream-end <https://github.com/tunnckoCore/on-stream-end>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var fs = require('fs')
var cp = require('child_process')
var net = require('net')
var http = require('http')
var eos = require('./index')
var test = require('assertit')
var through2 = require('through2')
var concat = require('concat-stream')

test('should throw TypeError if not Stream, RequestStream or ChildProcess', function (done) {
  function fixture () {
    eos(123)
  }

  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `stream` to be Stream, RequestStream or ChildProcess/)
  done()
})

test('should throw TypeError if not callback given', function (done) {
  function fixture () {
    eos(fs.createReadStream('LICENSE'), 123)
  }

  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `callback` to be function/)
  done()
})

test('should handle premature close of legacy streams', function (done) {
  var legacy = through2()
  eos(legacy, function (err) {
    test.strictEqual(/premature close/.test(err.message), true)
    test.strictEqual(err.message, 'premature close with error code: undefined')
    done()
  })
  legacy.destroy()
})

test('should handle completion of request streams', function (done) {
  var req = http.request({
    hostname: 'www.tunnckocore.tk'
  }, function (res) {
    res.pipe(concat(function (buf) {
      test.strictEqual(/doctype/gi.test(buf.toString()), true)
    }))
  })
  req.end()
  eos(req, function (err) {
    test.ifError(err)
    done()
  })
})

test('should handle premature close error of writable streams', function (done) {
  var ws = fs.createWriteStream('._foobar')
  eos(ws, function (err) {
    test.ifError(!err)
    test.strictEqual(/premature close/.test(err.message), true)
    test.strictEqual(err.message, 'premature close with error code: undefined')
    done()
  })
  ws.close()
})

test('should handle premature close error of readable streams', function (done) {
  var rs = fs.createReadStream('LICENSE')
  eos(rs, function (err) {
    test.ifError(!err)
    test.strictEqual(/premature close/.test(err.message), true)
    test.strictEqual(err.message, 'premature close with error code: undefined')
    done()
  })
  rs.close()
})

test('should handle completion of readable streams', function (done) {
  var rs = fs.createReadStream('LICENSE')
  eos(rs, function (err) {
    test.ifError(err)
    done()
  })
  rs.pipe(fs.createWriteStream('._LICENSE_COPY'))
})

test('should handle completion of child_process.exec', function (done) {
  var exec = cp.exec('echo hello world')
  eos(exec, function (err) {
    test.ifError(err)
    done()
  })
})

test('should handle completion of child_process.spawn', function (done) {
  var exec = cp.spawn('echo', ['hello world'])
  eos(exec, function (err) {
    test.ifError(err)
    done()
  })
})

test('should handle ECONNREFUSED of socket `net.connect(50000)`', function (done) {
  var socket = net.connect(50000)
  eos(socket, function (err) {
    test.ifError(!err)
    test.strictEqual(/connect ECONNREFUSED/.test(err.message), true)
    test.strictEqual(err.code, 'ECONNREFUSED')
    done()
  })
})

test('should handle completion of net.createServer', function (done) {
  var count = 1
  var server = net.createServer(function (socket) {
    eos(socket, function (err) {
      test.ifError(!err)
      test.strictEqual(/premature close/.test(err.message), true)
      count++
    })
    socket.destroy()
  })
  server.listen(33000, function () {
    var sock = net.connect(33000)
    eos(sock, function (err) {
      test.ifError(err)
      test.strictEqual(count, 2)
      server.close()
      done()
    })
  })
})
