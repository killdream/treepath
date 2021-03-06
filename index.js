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

var f     = require('athena/lib/higher-order')
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
                                       .concat(map(fold(query, initial)
                                                  ,node.childNodes))

  :      partial(query, node)?  initial.concat(map(fold(step(query), initial)
                                                  , node.childNodes))
                                       .concat(map(fold(query, initial)
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

function eq(a, b) {
  return a === b }

function startsWith(a, b) {
  return a.indexOf(b) === 0 }

function endsWith(a, b) {
  return a.lastIndexOf(b) === a.length - b.length }

function contains(as, a) {
  return as.indexOf(a) != -1 }

function asClassList(as, a) {
  return [as.trim().split(/\s+/), a] }

spread = f.curry(2, spread)
function spread(f, as) {
  return f.apply(this, as) }


// Selectors
select = f.curry(2, select)
function select(query, node) {
  return flatten(fold(query, [], node)) }

tag = f.curry(2, tag)
function tag(name, node) {
  return node
  &&     node.tagName
  &&     node.tagName.toLowerCase() === name.toLowerCase() }

hasAttr = f.curry(2, hasAttr)
function hasAttr(name, node) {
  return node
  &&     node.hasAttribute
  &&     node.hasAttribute(name) }

attr = f.curry(4, attr)
function attr(compare, name, value, node) {
  return node
  &&     node.getAttribute
  &&     compare(node.getAttribute(name), value) }


function not(f) {
  return function() {
           return !f.apply(this, arguments) }}

function or() {
  var fs = slice(arguments)
  return function(node) {
           return fs.reduce(function(a, f){ return a || f(node) }, false) }}

function and() {
  var fs = slice(arguments)
  return function(node) {
           return fs.reduce(function(a, f){ return a && f(node) }, true) }}



// Exports
module.exports = { select       : select
                 , fold         : fold
                 , tag          : tag
                 , or           : or
                 , and          : and
                 , hasAttr      : hasAttr
                 , attr         : attr
                 , attrEq       : attr(eq)
                 , attrStarts   : attr(startsWith)
                 , attrEnds     : attr(endsWith)
                 , attrContains : attr(contains)
                 , hasClass     : attr(f.compose(spread(contains), asClassList), 'class')
                 , id           : attr(eq, 'id')
                 }