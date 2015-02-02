/**
 * Created by kevin on 2014-09-03.
 */

define(function (require) {

  var $ = require('jquery');
  var uuid = require('util/uuid');

  $.fn.extend({
    hasAddOps: function () {
      var result = false;
      this.children().each(function () {
        if ($(this).is('mo')) {
          if ($(this).text() === '+' || $(this).text() === '-') {
            result = true;
          }
        }
      });
      return result;
    },

    hasMulOps: function () {
      var result = false;
      this.children().each(function () {
        if ($(this).is('mo')) {
          if ($(this).text() === '*' || $(this).text() === '/') {
            result = true;
          }
        }
      });
      return result;
    },

    isFraction: function () {
      return this.children().length === 3 && this.children(':nth-child(2)').isOp('/');
    },

    hasEqualSign: function () {
      var result = false;
      this.children().each(function () {
        if ($(this).is('mo')) {
          if ($(this).text() === '=') {
            result = true;
          }
        }
      });
      return result;
    },

    hasVariableFactors: function () {
      if ($(this).is('mi')) {
        return true;
      } else if ($(this).hasMulOps()) {
        var result = false;
        $(this).children().each(function () {
          if ($(this).is('mi')) {
            result = true;
          }
        });
        return result;
      }
      return false;
    },

    // TODO: figure out what to do with factors that are powers
    getVariableFactors: function () {
      var result = [];
      if (this.is('mi')) {
        result.push(this.text());
      } else if (this.hasMulOps()) {
        $(this).children().each(function () {
          if ($(this).is('mi')) {
            result.push($(this).text());
          }
        });
      }
      return result;
    },

    getVariables: function () {
      return this.getVariableFactors().map(function (name, index) {
        if (index > 0) {
          return '<mo class="op" id="' + uuid() + '">*</mo>' + '<mi>' + name + '</mi>';
        } else {
          return '<mi>' + name + '</mi>';
        }
      }).join('');
    },

    getNumericFactors: function () {
      var result = [];
      if (this.is('mn')) {
        result.push(this.text());
      } else if (this.hasMulOps()) {
        $(this).children().each(function () {
          if ($(this).is('mn')) {
            result.push($(this).text());
          }
        });
      }
      return result;
    },

    getCoefficient: function () {
      return this.getNumericFactors().reduce(function (result, value) {
        return value * result;
      }, 1);
    },

    numerator: function () {
      if (this.isFraction()) {
        return this.children().first();
      }
    },

    denominator: function () {
      if (this.isFraction()) {
        return this.children().last();
      }
      return [];
    },

    isTerm: function () {
      return this.hasMulOps() || this.is('mn') || this.is('mi');
    },

    findOp: function (op) {
      return this.find('mo').filter(function () {
        return $(this).text() === op;
      });
    },

    findVar: function (v) {
      return this.find('mi').filter(function () {
        return $(this).text() === v;
      });
    },

    isOp: function (op) {
      return this.is('mo') && this.text() === op;
    },

    removeExtra: function (tag) {
      this.find(tag).each(function () {
        var children = $(this).children();
        if ($(this).is(tag) && children.length === 1) {
          $(this).replaceWith(children[0]);
        }
      });
    },

    wrapWithParentheses: function () {
      this.next().before('<mo stretchy="false">(</mo>').after('<mo stretchy="false">)</mo>'); // wrap in parentheses
      return this;
    },

    wrapInnerWithParentheses: function () {
      this.next().prepend('<mo stretchy="false">(</mo>').append('<mo stretchy="false">)</mo>');
      return this;
    },

    number: function () {
      return parseFloat(this.text());
    }
  });

});
