/**
 * Created by kevin on 2014-09-07.
 */

define(function (require) {

  var MathSymbols = require('view/math_symbols');
  var $ = require('jquery');

  require('jquery_extensions');

  var Formatter = {};

  Formatter.formatArithmetic = function (xml) {
    this.fixNegativeNumbers(xml);
    this.createFractions(xml);
    this.removeUnnecessaryParentheses(xml);
    this.removeUnnecessaryRows(xml);

    $(xml).find('[parens="true"]').each(function () {
      $(this).before('<mo>(</mo>');
      $(this).after('<mo>)</mo>');
    });

    $(xml).findOp('*').each(function () {
      var next = $(this).next();
      if (next.is('mrow') && next.hasAddOps()) {
        next.before('<mo>(</mo>');
        next.after('<mo>)</mo>');
      }
    });

    this.formatArithmeticOperators(xml);
  };

  Formatter.formatAlgebra = function (xml) {
    // TODO: think about the ordering of these transformations

    this.createFractions(xml);

    $(xml).find('mfrac').each(function () {
      $(this).children().last().removeAttr('parens');
    });

    this.fixNegativeNumbers(xml);
    this.formatAlgebraicMultiplication(xml);

    $(xml).find('[unary="minus"]').each(function () {
      // TODO: check if my parent is a <msup>
      $(this).prepend('<mo>-</mo>');
    });
//    this.removeUnnecessaryParentheses(xml);
  };


  Formatter.fixNegativeNumbers = function(xml) {
    $(xml).find('mn').each(function () {
      var num = $(this).text();
      if (num.indexOf('-') !== -1) {
        num = -parseFloat(num);
        var mrow = '<mrow class="' + $(this).attr('class') + '"><mo>-</mo><mn>' + num + '</mn></mrow>';
        if ($(this).parent().is('mfrac') || $(this).parent().is('msup')) {
          $(this).replaceWith(mrow);
        } else {
          $(this).replaceWith('<mo stretchy="false">(</mo>' + mrow + '<mo stretchy="false">)</mo>');
        }
      }
    });

    $(xml).find('mi').each(function () {
      var identifier = $(this).text();
      if (identifier.indexOf('-') !== -1) {
        identifier = identifier.substring(identifier.indexOf('-') + 1);
        var mrow = '<mrow class="' + $(this).attr('class') + '"><mo>-</mo><mi>' + identifier + '</mi></mrow>';

        if ($(this).parent().is('mfrac') || $(this).parent().is('msup')) {
          $(this).replaceWith(mrow);
        } else {
          $(this).replaceWith('<mo stretchy="false">(</mo>' + mrow + '<mo stretchy="false">)</mo>');
        }
      }
    });
  };

  Formatter.createFractions = function (xml) {
    $(xml).find('mo').each(function () {
      if ($(this).text() === '/') {
        var frac = $('<mfrac>').append($(this).prev(), $(this).next());
        $(this).replaceWith(frac);
        $(frac).findOp('(').attr('stretchy', false);
        $(frac).findOp(')').attr('stretchy', false);
      }
    });
    // TODO: clean this up a bit
    $(xml).find('mrow mfrac').each(function () {
      // remove unnecessary mrows
      if ($(this).siblings().length === 0 && $(this).parent().attr('parens') !== 'true') {
        $(this).unwrap();
      }
    });
  };

  Formatter.formatArithmeticOperators = function (xml) {
    $(xml).find('mo').each(function () {
      if ($(this).text() === '/') {
        $(this).text(MathSymbols.division);
      }
      if ($(this).text() === '*') {
        $(this).text(MathSymbols.times);
      }
      if ($(this).text() === '-') {
        $(this).text(MathSymbols.minus);
      }
    });
  };

  Formatter.formatAlgebraicMultiplication = function (xml) {
    // add parens="true" if neccessary
    $(xml).findOp('*').each(function () {
      if ($(this).next().is('mn') || $(this).next().is('mrow')) {
        $(this).next().attr('parens', 'true');
      }
      if ($(this).prev().is('mrow') || $(this).prev().is('mn') && $(this).next().is('mn')) {
        $(this).prev().attr('parens', 'true');
      }
      $(this).remove();
    });

    // turns parens="true" into parentheses
    $(xml).find('[parens="true"]').each(function () {
      if ($(this).is('mrow') && ($(this).parent().is('msup') || $(this).parent().is('mfrac'))) {
        $(this).prepend('<mo>(</mo>');
        $(this).append('<mo>)</mo>');
      } else {
        $(this).before('<mo>(</mo>');
        $(this).after('<mo>)</mo>');
      }
      $(this).removeAttr('parens');
      if ($(this).children().length === 1 && $(this).children().first().is('mfrac')) {
        $(this).children().first().unwrap();
      }
    });
  };

  // TODO: add a separate function to remove parentheses from denominators
  Formatter.removeUnnecessaryParentheses = function (xml) {
    $(xml).findOp('(').each(function () {
      if ($(this).parent().is('mrow') && $(this).parent().parent().is('mfrac')) {
        var parent = this.parentElement;
        $(parent.firstElementChild).remove();
        $(parent.lastElementChild).remove();
      }
    });
  };

  Formatter.removeUnnecessaryRows = function (xml) {
    $(xml).find('mrow').each(function () {
      var children = $(this).children();
      if ($(this).is('mrow') && children.length === 1 && !$(children[0]).is('mfrac')) {
        $(this).unwrap();
      } else if ($(this).is('mrow') && $(this.firstElementChild).text() === '(' && $(this.lastElementChild).text() === ')') {
        if ($(this).parent().is('mfrac')) {
          // removes parentheses
          // TODO: move it to the parenthese function
          $(this.firstElementChild).remove();
          $(this.lastElementChild).remove();
        } else {
          $(this).replaceWith($(this).children());
        }
      }
    });
  };

  return Formatter;
});
