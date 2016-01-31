'use strict';

/*
	xo-barista
	Format Javascript with xo, optimising coffee-script for es6

	Copyright (c) 2015 Mark Griffiths/The Bespoke Pixel

	Permission is hereby granted, free of charge, to any person
	obtaining a copy of this software and associated documentation
	files (the "Software"), to deal in the Software without
	restriction, including without limitation the rights to use, copy,
	modify, merge, publish, distribute, sublicense, and/or sell copies
	of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var _deepAssign, _engine, _options, _package, _stdin, clr, console, setConfiguration;

clr = require('trucolor').simplePalette();

console = global.vConsole != null ? global.vConsole : global.vConsole = require('verbosity').console({
  out: process.stderr
});

_package = require('./package.json');

_engine = require('./lib/engine');

_options = require('pkg-conf');

_stdin = require('get-stdin');

_deepAssign = require('deep-assign');

setConfiguration = function(options_) {
  return {
    lint: options_.lint != null ? options_.lint : options_.lint = false,
    esnext: options_.esnext != null ? options_.esnext : options_.esnext = false,
    semicolon: options_.semicolon != null ? options_.semicolon : options_.semicolon = true,
    barista: options_.barista != null ? options_.barista : options_.barista = false,
    space: options_.space != null ? options_.space : options_.space = false,
    stdio: options_.stdio != null ? options_.stdio : options_.stdio = false,
    rules: {
      semi: [2, 'always']
    }
  };
};

exports.getName = function() {
  return _package.name;
};

exports.getDescription = function() {
  return _package.description;
};

exports.getVersion = function(long) {
  switch (long) {
    case 2:
      return _package.name + " v" + _package.version;
    default:
      return _package.version;
  }
};

exports.formatStdin = function(options_) {
  var _xo;
  if (options_ == null) {
    options_ = {};
  }
  console.info("\n" + clr.title + "Creating esformatter/eslint/xo engine (stdio mode)..." + clr.normal);
  _xo = new _engine(_deepAssign(setConfiguration(options_), _options.sync('xo', '..')));
  return _stdin().then(function(buffer) {
    var err, error;
    try {
      process.stdout.write(_xo.format(buffer) + "\n");
    } catch (error) {
      err = error;
      console.error(err);
      return process.exit(1);
    }
  });
};

exports.formatText = function(buffer_, options_) {
  var _xo;
  if (options_ == null) {
    options_ = {};
  }
  console.info("\n" + clr.title + "Creating xo-barista engine (text mode)..." + clr.normal);
  _xo = new _engine(_deepAssign(setConfiguration(options_), _options.sync('xo', '..')));
  return _xo.format(buffer_.toString());
};

exports.formatFiles = function() {
  console.info("\n" + clr.title + "Creating esformatter/eslint/xo engine (files mode)..." + clr.normal);
  throw new Error("Not implemented.");
};
