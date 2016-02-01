'use strict'
/*
	xo-tidy
	Core Engine
 */

var _trucolor = require('trucolor')

var _trucolor2 = _interopRequireDefault(_trucolor)

var _cardinal = require('cardinal')

var _cardinal2 = _interopRequireDefault(_cardinal)

var _esformatter2 = require('esformatter')

var _esformatter3 = _interopRequireDefault(_esformatter2)

var _eslint = require('eslint')

var _eslint2 = _interopRequireDefault(_eslint)

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : {
		default: obj
	}
}

const _ESLint = _eslint2.default.CLIEngine
const clr = _trucolor2.default.simplePalette()
const console = global.vConsole

class Engine {
	constructor(options) {
		this.options = options
		this.ruleOverrides = {}
		if (this.options.verbose) {
			console.verbosity(5)
		}
		console.debug(`
${ clr.title }Resolved Options${ clr.normal }:`)
		if (console.canWrite(5)) {
			console.pretty(this.options, 2)
		}
		_esformatter3.default.register(require('esformatter-dot-notation'))
		_esformatter3.default.register(require('esformatter-align'))
		_esformatter3.default.register(require('esformatter-parseint'))
		_esformatter3.default.register(require('esformatter-semicolons'))
		const esFormatConfig = {
			root:         true,
			allowShebang: true,
			indent:       {
					value: '\t'
				},
			whiteSpace: {
					before: {
						IfStatementConditionalOpening: -1
					},
					after: {
						IfStatementConditionalClosing: -1,
						FunctionReservedWord:          1
					}
				},
			lineBreak: {
					after: {
						ClassDeclarationClosingBrace: 0
					}
				}
		}
		if (this.options.space === !false) {
			esFormatConfig.indent.value = '        '.slice(0, Number(this.options.space) + 1)
		}
		const esLintConfig = {
			rules: this.options.rules
		}
		esLintConfig.extends = 'xo'
		if (this.options.esnext) {
			esLintConfig.extends = 'xo/esnext'
		}
		if (!this.options.semicolon) {
			esLintConfig.rules.semi = [2, 'never']
		}
		if (this.options.space === false) {
			esLintConfig.rules.indent = [2, 'tab', {
				SwitchCase: 1
			}]
		}
		console.debug(`
${ clr.option }esFormatter Options${ clr.normal }:`)
		if (console.canWrite(5)) {
			console.pretty(esFormatConfig, 2)
		}
		console.debug(`
${ clr.option }esLint Options${ clr.normal }:`)
		if (console.canWrite(5)) {
			console.pretty(esLintConfig, 2)
		}
		this.esFormatOptions = _esformatter3.default.rc(esFormatConfig)
		this.xoFixer = new _ESLint({
			baseConfig: esLintConfig,
			fix:        true,
			rules:      this.ruleOverrides
		})
	}

	format(buffer_) {
		let report
		let output
		try {
			buffer_ = _esformatter3.default.format(buffer_, this.esFormatOptions)
		} catch (err_) {
			console.trace(`Error while applying formatting. (${ err_ }). Trying to continue.`)
		}
		try {
			report = this.xoFixer.executeOnText(buffer_, 'StdIO')
		} catch (err_) {
			console.trace(`Error while applying preflight linting/fixing. (${ err_ }). Trying to continue.`)
		}
		if (report.results[0].output === undefined) {
			output = buffer_
		} else {
			output = report.results[0].output
		}
		if (this.options.lint) {
			console.debug(`
${ clr.title }xo-tidy verify formatting...${ clr.normal }:`)
			if (console.canWrite(4)) {
				console.info(_cardinal2.default.highlight(output, {
					linenos: true
				}))
			}
			process.stderr.write(_ESLint.getFormatter()(report.results))
			process.exit(0)
		}
		return output
	}
}
module.exports = Engine

