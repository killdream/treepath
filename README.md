Treepath
========

[![NPM version](https://badge.fury.io/js/treepath.png)](http://badge.fury.io/js/treepath)
[![Dependencies Status](https://david-dm.org/killdream/treepath.png)](https://david-dm.org/killdream/treepath)
[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)

Treepath is a library for selecting DOM nodes with combinators. It works very
much like `document.querySelector`, but can be extended to work with any kind
of tree-like data structure — and is also composable!

One could also say this is just an experimental port of [enlive](https://github.com/cgrand/enlive)
to JavaScript — in fact, most of the inspiration comes from it :P


## Example

```js
var dom = require('domparser')
var t   = require('treepath')

var xml = new dom.DOMParser().parseFromString(
  '<div id="site"><a href="/en/foo">Foo</a></div>'
).documentElement

// div a
t.select([t.tag('div'), t.tag('a')], xml)
// => ['<a href="/en/foo">...</a>']

// *
t.select([function(){ return true }], xml)
// => ['<div id="site">...</div>', '<a href="/en/foo">...</a>']

// #site, *[href*="/en/"]
t.select([t.or(t.id('site'), t.attrContains('href', '/en/'))], xml)
// => ['<div>...</div>', '<a>...</a>']
```

## Installing

Grab it from NPM:

    $ npm install treepath


## Documentation

( TBD )

`treepath.select` basically works like this: it takes a `query`, which is a
list of predicate functions, and something fulfilling the DOM `Node`
interface. It then returns all nodes that match the given query.

A query is a sequence of steps, where each item of the array is a predicate
step. We apply a predicate at the current step to a node, and if it's
successful, apply the next step to its children, and so on until there are no
more steps. If an item matches successfully at the end the path, we return it.

Thus:

```js
[ tag('div'), tag('a'), tag('span') ]
```

Is equivalent to the following CSS expression:

```js
div a span
```

    
## Platform support

This library assumes an ES5 environment, but can be easily supported in ES3
platforms by the use of shims. Just include [es5-shim][] :)

[es5-shim]: https://github.com/kriskowal/es5-shim


## Licence

Copyright (c) 2013 Quildreen Motta.

Released under the [MIT licence](https://github.com/killdream/treepath/blob/master/LICENCE).
