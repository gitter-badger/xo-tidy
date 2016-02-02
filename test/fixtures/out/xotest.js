/*
 * grunt-esformatter
 *
 * Copyright (c) 2013 Jörn Zaefferer, contributors
 * Licensed under the MIT license.
 */

'use strict'

module.exports = function (grunt) {
	grunt.registerMultiTask('esformatter', 'Format JS files', gruntEsformatter)

	function gruntEsformatter() {
		var esformatter = require('esformatter')
		var options = this.options();

		(options.plugins || []).forEach(registerPlugin)

		this.files.forEach(formatFileList)

		function formatFileList(file) {
			file.src
				.filter(assertFile)
				.forEach(formatFile)
		}

		function registerPlugin(name) {
			esformatter.register(require(name))
		}

		function assertFile(filePath) {
			if (grunt.file.exists(filePath)) {
				return true
			}
			grunt.log.warn('Source file "' + filePath + '" not found.')
			return false
		}

		function formatFile(file) {
			var formatted
			var firstLine
			var content = grunt.file.read(file)

			if (options.skipHashbang) {
				firstLine = content.match(/^#!.+\n/)
				content = content.replace(firstLine, '')
			}

			try {
				formatted = esformatter.format(content, options)
			} catch (e) {
				grunt.log.error('Exception while formatting ' + file)
				grunt.log.error(e.stack)
				return
			}

			if (options.skipHashbang && firstLine) {
				formatted = firstLine + formatted
			}

			grunt.file.write(file, formatted)
			grunt.log.writeln('File ' + file + ' formatted.')
		}
	}
}
