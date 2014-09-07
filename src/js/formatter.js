/**
 * Created by kevin on 2014-09-07.
 */

define(function (require) {

  var MathSymbols = require('math_symbols');

  var Formatter = {};

  Formatter.formatArithmetic = function (view) {
    this.fixNegativeNumbers(view);
    this.createFractions(view);
    this.formatArithmeticOperators(view);
    this.removeUnnecessaryParentheses(view);
    this.removeUnnecessaryRows(view);
  };

  Formatter.formatAlgebra = function (view) {
    // TODO: think about the ordering of these transformations

    this.fixNegativeNumbers(view);
    this.createFractions(view);
    this.formatAlgebraicMultiplication(view);
    this.removeUnnecessaryParentheses(view);
  };


  Formatter.fixNegativeNumbers = function(view) {
    $(view.xml).find('mn').each(function () {
      var num = $(this).text();
      if (num.indexOf('-') !== -1) {
        num = -parseFloat(num);
        $(this).replaceWith('<mrow class="num"><mo stretchy="false">(</mo><mo>-</mo><mn>' + num + '</mn><mo stretchy="false">)</mo></mrow>');
      }
    });
  };

  Formatter.createFractions = function (view) {
    $(view.xml).find('mo').each(function () {
      if ($(this).text() === '/') {
        var frac = $('<mfrac>').append($(this).prev(), $(this).next());
        $(this).replaceWith(frac);
        $(frac).findOp('(').attr('stretchy', false);
        $(frac).findOp(')').attr('stretchy', false);
      }
    });
  };

  Formatter.formatArithmeticOperators = function (view) {
    $(view.xml).find('mo').each(function () {
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

  Formatter.formatAlgebraicMultiplication = function (view) {
    $(view.xml).findOp('*').each(function () {
      if ($(this).attr('display') !== 'none') {
        if ($(this.nextElementSibling).hasAddOps()) {
          $(this).wrapInnerWithParentheses();
        } else {
          $(this).wrapWithParentheses();
        }
      }
      $(this).remove();
    });
  };

  // TODO: add a separate function to remove parentheses from denominators
  Formatter.removeUnnecessaryParentheses = function (view) {
    $(view.xml).findOp('(').each(function () {
      if ($(this).next().next().text() === ')' && !$(this).next().is('mrow')) {
        $(this).next().next().remove();
        $(this).remove();
      } else if ($(this).parent().is('mrow') && $(this).parent().parent().is('mfrac')) {
        var parent = this.parentElement;
        $(parent.firstElementChild).remove();
        $(parent.lastElementChild).remove();
      }
    });
  };

  Formatter.removeUnnecessaryRows = function (view) {
    $(view.xml).find('mrow').each(function () {
      var children = $(this).children();
      if ($(this).is('mrow') && children.length === 1 && !$(children[0]).is('mfrac')) {
        $(this).unwrap();
      } else if ($(this).is('mrow') && $(this.firstElementChild).text() === '(' && $(this.lastElementChild).text() === ')' && $(this).parent().is('mfrac')) {
        $(this.firstElementChild).remove();
        $(this.lastElementChild).remove();
      }
    });
  };

  return Formatter;
});
