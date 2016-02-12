'use strict';
/*
 trucolor
 Color Output
 */
var _package = require('../package.json');
var terminalFeatures = require('term-ng');
var converter = require('color-convert');
var SGRcomposer = require('sgr-composer');
var colorOptionsSelected = _package.config.cli.selected;
var colorOptions = _package.config.cli[colorOptionsSelected];
var colorLevel = (terminalFeatures.color.level) ? terminalFeatures.color.level : 0;

function Output(color_, styles_, options_) {
   this.hasRGB = false;
   if (color_ !== undefined) {
      styles_.color = (function () {
         switch (false) {
         case !/^[#][0-9a-f]{6}$/i.test(color_):
            this.hasRGB = true;
            return converter.hex.rgb(color_);
         case !Array.isArray(color_):
            this.hasRGB = true;
            return color_;
         case color_ !== 'reset' && color_ !== 'normal':
            this.hasReset = true;
            return color_;
         default:
            throw new Error('Unrecognised color: ' + color_);
         }
      }).call(this);
   }
   var ref1;
   var ref2;
   if ((global.trucolor_CLI_type !== undefined) && ((ref1 = global.trucolor_CLI_type) !== 'default' && ref1 !== colorOptionsSelected)) {
      colorOptionsSelected = global.trucolor_CLI_type;
      colorOptions = _package.config.cli[colorOptionsSelected];
   }
   this._buffer = new SGRcomposer((ref2 = options_.force) === undefined ? ref2 : colorLevel, styles_);
}

Output.prototype.valueOf = function () {
   var style;
   var styling;
   if (global.trucolor_CLI_type !== undefined) {
      styling = ((function () {
         var i;
         var len;
         var ref1;
         var results;
         ref1 = this._buffer.styleArray;
         results = [];
         for (i = 0, len = ref1.length; i < len; i++) {
            style = ref1[i];
            results.push(colorOptions[style]);
         }
         return results;
      }).call(this)).join(' ');
      if (styling.length) {
         styling += ' ';
      }
      if (this.hasRGB) {
         switch (colorOptions.color) {
         case 'hex':
            return styling + this._buffer.hex;
         default:
            return this._buffer.red + ' ' + this._buffer.green + ' ' + this._buffer.blue;
         }
      } else if (this.hasReset) {
         switch (this._buffer.color) {
         case 'normal':
            return colorOptions.normal;
         default:
            return colorOptions.reset;
         }
      } else {
         return this._buffer.sgr().in;
      }
   } else if (this.hasRGB) {
      return this._buffer.hex;
   } else if (this.hasReset) {
      return this._buffer.color;
   } else {
      return this._buffer.sgr().in;
   }
};

Output.prototype.toString = function () {
   var output;
   if (this.hasRGB) {
      output = ('rgb(' + this._buffer.red + ', ' + this._buffer.green + ', ' + this._buffer.blue) + ')';
   } else if (this.hasReset) {
      output = this._buffer.color;
   } else {
      output = colorOptions.reset;
   }
   return output;
};

Output.prototype.toSwatch = function () {
   var sgr;
   var output;
   sgr = this._buffer.sgr(['bold', 'italic', 'underline', 'invert']);
   if (colorLevel > 0) {
      output = sgr.in + '\u2588\u2588' + sgr.out;
   } else {
      output = '';
   }
   return output;
};

Output.prototype.toSGR = function () {
   return this._buffer.sgr();
};

module.exports = Output;

