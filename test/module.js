'use strict'
import pkg from '../package.json'
import stream from 'stream'
import test from 'ava'
import xoTidy from '..'
import semverRegex from 'semver-regex'

const StreamProxy = new stream.PassThrough()
StreamProxy.setEncoding('utf8')

test(`Module name is '${pkg.name}'.`, t => {
	t.is(`${pkg.name}`, xoTidy.getName())
})

test(`Module description is '${pkg.description}'.`, t => {
	t.is(`${pkg.description}`, xoTidy.getDescription())
})

test(`Module version is '${pkg.version}'.`, t => {
	t.is(`${pkg.version}`, xoTidy.getVersion())
})

test(`Module version '${pkg.version} is semver'.`, t => {
	t.ok(semverRegex().test(xoTidy.getVersion()))
})
