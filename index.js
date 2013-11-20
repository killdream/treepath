// # Module treepath
//
// Selects DOM nodes with combinators.
//
//
// Copyright (c) 2013 Quildreen "Sorella" Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var f     = require('athena')
var slice = Function.call.bind([].slice)

map = f.curry(2, map)
function map(f, xs) {
  var len    = xs.length
  var result = new Array(len)

  for (var i = 0; i < len; ++i) result[i] = f(xs[i])
  return result }


fold = f.curry(3, fold)
function fold(query, initial, node) {
  return match(query, node)?    initial.concat(node)
  :      partial(query, node)?  initial.concat(map(fold(step(query), initial)
                                                  , node.childNodes))
  :      /* otherwise */        initial.concat(map(fold(query, initial)
                                                  , node.childNodes)) }


// Support
function match(query, node) {
  return isSingle(query) && apply(query, node) }

function isSingle(query) {
  return query.length === 1 }

function isMultiple(query) {
  return query.length > 1 }

function apply(query, node) {
  return query[0](node) }

function partial(query, node) {
  return isMultiple(query) && apply(query, node) }

function step(query) {
  return query.slice(1) }

function flatten(as) {
  return as.reduce( function(bs, x) {
                      return Array.isArray(x)?  bs.concat(flatten(x))
                      :      /* otherwise */    bs.concat([x]) }
                  , [])}


// Selectors
select = f.curry(2, select)
function select(query, node) {
  return flatten(fold(query, [], node)) }

tag = f.curry(2, tag)
function tag(name, node) {
  return node
  &&     node.tagName
  &&     node.tagName.toLowerCase() === name.toLowerCase() }



// Exports
module.exports = { select: select
                 , fold: fold
                 , tag: tag
                 }