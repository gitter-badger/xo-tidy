# xo-tidy 
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

More to come here.

Uses esFormatter and ESLint with xo's rules to automatically format javascript to xo format.

### Options:
```text
  -h, --help     Display this help.
  -v, --version  Return the current version on stdout. -vv Return name & version.
  -V, --verbose  Be verbose. -VV Be loquacious.
  --lint         Output linting information, rather than formatted output.
  --esnext       Enable ES2015+ rule formatting.
  --nosemicolon  Strip semicolons normally handled by ASI.
  --space        Specify number of spaces to indent instead of [tab].
  --color        Force color output. Disable with --no-color
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
