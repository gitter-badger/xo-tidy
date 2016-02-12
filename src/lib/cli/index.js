'use strict'
/*
	xo-tidy
	Format Javascript with xo style.
 */
const xoTidy = require('../..')
const clr = require('trucolor').simplePalette()
const updateNotifier = require('update-notifier')
const yargs = require('yargs')
const pkg = require('../../package.json')
const console = global.vConsole

const renderer = require('truwrap')({
	right: 0,
	outStream: process.stderr
})

yargs.strict().options({
	h: {
		alias: 'help',
		describe: 'Display help.'
	},
	v: {
		alias: 'version',
		count: true,
		describe: 'Print version to stdout. -vv Print name & version.'
	},
	V: {
		alias: 'verbose',
		count: true,
		describe: 'Be verbose. -VV Be loquacious.'
	},
	lint: {
		describe: 'Output linting information, rather than formatted output.'
	},
	esnext: {
		describe: 'Enable ES2015+ rule formatting.'
	},
	semicolon: {
		describe: 'Use --no-semicolon to strip semicolons normally handled by ASI.'
	},
	space: {
		describe: 'Specify number of spaces to indent instead of [tab].',
		nargs: 1,
		default: false
	},
	xopath: {
		describe: 'Path to start searching for xo configuration.',
		nargs: 1,
		default: '.'
	},
	color: {
		describe: 'Force color output. Disable with --no-color'
	}
}).wrap(renderer.getWidth())

const argv = yargs.argv
updateNotifier({pkg}).notify()

if (argv.help) {
	renderer.write(`
${ clr.title }xo-tidy${ clr.title.out } ${ clr.dim }v${xoTidy.getVersion()}${ clr.dim.out }

Tidy babel output to (something approaching) xo style. Mainly concerned with white space, indentation and ASI preferences.

Works as a CLI tool (piping stdin → stdout) and a vinyl stream formatter for gulp/through2. The module offers 'formatText', 'formatStdin' and 'formatStream' methods.

Just like xo, configuration data will be applied when found in package.json files as the file system is traversed back to the root.

Usage:
${ clr.command }cat ${ clr.argument }inputFile ${ clr.operator }| ${ clr.command }xo-tidy ${ clr.option }[options] ${ clr.operator }> ${ clr.argument }outputFile${ clr.argument.out }
${ clr.dim }... or ...${ clr.dim.out }
${ clr.command }xo-tidy ${ clr.option }[options] ${ clr.operator }< ${ clr.argument }inputFile ${ clr.operator }> ${ clr.argument }outputFile${ clr.argument.out }`)
	renderer.break(2)
	renderer.write(yargs.help())
	renderer.break()
	renderer.write(`${clr.command}© 2016 The Bespoke Pixel. ${clr.grey}Released under the MIT License.${clr.grey.out}`)
	renderer.break(2)
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
			console.log(`${clr.command}Verbose mode${clr.command.out}:`)
			break
		case 2:
			argv.lint = true
			console.verbosity(5)
			console.log(`${clr.command}Extra-Verbose mode${clr.command.out}:`)
			console.yargs(argv)
			break
		default:
			console.verbosity(3)
	}
}
if (argv._.length > 0) {
	try {
		xoTidy.formatFiles(argv)
	} catch (err_) {
		console.error(err_.message)
		process.exit(1)
	}
} else {
	try {
		xoTidy.formatStdin(argv)
	} catch (err_) {
		console.error(err_.message)
		process.exit(1)
	}
}

