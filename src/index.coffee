'use strict'
###
	xo-tidy
	Tidy babel output to xo format

	Copyright (c) 2015 Mark Griffiths/The Bespoke Pixel

	Permission is hereby granted, free of charge, to any person
	obtaining a copy of this software and associated documentation
	files (the "Software"), to deal in the Software without
	restriction, including without limitation the rights to use, copy,
	modify, merge, publish, distribute, sublicense, and/or sell copies
	of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
###

clr = do require('trucolor').simplePalette
console = global.vConsole ?= require('verbosity').console
	out: process.stderr

_package = require './package.json'
_engine = require './lib/engine'
_options = require 'pkg-conf'
_stdin = require 'get-stdin'
_deepAssign = require 'deep-assign'

setConfiguration = (options_) ->
	lint: options_.lint ?= false
	esnext: options_.esnext ?= false
	semicolon: options_.semicolon ?= true
	space: options_.space ?= false
	stdio: options_.stdio ?= false
	rules:
		semi: [2, 'always']

exports.getName = ->
	return _package.name

exports.getDescription = ->
	return _package.description

exports.getVersion = (long) ->
	switch long
		when 2 then "#{_package.name} v#{_package.version}"
		else _package.version

exports.formatStdin = (options_ = {}) ->
	console.info "\n#{clr.title}Creating esformatter/eslint/xo engine (stdio mode)...#{clr.normal}"
	_xo = new _engine _deepAssign setConfiguration(options_), _options.sync('xo', '..')

	_stdin().then (buffer) ->
		try
			process.stdout.write _xo.format(buffer) + "\n"
			return
		catch err
			console.error err
			process.exit 1

exports.formatText = (buffer_, options_ = {}) ->
	console.info "\n#{clr.title}Creating xo-barista engine (text mode)...#{clr.normal}"
	_xo = new _engine _deepAssign setConfiguration(options_), _options.sync('xo', '..')
	return _xo.format do buffer_.toString

exports.formatFiles = () ->
	console.info "\n#{clr.title}Creating esformatter/eslint/xo engine (files mode)...#{clr.normal}"
	throw new Error "Not implemented."



