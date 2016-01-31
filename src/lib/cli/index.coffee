###
	xo-barista
	Format Javascript with Happiness (xo) style.
###

xoBarista      = require '../..'
clr            = do require('trucolor').simplePalette
console        = global.vConsole
truwrap        = require 'truwrap'
updateNotifier = require 'update-notifier'
_package       = require '../../package.json'

cliCommand     = process.argv[1].split('/')[-1..][0]

renderer = truwrap
	right: 0
	outStream: process.stderr

yargs = require 'yargs'
	.strict()
	.usage """

	#{clr.command}#{cliCommand}#{clr.normal}
	Format javascript according to xo style

	Just like xo, configuration data will be applied when found in package.json files \
	as the file system is traversed back to the root.

	Usage:
		#{clr.command}cat #{clr.argument}inputFile #{clr.operator}| #{clr.command}#{cliCommand}#{clr.option} [options]#{clr.option}
	"""
	.options
		h:
			alias: 'help'
			describe: 'Display this help.'
		v:
			alias: 'version'
			count: yes
			describe: 'Return the current version on stdout. -vv Return name & version.'
		V:
			alias: 'verbose'
			count: yes
			describe: 'Be verbose. -VV Be loquacious.'
		lint:
			boolean: yes
			describe: 'Output linting information, rather than formatted output.'
		esnext:
			boolean: yes

			describe: 'Enable ES2015+ rule formatting.'
		nosemicolon:
			boolean: yes
			default: false
			describe: 'Strip semicolons normally handled by ASI.'
		barista:
			boolean: yes
			default: (cliCommand is 'xo-barista')
			describe: 'Fine filtering for exceptional crema on coffee brews.'
		space:
			describe: 'Specify number of spaces to indent instead of [tab].'
			default: false
		'color':
			describe: 'Force color output. Disable with --no-color'
	.epilogue "#{clr.command}© 2014-2016 The Bespoke Pixel. #{clr.grey}Released under the MIT License.#{clr.normal}"
	.wrap renderer.getWidth()

argv = yargs.argv

do updateNotifier
		pkg: _package
	.notify

if argv.help
	yargs.wrap renderer.getWidth()
	renderer.write yargs.help()
	renderer.break()
	process.exit 0

if argv.version
	process.stdout.write xoBarista.getVersion(argv.version)
	process.exit 0

if argv.verbose
	switch argv.verbose
		when 1
			argv.lint = yes
			console.verbosity 4
			console.log "\n:#{clr.command}Verbose mode#{clr.normal}:"
		when 2
			argv.lint = yes
			console.verbosity 5
			console.log "\n:#{clr.command}Extra-Verbose mode#{clr.normal}:"
			console.yargs argv
		else
			console.verbosity 3

argv.semicolon = not argv.nosemicolon

if argv.space is true then argv.space = 2

if argv._.length > 0
	try
		xoBarista.formatFiles argv
	catch err
		console.error err.message
		process.exit 1
else
	try
		argv.stdio = true
		xoBarista.formatStdin argv
	catch err
		console.error err.message
		process.exit 1
