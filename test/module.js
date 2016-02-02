'use strict'

import pkg from '../package.json'
// import stream from 'stream'
import test from 'ava'
import shell from 'shelljs'
import semverRegex from 'semver-regex'
import xoTidy from '../index.js'
// const StreamProxy = new stream.PassThrough()
// StreamProxy.setEncoding('utf8')

test(`Module name is '${pkg.name}'.`, t => {
	t.is(xoTidy.getName(), `${pkg.name}`)
})

test(`Module description is '${pkg.description}'.`, t => {
	t.is(xoTidy.getDescription(), `${pkg.description}`)
})

test(`Module version is '${pkg.version}'.`, t => {
	t.is(xoTidy.getVersion(), `${pkg.version}`)
})

test(`Module version '${pkg.version} is semver'.`, t => {
	t.ok(semverRegex().test(xoTidy.getVersion()))
})

const fixtureA = shell.cat('fixtures/in/xotest.js')
const fixtureB = shell.cat('fixtures/in/xotest2.js')

test('File transform A1', t => {
	const fixtureOut = shell.cat('fixtures/out/xotest.js')
	const formatted = xoTidy.formatText(fixtureA)
	t.is(formatted, fixtureOut)
})

test('File transform A2', t => {
	const fixtureOut = shell.cat('fixtures/out/xotest.noxo.js')
	const formatted = xoTidy.formatText(fixtureA, {xopath: '/'})
	t.is(formatted, fixtureOut)
})

test('File transform A3', t => {
	const fixtureOut = shell.cat('fixtures/out/xotest.space.js')
	const formatted = xoTidy.formatText(fixtureA, {xopath: '/', space: 2})
	t.is(formatted, fixtureOut)
})

test('File transform B1', t => {
	const fixtureOut = shell.cat('fixtures/out/xotest2.js')
	const formatted = xoTidy.formatText(fixtureB)
	t.is(formatted, fixtureOut)
})

test('File transform B2', t => {
	const fixtureOut = shell.cat('fixtures/out/xotest2.noxo.js')
	const formatted = xoTidy.formatText(fixtureB, {xopath: '/'})
	t.is(formatted, fixtureOut)
})

test('File transform B3', t => {
	const fixtureOut = shell.cat('fixtures/out/xotest2.space.js')
	const formatted = xoTidy.formatText(fixtureB, {xopath: '/', space: 3})
	t.is(formatted, fixtureOut)
})
