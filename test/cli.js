'use strict'

import shell from 'shelljs'
import pkg from '../package.json'
import test from 'ava'

test.cb(`Module name/version is '${pkg.name}'.`, t => {
	shell.exec('/usr/bin/env node ../lib/cli/index.js -vv', {
		silent: true
	}, (code_, out_) => {
		t.is(code_, 0)
		t.is(out_, `${pkg.name} v${pkg.version}`)
		t.end()
	})
})

test.cb('File transform A1', t => {
	const fixture = shell.cat('fixtures/out/xotest.js')
	shell.exec('cat fixtures/in/xotest.js | /usr/bin/env node ../lib/cli/index.js --xopath .', {
		silent: true
	}, (code_, out_) => {
		t.is(code_, 0)
		t.is(out_, fixture)
		t.end()
	})
})

test.cb('File transform A2', t => {
	const fixture = shell.cat('fixtures/out/xotest.noxo.js')
	shell.exec('cat fixtures/in/xotest.js | /usr/bin/env node ../lib/cli/index.js --xopath /', {
		silent: true
	}, (code_, out_) => {
		t.is(code_, 0)
		t.is(out_, fixture)
		t.end()
	})
})

test.cb('File transform A3', t => {
	const fixture = shell.cat('fixtures/out/xotest.space.js')
	shell.exec('cat fixtures/in/xotest.js | /usr/bin/env node ../lib/cli/index.js --xopath / --space 2', {
		silent: true
	}, (code_, out_) => {
		t.is(code_, 0)
		t.is(out_, fixture)
		t.end()
	})
})

test.cb('File transform B1', t => {
	const fixture = shell.cat('fixtures/out/xotest2.js')
	shell.exec('cat fixtures/in/xotest2.js | /usr/bin/env node ../lib/cli/index.js --xopath .', {
		silent: true
	}, (code_, out_) => {
		t.is(code_, 0)
		t.is(out_, fixture)
		t.end()
	})
})

test.cb('File transform B2', t => {
	const fixture = shell.cat('fixtures/out/xotest2.noxo.js')
	shell.exec('cat fixtures/in/xotest2.js | /usr/bin/env node ../lib/cli/index.js --xopath /', {
		silent: true
	}, (code_, out_) => {
		t.is(code_, 0)
		t.is(out_, fixture)
		t.end()
	})
})

test.cb('File transform B3', t => {
	const fixture = shell.cat('fixtures/out/xotest2.space.js')
	shell.exec('cat fixtures/in/xotest2.js | /usr/bin/env node ../lib/cli/index.js --xopath / --space 3', {
		silent: true
	}, (code_, out_) => {
		t.is(code_, 0)
		t.is(out_, fixture)
		t.end()
	})
})
