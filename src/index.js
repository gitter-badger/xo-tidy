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
const clr = require('trucolor').simplePalette()
const verbosity = require('verbosity')
const through = require('through2')
const gutil = require('gulp-util')
const pkg = require('./package.json')
const pkgConf = require('pkg-conf')
const stdin = require('get-stdin')
const deepAssign = require('deep-assign')
const Engine = require('./lib/engine')
const cr = '\n'

const console = global.vConsole === undefined ? global.vConsole = verbosity.console({out: process.stderr}) : global.vConsole

function setConfiguration(options_ = {}) {
	const {xopath = '.'} = options_
	const baseOptions = {
		xopath,
		lint: false,
		esnext: false,
		semicolon: true,
		space: false,
		rules: {semi: [2, 'always']}
	}
	console.debug(`${cr}${clr.option}Base Options${clr.normal}:`)
	if (console.canWrite(5)) {
		console.pretty(baseOptions, 5)
	}
	return deepAssign(baseOptions, pkgConf.sync('xo', xopath), options_)
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

exports.formatStdin = function (options_) {
	console.info(`${cr}${clr.title}Creating xo-tidy engine (stdio mode)...${clr.normal}`)
	const _xo = new Engine(setConfiguration(options_))
	return stdin().then(buffer => {
		try {
			process.stdout.write(_xo.format(`${buffer}${cr}`))
		} catch (err_) {
			console.error(err_)
			return process.exit(1)
		}
	})
}

exports.formatStream = function (options_) {
	const _xo = new Engine(setConfiguration(options_))
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
			file.contents = new Buffer(_xo.format(`${file.contents}${cr}`))
			this.push(file)
		} catch (err) {
			this.emit('error', new gutil.PluginError('xo-tidy', err, {fileName: file.path}))
		}
		cb(null, file)
	})
}

exports.formatText = function (buffer_, options_) {
	console.info(`${cr}${clr.title}Creating xo-tidy engine (text mode)...${clr.normal}`)
	const _xo = new Engine(setConfiguration(options_))
	return _xo.format(`${buffer_}${cr}`)
}

exports.formatFiles = function () {
	console.info(`${cr}${clr.title}Creating xo-tidy (files mode)...${clr.normal}`)
	throw new Error('Not implemented yet.')
}

