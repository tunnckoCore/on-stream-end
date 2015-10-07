# [on-stream-end][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] 

> Handles completion and errors of any stream - readable/writable/duplex.  
A drop-in replacement for [end-of-stream](https://github.com/mafintosh/end-of-stream).

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]


## Install
```
npm i on-stream-end --save
```


## Usage
> For more use-cases see the [tests](./test.js)

```js
const eos = require('on-stream-end')
```

### [onStreamEnd](./index.js#L41)
> Handles completion and errors of any stream - readable/writable/duplex.

- `stream` **{Stream}** stream to listen for completion    
- `opts` **{Object}** optional options object    
- `callback` **{Function}** completion callback    

**Example**

```js
const fs = require('fs')
const eos = require('on-stream-end')
const readable = fs.createReadStream('README.md')

eos(readable, err => {
  if (err) return console.log('stream had an error or closed early')
  console.log('stream has ended')
})
```


## More examples
> This module is drop-in replacement for `end-of-stream`, just more strictness, more coverage and more tests.

```js
var eos = require('on-stream-end')

eos(readableStream, function (err) {
  if (err) return console.log('stream had an error or closed early')
  console.log('stream has ended')
})

eos(writableStream, function (err) {
  if (err) return console.log('stream had an error or closed early')
  console.log('stream has finished')
})

eos(duplexStream, function (err) {
  if (err) return console.log('stream had an error or closed early')
  console.log('stream has ended and finished')
})

eos(duplexStream, {readable: false}, function (err) {
  if (err) return console.log('stream had an error or closed early')
  console.log('stream has ended but might still be writable')
})

eos(duplexStream, {writable: false}, function (err) {
  if (err) return console.log('stream had an error or closed early')
  console.log('stream has ended but might still be readable')
})

eos(readableStream, {error: false}, function (err) {
  // do not treat emit('error', err) as a end of stream
})
```


## Related
- [catchup](https://github.com/tunnckocore/catchup): Graceful error handling. Because core `domain` module is deprecated.
- [end-of-stream](https://github.com/mafintosh/end-of-stream): Call a callback when a readable/writable/duplex stream has completed or failed.
- [is-node-emitter](https://github.com/tunnckocore/is-node-emitter): Strictly checks that given value is nodejs EventEmitter.
- [is-node-stream](https://github.com/tunnckocore/is-node-stream): Strictly and correctly checks if value is a nodejs stream.


## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/tunnckoCore/on-stream-end/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.


## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckocore.tk][author-www-img]][author-www-url] [![keybase tunnckocore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]


[npmjs-url]: https://www.npmjs.com/package/on-stream-end
[npmjs-img]: https://img.shields.io/npm/v/on-stream-end.svg?label=on-stream-end

[license-url]: https://github.com/tunnckoCore/on-stream-end/blob/master/LICENSE.md
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg


[codeclimate-url]: https://codeclimate.com/github/tunnckoCore/on-stream-end
[codeclimate-img]: https://img.shields.io/codeclimate/github/tunnckoCore/on-stream-end.svg

[travis-url]: https://travis-ci.org/tunnckoCore/on-stream-end
[travis-img]: https://img.shields.io/travis/tunnckoCore/on-stream-end.svg

[coveralls-url]: https://coveralls.io/r/tunnckoCore/on-stream-end
[coveralls-img]: https://img.shields.io/coveralls/tunnckoCore/on-stream-end.svg

[david-url]: https://david-dm.org/tunnckoCore/on-stream-end
[david-img]: https://img.shields.io/david/tunnckoCore/on-stream-end.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg


[author-www-url]: http://www.tunnckocore.tk
[author-www-img]: https://img.shields.io/badge/www-tunnckocore.tk-fe7d37.svg

[keybase-url]: https://keybase.io/tunnckocore
[keybase-img]: https://img.shields.io/badge/keybase-tunnckocore-8a7967.svg

[author-npm-url]: https://www.npmjs.com/~tunnckocore
[author-npm-img]: https://img.shields.io/badge/npm-~tunnckocore-cb3837.svg

[author-twitter-url]: https://twitter.com/tunnckoCore
[author-twitter-img]: https://img.shields.io/badge/twitter-@tunnckoCore-55acee.svg

[author-github-url]: https://github.com/tunnckoCore
[author-github-img]: https://img.shields.io/badge/github-@tunnckoCore-4183c4.svg

[freenode-url]: http://webchat.freenode.net/?channels=charlike
[freenode-img]: https://img.shields.io/badge/freenode-%23charlike-5654a4.svg

[new-message-url]: https://github.com/tunnckoCore/ama
[new-message-img]: https://img.shields.io/badge/ask%20me-anything-green.svg