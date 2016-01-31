'use strict'
###
	xo-barista
	Core Engine
###

clr = do require('trucolor').simplePalette
_deepAssign = require 'deep-assign'
_cardinal = require 'cardinal'
_esformatter = require 'esformatter'
_ESLint = require("eslint").CLIEngine
_re = require "./patterns"
_tk = require 'rocambole-token'
console = global.vConsole

class Engine
	constructor: (@options) ->
		@ruleOverrides = {}

		console.verbosity 5 if @options.verbose

		console.debug "\n#{clr.title}Resolved Options#{clr.normal}:"
		console.pretty @options, 2 if console.canWrite 5

		esFormatConfig =
			root: yes
			allowShebang: yes
			indent:
				value: '\t'
			whiteSpace:
				before:
					IfStatementConditionalOpening: -1
				after:
					IfStatementConditionalClosing: -1
					FunctionReservedWord: 1
			lineBreak:
				after:
					ClassDeclarationClosingBrace: 0

		esFormatConfig.indent.value = '        '[..Number(@options.space)] if @options.space is not false

		esLintConfig =
			rules: @options.rules

		esLintConfig.extends = 'xo'
		esLintConfig.extends = 'xo/esnext' if @options.esnext
		esLintConfig.rules.semi = [2, 'never'] if not @options.semicolon
		esLintConfig.rules.indent = [2, 'tab', {SwitchCase: 1}] if @options.space is false

		console.debug "\n#{clr.option}esFormatter Options#{clr.normal}:"
		console.pretty esFormatConfig, 2 if console.canWrite 5

		console.debug "\n#{clr.option}esLint Options#{clr.normal}:"
		console.pretty esLintConfig, 2 if console.canWrite 5

		@esFormatOptions = _esformatter.rc esFormatConfig

		@xoFixer = new _ESLint
			baseConfig: esLintConfig
			fix: yes
			rules: @ruleOverrides

	format: (buffer_) ->
		try
			buffer_ =  _esformatter.format buffer_, @esFormatOptions
		catch err
			console.trace "Error while applying formatting.", err, "Trying to continue."

		try
			report = @xoFixer.executeOnText buffer_, "StdIO"
		catch err
			console.trace "Error while applying preflight linting/fixing.", err, "Trying to continue."

		if report.results[0].output?
			output = report.results[0].output
		else
			output = buffer_

		if @options.lint
			console.info "\n#{clr.title}xo-tidy verify formatting...#{clr.normal}:"
			if console.canWrite 4
				console.info _cardinal.highlight output,
					linenos: true

			process.stderr.write _ESLint.getFormatter() report.results
			return true

		return output

module.exports = Engine
