/**
 * Created by kevin on 2014-09-07.
 */

define(function (require) {

  var MathSymbols = require('math_symbols');

  var Formatter = {};

  Formatter.formatArithmetic = function (xml) {
    this.fixNegativeNumbers(xml);
    this.createFractions(xml);
    this.formatArithmeticOperators(xml);
    this.removeUnnecessaryParentheses(xml);
    this.removeUnnecessaryRows(xml);
  };

  Formatter.formatAlgebra = function (xml) {
    // TODO: think about the ordering of these transformations

    this.fixNegativeNumbers(xml);
    this.createFractions(xml);
    this.formatAlgebraicMultiplication(xml);
    this.removeUnnecessaryParentheses(xml);
  };


  Formatter.fixNegativeNumbers = function(xml) {
    $(xml).find('mn').each(function () {
      var num = $(this).text();
      if (num.indexOf('-') !== -1) {
        num = -parseFloat(num);
        $(this).replaceWith('<mrow class="num"><mo stretchy="false">(</mo><mo>-</mo><mn>' + num + '</mn><mo stretchy="false">)</mo></mrow>');
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
    $(xml).findOp('*').each(function () {
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
  Formatter.removeUnnecessaryParentheses = function (xml) {
    $(xml).findOp('(').each(function () {
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

  Formatter.removeUnnecessaryRows = function (xml) {
    $(xml).find('mrow').each(function () {
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
