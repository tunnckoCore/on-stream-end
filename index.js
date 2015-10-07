/*!
 * on-stream-end <https://github.com/tunnckoCore/on-stream-end>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var once = require('onetime')
var dezalgo = require('dezalgo')
var isNodeStream = require('is-node-stream')
var isRealObject = require('is-real-object')
var isChildProcess = require('is-child-process')
var isRequestStream = require('is-request-stream')

module.exports = function onStreamEnd (stream, opts, callback) {
  if (!isNodeStream(stream) && !isRequestStream(stream) && !isChildProcess(stream)) {
    throw new TypeError('on-stream-end: expect `stream` to be Stream, RequestStream or ChildProcess')
  }
  if (typeof opts === 'function') {
    callback = opts
    opts = null
  }
  if (typeof callback !== 'function') {
    throw new TypeError('on-stream-end: expect `callback` to be function')
  }
  opts = isRealObject(opts) ? opts : {}
  callback = once(dezalgo(callback))

  var ws = stream._writableState
  var rs = stream._readableState
  var readable = opts.readable || (opts.readable !== false && stream.readable)
  var writable = opts.writable || (opts.writable !== false && stream.writable)

  function onerror (err) {
    done(err)
  }

  function onlegacyfinish () {
    if (!stream.writable) onfinish()
  }

  function onfinish () {
    writable = false
    if (!readable) done()
  }

  function onend () {
    readable = false
    if (!writable) done()
  }

  function onexit (exitCode) {
    var err = new Error('exited with error code: ' + exitCode)
    err.exitCode = exitCode
    return done(err)
  }

  function onclose (exitCode) {
    var err = new Error('premature close with error code' + exitCode)
    err.exitCode = exitCode

    if (readable && !(rs && rs.ended)) return done(err)
    if (writable && !(ws && ws.ended)) return done(err)
    done()
  }

  function onrequest () {
    stream.req.once('finish', onfinish)
  }

  if (isRequestStream(stream)) {
    stream.once('complete', onfinish)
    stream.once('abort', onclose)
    if (stream.req) onrequest()
    else stream.once('request', onrequest)
  } else if (writable && !ws) { // legacy streams
    stream.once('end', onlegacyfinish)
    stream.once('close', onlegacyfinish)
  }

  if (isChildProcess(stream)) {
    stream.once('exit', onexit)
  }

  stream.once('end', onend)
  stream.once('finish', onfinish)
  if (opts.error !== false) stream.once('error', onerror)
  stream.once('close', onclose)

  function cleanup () {
    stream.removeListener('complete', onfinish)
    stream.removeListener('abort', onclose)
    stream.removeListener('request', onrequest)
    if (stream.req) stream.req.removeListener('finish', onfinish)
    stream.removeListener('end', onlegacyfinish)
    stream.removeListener('close', onlegacyfinish)
    stream.removeListener('finish', onfinish)
    stream.removeListener('exit', onexit)
    stream.removeListener('end', onend)
    stream.removeListener('error', onerror)
    stream.removeListener('close', onclose)
  }

  function done (err) {
    cleanup()
    if (!err || err.exitCode === 0) return callback()
    if (err instanceof Error) return callback(err)
    callback()
  }

  return cleanup
}
