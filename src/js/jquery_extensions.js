/**
 * Created by kevin on 2014-09-03.
 */

define(function () {

  jQuery.fn.extend({
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

    findOp: function (op) {
      return this.find('mo').filter(function () {
        return $(this).text() === op;
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
