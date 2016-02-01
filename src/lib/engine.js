'use strict'
/*
	xo-tidy
	Core Engine
 */
import trucolor from 'trucolor'
import cardinal from 'cardinal'
import _esformatter from 'esformatter'
import eslint from 'eslint'

const _ESLint = eslint.CLIEngine
const clr = trucolor.simplePalette()
const console = global.vConsole

class Engine {
	constructor(options) {
		this.options = options
		this.ruleOverrides = {}
		if (this.options.verbose) {
			console.verbosity(5)
		}
		console.debug(`
${clr.title}Resolved Options${clr.normal}:`)
		if (console.canWrite(5)) {
			console.pretty(this.options, 2)
		}
		const esFormatConfig = {
			root: true,
			allowShebang: true,
			indent: {
				value: '\t'
			},
			whiteSpace: {
				before: {
					IfStatementConditionalOpening: -1
				},
				after: {
					IfStatementConditionalClosing: -1,
					FunctionReservedWord: 1
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
			esLintConfig.rules.indent = [
				2, 'tab', {
					SwitchCase: 1
				}
			]
		}
		console.debug(`
${clr.option}esFormatter Options${clr.normal}:`)
		if (console.canWrite(5)) {
			console.pretty(esFormatConfig, 2)
		}
		console.debug(`
${clr.option}esLint Options${clr.normal}:`)
		if (console.canWrite(5)) {
			console.pretty(esLintConfig, 2)
		}
		this.esFormatOptions = _esformatter.rc(esFormatConfig)
		this.xoFixer = new _ESLint({
			baseConfig: esLintConfig,
			fix: true,
			rules: this.ruleOverrides
		})
	}

	format(buffer_) {
		let report
		let output
		try {
			buffer_ = _esformatter.format(buffer_, this.esFormatOptions)
		} catch (err_) {
			console.trace(`Error while applying formatting. (${err_}). Trying to continue.`)
		}
		try {
			report = this.xoFixer.executeOnText(buffer_, 'StdIO')
		} catch (err_) {
			console.trace(`Error while applying preflight linting/fixing. (${err_}). Trying to continue.`)
		}
		if (report.results[0].output === undefined) {
			output = buffer_
		} else {
			output = report.results[0].output
		}
		if (this.options.lint) {
			console.debug(`
${clr.title}xo-tidy verify formatting...${clr.normal}:`)
			if (console.canWrite(4)) {
				console.info(cardinal.highlight(output, {
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

