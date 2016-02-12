'use strict'
/*
	xo-tidy
	Core Engine
 */

const clr = require('trucolor').simplePalette()
const cardinal = require('cardinal')
const ESformatter = require('esformatter')
const ESlint = require('eslint').CLIEngine
const console = global.vConsole
const cr = '\n'
const tab = '\t'

class Engine {
	constructor(options) {
		this.options = options
		if (this.options.verbose) {
			console.verbosity(5)
		}
		console.debug(`${ cr }${ clr.title }Resolved Options${ clr.normal }:`)
		if (console.canWrite(5)) {
			console.pretty(this.options, 2)
		}
		const noEqNull = {
			tokenAfter: token => {
				if (token.type === 'Punctuator') {
					if (token.value === '==' && token.next.next.type === 'Null') {
						token.value = '==='
						token.next.next.value = 'undefined'
					}
					if (token.value === '!=' && token.next.next.type === 'Null') {
						token.value = '!=='
						token.next.next.value = 'undefined'
					}
				}
			}
		}
		ESformatter.register(noEqNull)
		ESformatter.register(require('esformatter-var-each'))
		ESformatter.register(require('esformatter-dot-notation'))
		ESformatter.register(require('esformatter-parseint'))
		ESformatter.register(require('esformatter-semicolons'))
		ESformatter.register(require('esformatter-limit-linebreaks'))
		const ESFormatConfig = {
			root: true,
			allowShebang: true,
			indent: {
				value: tab
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
		if (this.options.space > 0) {
			ESFormatConfig.indent.value = ' '.repeat(parseInt(this.options.space, 10))
		}
		const ESLintConfig = {
			rules: this.options.rules
		}
		ESLintConfig.extends = 'xo'
		if (this.options.esnext) {
			ESLintConfig.extends = 'xo/esnext'
		}
		if (!this.options.semicolon) {
			ESLintConfig.rules.semi = [2, 'never']
		}
		if (this.options.space === false) {
			ESLintConfig.rules.indent = [2, 'tab', {
				SwitchCase: 1
			}]
		} else {
			ESLintConfig.rules.indent = [2, parseInt(this.options.space, 10), {
				SwitchCase: 0
			}]
		}
		console.debug(`${ cr }${ clr.option }esFormatter Options${ clr.normal }:`)
		if (console.canWrite(5)) {
			console.pretty(ESFormatConfig, 2)
		}
		console.debug(`${ cr }${ clr.option }ESlint Options${ clr.normal }:`)
		if (console.canWrite(5)) {
			console.pretty(ESLintConfig, 2)
		}
		this.esFormatOptions = ESformatter.rc(ESFormatConfig)
		this.xoFixer = new ESlint({
			baseConfig: ESLintConfig,
			fix: true,
			rules: this.options.rules
		})
	}

	format(buffer_) {
		let report
		let output
		try {
			buffer_ = ESformatter.format(buffer_, this.esFormatOptions)
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
			console.debug(`${ cr }${ clr.title }xo-tidy verify formatting...${ clr.normal }:`)
			if (console.canWrite(4)) {
				console.info(cardinal.highlight(output, {
					linenos: true
				}))
			}
			process.stderr.write(ESlint.getFormatter()(report.results))
			process.exit(0)
		}
		return output
	}
}
module.exports = Engine
