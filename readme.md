# xo-tidy 

[![Join the chat at https://gitter.im/MarkGriffiths/xo-tidy](https://badges.gitter.im/MarkGriffiths/xo-tidy.svg)](https://gitter.im/MarkGriffiths/xo-tidy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
> Automatic xo code formatter, geared toward post babel output.
>
>![Project status][project-badge]
[![Build Status][build-badge]][travis]
[![Dependency Status][david-badge]][david]
[![devDependency Status][david-dev-badge]][david-dev]
[![XO code style][xo-badge]][xo]
>
>:nut_and_bolt: __Work in Progress__:nut_and_bolt:  
>:warning: Not for production use yet...

Tidy (or lint) Babel/CoffeeScript output or just plain JavaScript to (something approaching) xo style. Mainly concerned with white space, indentation and ASI preferences.

Works as a CLI tool (piping stdin → stdout) and a vinyl stream formatter for gulp/through2. The CLI verbose modes can be very handy in spotting things that could be done better.

```sh
npm install --global @thebespokepixel/xo-tidy # For CLI use

npm i -D @thebespokepixel/xo-tidy # For programmatic use
```

### CLI Options:
```text
-h, --help     Display help.
-v, --version  Print version to stdout. -vv Print name & version.
-V, --verbose  Be verbose. -VV Be loquacious.
--lint         Output linting information, rather than formatted output.
--esnext       Enable ES2015+ rule formatting.
--semicolon    Use --no-semicolon to strip semicolons normally handled by ASI.
--space        Specify number of spaces to indent instead of [tab].
--xopath       Path to start searching for xo configuration.
--color        Force color output. Disable with --no-color
```

Just like xo, configuration data will be applied when found in package.json files as the file system is traversed back to the root.

```js
// ES5
var xoTidy = require('@thebespokepixel/xo-tidy');

// or in Babel/ES2015+
import xoTidy from 'xoTidy'
```

```coffee
# or CoffeeScript
xoTidy = require '@thebespokepixel/xo-tidy'
```


#### Methods

##### formatText (string/buffer, options)

Simply give it source code as text, and it'll return formatted output, unless `lint: true`, which will return linting information.

##### formatStdio (options)

Reads stdio directly and passes the output to stdout.

##### formatBuffer (options)

Useful for gulp tasks, or any other vinyl streams.

```js
gulp.src(src)
  .pipe(xoTidy.formatStream(options_))
  .pipe(gulp.dest(dest))
```

##### Options object:
```js
{
  xopath:    '.',
  lint:      false,
  esnext:    false,
  semicolon: true,
  space:     false,
  rules:     {}
}
```

[project-badge]: http://img.shields.io/badge/status-alpha-red.svg?style=flat
[build-badge]: http://img.shields.io/travis/MarkGriffiths/xo-tidy.svg?branch=master&style=flat
[david-badge]: http://img.shields.io/david/MarkGriffiths/xo-tidy.svg?style=flat
[david-dev-badge]: http://img.shields.io/david/dev/MarkGriffiths/xo-tidy.svg?style=flat
[xo-badge]: https://img.shields.io/badge/code_style-XO-5ed9c7.svg

[travis]: https://travis-ci.org/MarkGriffiths/xo-tidy
[david]: https://david-dm.org/MarkGriffiths/xo-tidy
[david-dev]: https://david-dm.org/MarkGriffiths/xo-tidy#info=devDependencies
[xo]: https://github.com/sindresorhus/xo
