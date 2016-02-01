/* eslint new-cap: 0 */
'use strict'
/*
	xo-tidy
	Tidy babel output to xo format

	Copyright (c) 2016 Mark Griffiths

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
 */
import trucolor from 'trucolor'
import verbosity from 'verbosity'
import through from 'through2'
import gutil from 'gulp-util'
import pkg from './package.json'
import options from 'pkg-conf'
import stdin from 'get-stdin'
import deepAssign from 'deep-assign'
import Engine from './lib/engine'

const clr = trucolor.simplePalette()

const console = global.vConsole === undefined ? global.vConsole = verbosity.console({out: process.stderr}) : global.vConsole

function setConfiguration(options_) {
	return {
		lint: (options_.lint === undefined) ? options_.lint = false : options_.lint,
		esnext: (options_.esnext === undefined) ? options_.esnext = false : options_.esnext,
		semicolon: (options_.semicolon === undefined) ? options_.semicolon = true : options_.semicolon,
		space: (options_.space === undefined) ? options_.space = false : options_.space,
		stdio: (options_.stdio === undefined) ? options_.stdio = false : options_.stdio,
		rules: {
			semi: [2, 'always']
		}
	}
}

exports.getName = () => {
	return pkg.name
}

exports.getDescription = () => {
	return pkg.description
}

exports.getVersion = long => {
	switch (long) {
		case 2:
			return `${pkg.name} v${pkg.version}`
		default:
			return pkg.version
	}
}

exports.formatStdin = function (options_ = {}) {
	console.info(`\n${clr.title}Creating xo-tidy engine (stdio mode)...${clr.normal}`)
	const _xo = new Engine(deepAssign(setConfiguration(options_), options.sync('xo', '..')))
	return stdin().then(buffer => {
		try {
			process.stdout.write(`${_xo.format(buffer)}\n`)
		} catch (err_) {
			console.error(err_)
			return process.exit(1)
		}
	})
}

exports.formatStream = function (options_ = {}) {
	const _xo = new Engine(deepAssign(setConfiguration(options_), options.sync('xo', '.')))
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file)
			return
		}
		if (file.isStream()) {
			cb(new gutil.PluginError('xo-tidy', 'Streaming not supported'))
			return
		}

		try {
			file.contents = new Buffer(_xo.format(`${file.contents.toString()}\n\n`))
			this.push(file)
		} catch (err) {
			this.emit('error', new gutil.PluginError('xo-tidy', err, {fileName: file.path}))
		}
		cb()
	})
}

exports.formatText = function (buffer_, options_ = {}) {
	console.info(`\n${clr.title}Creating xo-tidy engine (text mode)...${clr.normal}`)
	const _xo = new Engine(deepAssign(setConfiguration(options_), options.sync('xo', '..')))
	return _xo.format(buffer_.toString())
}

exports.formatFiles = function () {
	console.info(`\n${clr.title}Creating xo-tidy (files mode)...${clr.normal}`)
	throw new Error('Not implemented.')
}

