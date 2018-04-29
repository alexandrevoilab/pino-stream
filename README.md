# pino-stream

**Lead maintainer:** [alexandrevoilab](https://github.com/alexandrevoilab)

This module provides a child process utility for [pino][pino]. It aims to be
compatible with existing [pino][pino] transports.

This is *not* a transport for [pino][pino] by itself.
Given a tranport list, it will spawn a new child process and run the transport
inside the new process. This is similar to running `node app.js | pino-transport`.

Might **not** be production ready. This module as not been battle tested yet. See the TODO section.

[pino]: https://www.npmjs.com/package/pino

## Attribution

This module is inspired by [pino-spawn][pino-spawn] and the following issues: [pinojs/community#3](https://github.com/pinojs/community/issues/3) and [atis--/pino-spawn#1](https://github.com/atis--/pino-spawn/issues/1).

[pino-spawn]: https://github.com/atis--/pino-spawn

## Install

```bash
$ npm install pino-stream --save
```

## Usage

Basic exemple usage with [pino-elasticsearch][pino-elasticsearch] and sole transport.
Note, you have to `npm install pino-elasticsearch` before.

[pino-elasticsearch]: https://github.com/pinojs/pino-elasticsearch

```js
'use strict';

const pino_stream = require('pino-stream');

let pino = require('pino')(
  pino_stream(['pino-elasticsearch'])
);
```

## Options

`pino_stream()` only takes one argument: an `array` of streams or modules to stream to. Every element in that `array` SHOULD be an `object` with the following properties.

The `object` MUST have only one of `stream` or `module`.

#### `stream` (stream.Writable)

A `stream.Writable` instance. Logs will be `.pipe()`ed directly to it.

#### `module` (string)

The name of a [pino][pino] transport module. **Not** the `require()`ed module, just the name.
pino-stream will spawn a new process to host the module and stream logs to it.

Should work with any [pino][pino] transport listed on the official [pino transport documentation](https://getpino.io/#/docs/transports).

#### `args` (array)

If the `object` describe a module, this will be the arguments passed to it.

See nodejs [child_process.fork documentation](https://nodejs.org/dist/latest-v8.x/docs/api/child_process.html#child_process_child_process_fork_modulepath_args_options).

### Shorthands

Shorthand configurations are supported. An `object` will be used a stream and a `string` will be used as a module.

```js
pino_stream([{
    module: 'pino-elasticsearch'
  }, {
    stream: process.stdout
  }
])
```

Is the same as

```js
pino_stream(['pino-elasticsearch', process.stdout])
```

## Exemples

### One transport

Simple pipe [pino-elasticsearch][pino-elasticsearch] with no arguments.


```js
'use strict';

const pino_stream = require('pino-stream');

let pino = require('pino')(
  pino_stream([{
    module: 'pino-elasticsearch'
  }])
);
```

Short:

```js
'use strict';

const pino_stream = require('pino-stream');

let pino = require('pino')(
  pino_stream(['pino-elasticsearch'])
);
```

### One transport and one stream

Pipe [pino-elasticsearch][pino-elasticsearch] with an external elasticsearch server and logs to stdout.

```js
'use strict';

const pino_stream = require('pino-stream');

let pino = require('pino')(
  pino_stream([
    {
      module: 'pino-elasticsearch',
      args: ['--host', '10.20.30.40', '--index', 'myindex']
    },
    {
      stream: process.stdout
    }
  ])
);
```

Short:

```js
'use strict';

const pino_stream = require('pino-stream');

let pino = require('pino')(
  pino_stream([
    {
      module: 'pino-elasticsearch',
      args: ['--host', '10.20.30.40', '--index', 'myindex']
    },
    process.stdout
  ])
);
```

### One transport and pretty print

Simple pipe [pino-elasticsearch][pino-elasticsearch] with no arguments and pretty print to stdout.


```js
'use strict';

const pino_stream = require('pino-stream');
const pretty = require('pino').pretty();

pretty.pipe(process.stdout);

let pino = require('pino')(
  pino_stream([
    {
      module: 'pino-elasticsearch'
    },
    {
      stream: pretty
    }
  ])
);
```

Short:

```js
'use strict';

const pino_stream = require('pino-stream');
const pretty = require('pino').pretty();

pretty.pipe(process.stdout);

let pino = require('pino')(
  pino_stream(['pino-elasticsearch', pretty])
);
```

### No transport

Useless, but it will not crash. All logs will be piped to `process.stdout`.

```js
'use strict';

const pino_stream = require('pino-stream');

let pino = require('pino')(
  pino_stream()
);
```

## TODO

PRs are welcome!

* Add benchmarks
* Add unit tests
* Test on high loads
* Test in backpressure situations
* Restart crashed child process
* Add a level filter for every output

## License

[MIT License](http://jsumners.mit-license.org/)