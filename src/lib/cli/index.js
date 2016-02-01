'use strict'
/*
	xo-tidy
	Format Javascript with xo style.
 */
import xoTidy from '../..'
import trucolor from 'trucolor'
import truwrap from 'truwrap'
import updateNotifier from 'update-notifier'
import yargs from 'yargs'
import _package from '../../package.json'

const clr = trucolor.simplePalette()
const console = global.vConsole
const renderer = truwrap({
	right: 0,
	outStream: process.stderr
})

yargs
	.usage(`
${clr.command}xo-tidy${clr.command.out}
Format javascript according to xo style
Just like xo, configuration data will be applied when found in package.json files as the file system is traversed back to the root.

Usage:
${clr.command}cat ${clr.argument}inputFile ${clr.operator}| ${clr.command}xo-tidy ${clr.option}[options]
`).options({
	h: {
		alias: 'help',
		describe: 'Display this help.'
	},
	v: {
		alias: 'version',
		count: true,
		describe: 'Return the current version on stdout. -vv Return name & version.'
	},
	V: {
		alias: 'verbose',
		count: true,
		describe: 'Be verbose. -VV Be loquacious.'
	},
	lint: {
		boolean: true,
		describe: 'Output linting information, rather than formatted output.'
	},
	esnext: {
		boolean: true,
		describe: 'Enable ES2015+ rule formatting.'
	},
	nosemicolon: {
		boolean: true,
		default: false,
		describe: 'Strip semicolons normally handled by ASI.'
	},
	space: {
		describe: 'Specify number of spaces to indent instead of [tab].',
		default: false
	},
	color: {
		describe: 'Force color output. Disable with --no-color'
	}
}).epilogue(`
${clr.command}© 2014-2016 The Bespoke Pixel. ${clr.grey}Released under the MIT License.${clr.grey.out}
`).wrap(renderer.getWidth())

const argv = yargs.argv

updateNotifier({
	pkg: _package
}).notify()

if (argv.help) {
	yargs.wrap(renderer.getWidth())
	renderer.write(yargs.help())
	renderer.break()
	process.exit(0)
}

if (argv.version) {
	process.stdout.write(xoTidy.getVersion(argv.version))
	process.exit(0)
}

if (argv.verbose) {
	switch (argv.verbose) {
		case 1:
			argv.lint = true
			console.verbosity(4)
			console.log(`
${clr.command}Verbose mode${clr.command.out}:`)
			break
		case 2:
			argv.lint = true
			console.verbosity(5)
			console.log(`
${clr.command}Extra-Verbose mode${clr.command.out}:`)
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
		xoTidy.formatFiles(argv)
	} catch (err_) {
		console.error(err_.message)
		process.exit(1)
	}
} else {
	try {
		argv.stdio = true
		xoTidy.formatStdin(argv)
	} catch (err_) {
		console.error(err_.message)
		process.exit(1)
	}
}

