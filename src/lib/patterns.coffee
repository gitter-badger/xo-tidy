'use strict'
###
	xo-barista
	Code signatures
###
module.exports =
	coffee_vars:            /var ([_.\-A-Za-z0-9]+)/
	coffee_multivars:       /^([ ]*)var ([_.\-A-Za-z0-9]+), ([, _.\-A-Za-z0-9]+);/m
	coffee_splat:           /^[ ]*([_.\-A-Za-z0-9]+) = 1 <= arguments\.length \? slice\.call\(arguments, 0\) : \[\];[\n]*/m
	coffee_parens:          /([()]+) ([()]+)/g
	coffee_class:           /^([A-Z_][_.\-A-Za-z0-9]+) = \(function\(/m
	coffee_class_noextend:  /^([A-Z_][_.\-A-Za-z0-9]+) = \(function\(\)/m
	coffee_class_extends:   /^[A-Z_][_.\-A-Za-z0-9]+ = \(function\(superClass\)/m
	coffee_class_super:     /\n\}\)\(([_.\-A-Za-z0-9]+)\);/
	coffee_class_close:     /\n\}\)\(\);/
	bind_signature:         /[ ]*bind = function.+[,;][\n]*/
	bind_declaration:			/[ ]*this\.[_.\-A-Za-z0-9]+ = bind\(this.+\);[\n]*/g
	extend_signature:       /[ ]*extend = function.+[,;][\n]*/
	hasProp_signature:      /[ ]*hasProp = \{\}\.hasOwnProperty[,;][\n]*/
	slice_signature:        /[ ]*slice = .+[,;][\n]*/
