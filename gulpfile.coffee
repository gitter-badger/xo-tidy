###
Client Gulp File
###

gulp = require 'gulp'
cordial = require '@thebespokepixel/cordial'

gulp.task 'bump', cordial.version.build.inc
gulp.task 'resetBuild', ['test'], cordial.version.build.reset

gulp.task 'coffee', cordial.compile.coffee 'src/**/*.coffee', './'
gulp.task 'babel', cordial.compile.babel 'src/**/*.js', './'

gulp.task 'babel-format', cordial.format.babel 'src/**/*.js', './'
gulp.task 'xo-format', cordial.format.xo 'lib/**/*.js', 'lib'

gulp.task 'test', cordial.test.ava 'test/*'

gulp.task 'commit', cordial.git.commitAll
gulp.task 'push', cordial.git.pushAll 'origin'
gulp.task 'backup', ['push'], cordial.git.pushAll 'backup'

gulp.task 'publish', ['test'], cordial.npm.publish

gulp.task 'post-flow-release-start', ['resetBuild'], cordial.flow.release.start
gulp.task 'post-flow-release-finish', ['publish', 'push']
gulp.task 'filter-flow-release-start-version', cordial.flow.release.versionFilter
gulp.task 'filter-flow-release-finish-tag-message', cordial.flow.release.tagFilter

gulp.task 'default', ['bump', 'babel-format']
