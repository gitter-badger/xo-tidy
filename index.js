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

var _trucolor = require('trucolor')

var _trucolor2 = _interopRequireDefault(_trucolor)

var _verbosity = require('verbosity')

var _verbosity2 = _interopRequireDefault(_verbosity)

var _through = require('through2')

var _through2 = _interopRequireDefault(_through)

var _gulpUtil = require('gulp-util')

var _gulpUtil2 = _interopRequireDefault(_gulpUtil)

var _package = require('./package.json')

var _package2 = _interopRequireDefault(_package)

var _pkgConf = require('pkg-conf')

var _pkgConf2 = _interopRequireDefault(_pkgConf)

var _getStdin = require('get-stdin')

var _getStdin2 = _interopRequireDefault(_getStdin)

var _deepAssign = require('deep-assign')

var _deepAssign2 = _interopRequireDefault(_deepAssign)

var _engine = require('./lib/engine')

var _engine2 = _interopRequireDefault(_engine)

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : {
		default: obj
	}
}

const clr = _trucolor2.default.simplePalette()

const console = global.vConsole === undefined ? global.vConsole = _verbosity2.default.console({
	out: process.stderr
}) : global.vConsole

function setConfiguration(options_) {
	return {
		lint:      options_.lint === undefined ? options_.lint = false : options_.lint,
		esnext:    options_.esnext === undefined ? options_.esnext = false : options_.esnext,
		semicolon: options_.semicolon === undefined ? options_.semicolon = true : options_.semicolon,
		space:     options_.space === undefined ? options_.space = false : options_.space,
		stdio:     options_.stdio === undefined ? options_.stdio = false : options_.stdio,
		rules:     {
			semi: [2, 'always']
		}
	}
}

exports.getName = () => {
	return _package2.default.name
}

exports.getDescription = () => {
	return _package2.default.description
}

exports.getVersion = long => {
	switch (long) {
		case 2:
			return `${ _package2.default.name } v${ _package2.default.version }`
		default:
			return _package2.default.version
	}
}

exports.formatStdin = function () {
	let options_ = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0]

	console.info(`
${ clr.title }Creating xo-tidy engine (stdio mode)...${ clr.normal }`)
	const _xo = new _engine2.default((0, _deepAssign2.default)(setConfiguration(options_), _pkgConf2.default.sync('xo', '..')))
	return (0, _getStdin2.default)().then(buffer => {
		try {
			process.stdout.write(`${ _xo.format(buffer) }
`)
		} catch (err_) {
			console.error(err_)
			return process.exit(1)
		}
	})
}

exports.formatStream = function () {
	let options_ = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0]

	const _xo = new _engine2.default((0, _deepAssign2.default)(setConfiguration(options_), _pkgConf2.default.sync('xo', '.')))
	return _through2.default.obj(
		function (file, enc, cb) {
			if (file.isNull()) {
				cb(null, file)
				return
			}
			if (file.isStream()) {
				cb(new _gulpUtil2.default.PluginError('xo-tidy', 'Streaming not supported'))
				return
			}

			try {
				file.contents = new Buffer(_xo.format(`${ file.contents.toString() }

`))
				this.push(file)
			} catch (err) {
				this.emit('error', new _gulpUtil2.default.PluginError('xo-tidy', err, {
					fileName: file.path
				}))
			}
			cb()
		})
}

exports.formatText = function (buffer_) {
	let options_ = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1]

	console.info(`
${ clr.title }Creating xo-tidy engine (text mode)...${ clr.normal }`)
	const _xo = new _engine2.default((0, _deepAssign2.default)(setConfiguration(options_), _pkgConf2.default.sync('xo', '..')))
	return _xo.format(buffer_.toString())
}

exports.formatFiles = function () {
	console.info(`
${ clr.title }Creating xo-tidy (files mode)...${ clr.normal }`)
	throw new Error('Not implemented.')
}

