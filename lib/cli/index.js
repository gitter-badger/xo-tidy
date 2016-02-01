'use strict'
/*
	xo-tidy
	Format Javascript with xo style.
 */

var _ = require('../..')

var _2 = _interopRequireDefault(_)

var _trucolor = require('trucolor')

var _trucolor2 = _interopRequireDefault(_trucolor)

var _truwrap = require('truwrap')

var _truwrap2 = _interopRequireDefault(_truwrap)

var _updateNotifier = require('update-notifier')

var _updateNotifier2 = _interopRequireDefault(_updateNotifier)

var _yargs = require('yargs')

var _yargs2 = _interopRequireDefault(_yargs)

var _package2 = require('../../package.json')

var _package3 = _interopRequireDefault(_package2)

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : {
		default: obj
	}
}

const clr = _trucolor2.default.simplePalette()
const console = global.vConsole
const renderer = (0, _truwrap2.default)({
	right:     0,
	outStream: process.stderr
})

_yargs2.default.usage(`
${ clr.command }xo-tidy${ clr.command.out }
Format javascript according to xo style
Just like xo, configuration data will be applied when found in package.json files as the file system is traversed back to the root.

Usage:
${ clr.command }cat ${ clr.argument }inputFile ${ clr.operator }| ${ clr.command }xo-tidy ${ clr.option }[options]
`).options({
	h: {
		alias:    'help',
		describe: 'Display this help.'
	},
	v: {
		alias:    'version',
		count:    true,
		describe: 'Return the current version on stdout. -vv Return name & version.'
	},
	V: {
		alias:    'verbose',
		count:    true,
		describe: 'Be verbose. -VV Be loquacious.'
	},
	lint: {
		boolean:  true,
		describe: 'Output linting information, rather than formatted output.'
	},
	esnext: {
		boolean:  true,
		describe: 'Enable ES2015+ rule formatting.'
	},
	nosemicolon: {
		boolean:  true,
		default:  false,
		describe: 'Strip semicolons normally handled by ASI.'
	},
	space: {
		describe: 'Specify number of spaces to indent instead of [tab].',
		default:  false
	},
	color: {
		describe: 'Force color output. Disable with --no-color'
	}
}).epilogue(`
${ clr.command }© 2014-2016 The Bespoke Pixel. ${ clr.grey }Released under the MIT License.${ clr.grey.out }
`).wrap(renderer.getWidth())

const argv = _yargs2.default.argv;

(0, _updateNotifier2.default)({
	pkg: _package3.default
}).notify()

if (argv.help) {
	_yargs2.default.wrap(renderer.getWidth())
	renderer.write(_yargs2.default.help())
	renderer.break()
	process.exit(0)
}

if (argv.version) {
	process.stdout.write(_2.default.getVersion(argv.version))
	process.exit(0)
}

if (argv.verbose) {
	switch (argv.verbose) {
		case 1:
			argv.lint = true
			console.verbosity(4)
			console.log(`
${ clr.command }Verbose mode${ clr.command.out }:`)
			break
		case 2:
			argv.lint = true
			console.verbosity(5)
			console.log(`
${ clr.command }Extra-Verbose mode${ clr.command.out }:`)
			console.yargs(argv)
			break
		default:
			console.verbosity(3)
	}
}
argv.semicolon = !argv.nosemicolon
argv.space = argv.space && 2

if (argv._.length > 0) {
	try {
		_2.default.formatFiles(argv)
	} catch (err_) {
		console.error(err_.message)
		process.exit(1)
	}
} else {
	try {
		argv.stdio = true
		_2.default.formatStdin(argv)
	} catch (err_) {
		console.error(err_.message)
		process.exit(1)
	}
}

