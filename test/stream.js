'use strict'

import vfs from 'vinyl-fs'
import test from 'ava'
import shell from 'shelljs'
import xoTidy from '../index.js'

test.cb('File transform A1', t => {
	const files = []
	vfs.src('fixtures/in/xotest.js', {cwd: __dirname})
		.pipe(xoTidy.formatStream())
		.on('data', file => files.push(file))
		.once('end', () => {
			t.is(files.length, 2)
			t.same(files[0].contents.toString(), shell.cat('fixtures/out/xotest.js'))
			t.end()
		})
})

test.cb('File transform A2', t => {
	const files = []
	vfs.src('fixtures/in/xotest.js', {cwd: __dirname})
		.pipe(xoTidy.formatStream({xopath: '/'}))
		.on('data', file => files.push(file))
		.once('end', () => {
			t.is(files.length, 2)
			t.same(files[0].contents.toString(), shell.cat('fixtures/out/xotest.noxo.js'))
			t.end()
		})
})

test.cb('File transform A3', t => {
	const files = []
	vfs.src('fixtures/in/xotest.js', {cwd: __dirname})
		.pipe(xoTidy.formatStream({xopath: '/', space: 2}))
		.on('data', file => files.push(file))
		.once('end', () => {
			t.is(files.length, 2)
			t.same(files[0].contents.toString(), shell.cat('fixtures/out/xotest.space.js'))
			t.end()
		})
})

test.cb('File transform B1', t => {
	const files = []
	vfs.src('fixtures/in/xotest2.js', {cwd: __dirname})
		.pipe(xoTidy.formatStream())
		.on('data', file => files.push(file))
		.once('end', () => {
			t.is(files.length, 2)
			t.same(files[0].contents.toString(), shell.cat('fixtures/out/xotest2.js'))
			t.end()
		})
})

test.cb('File transform B2', t => {
	const files = []
	vfs.src('fixtures/in/xotest2.js', {cwd: __dirname})
		.pipe(xoTidy.formatStream({xopath: '/'}))
		.on('data', file => files.push(file))
		.once('end', () => {
			t.is(files.length, 2)
			t.same(files[0].contents.toString(), shell.cat('fixtures/out/xotest2.noxo.js'))
			t.end()
		})
})

test.cb('File transform B3', t => {
	const files = []
	vfs.src('fixtures/in/xotest2.js', {cwd: __dirname})
		.pipe(xoTidy.formatStream({xopath: '/', space: 3}))
		.on('data', file => files.push(file))
		.once('end', () => {
			t.is(files.length, 2)
			t.same(files[0].contents.toString(), shell.cat('fixtures/out/xotest2.space.js'))
			t.end()
		})
})
