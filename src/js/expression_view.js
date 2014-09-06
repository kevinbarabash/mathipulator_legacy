/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {

  var MathSymbols = require('math_symbols');
  var SVGUtils = require('svg_utils');
  var $ = require('jquery');

  require('jquery_extensions');

  // TODO: add options parameter
  // TODO: create factory methods for specific sets of options
  // TODO: once options have been element, santize xml on creation
  function ExpressionView(xml) {
    this.xml = $(xml).clone().get(0);
  }

  ExpressionView.prototype.fixNegativeNumbers = function() {
    $(this.xml).find('mn').each(function () {
      var num = $(this).text();
      if (num.indexOf('-') !== -1) {
        num = -parseFloat(num);
        $(this).replaceWith('<mrow class="num"><mo stretchy="false">(</mo><mo>-</mo><mn>' + num + '</mn><mo stretchy="false">)</mo></mrow>');
      }
    });
  };

  ExpressionView.prototype.createFractions = function () {
    $(this.xml).find('mo').each(function () {
      if ($(this).text() === '/') {
        var frac = $('<mfrac>').append($(this).prev(), $(this).next());
        $(this).replaceWith(frac);
        stretchyFalse(frac);
      }
    });
  };

  ExpressionView.prototype.formatArithmeticOperators = function () {
    $(this.xml).find('mo').each(function () {
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

  // TODO: add a separate function to remove parentheses from denominators
  ExpressionView.prototype.removeUnnecessaryParentheses = function () {
    $(this.xml).findOp('(').each(function () {
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

  ExpressionView.prototype.removeUnnecessaryRows = function () {
    $(this.xml).find('mrow').each(function () {
      var children = $(this).children();
      if ($(this).is('mrow') && children.length === 1 && !$(children[0]).is('mfrac')) {
        $(this).unwrap();
      } else if ($(this).is('mrow') && $(this.firstElementChild).text() === '(' && $(this.lastElementChild).text() === ')' && $(this).parent().is('mfrac')) {
        $(this.firstElementChild).remove();
        $(this.lastElementChild).remove();
      }
    });
  };

  function stretchyFalse(elem) {
    $(elem).children().each(function () {
      if (this.tagName === 'MO') {
        var text = $(this).text();
        if (text === '(' || text === ')') {
          $(this).attr('stretchy', 'false');
        }
      }
      stretchyFalse(this);
    });
  }

  ExpressionView.prototype.arithmeticFormatter = function () {
    this.fixNegativeNumbers();
    this.createFractions();
    this.formatArithmeticOperators();
    this.removeUnnecessaryParentheses();
    this.removeUnnecessaryRows();
  };

  // TODO: extract formatter objects along with all of these methods like .fixNegativeNumbers, etc.
  ExpressionView.prototype.algebraFormatter = function () {
    this.fixNegativeNumbers();
    this.createFractions();
    // TODO: think about the ordering of these transformations

    $(this.xml).findOp('*').each(function () {
      if ($(this).attr('display') !== 'none') {
        if ($(this.nextElementSibling).hasAddOps()) {
          $(this).wrapInnerWithParentheses();
        } else {
          $(this).wrapWithParentheses();
        }
      }
      $(this).remove();
    });

    this.removeUnnecessaryParentheses();
  };

  ExpressionView.prototype.createSelectionOverlay = function (svg) {
    var selectionGroup = SVGUtils.createSVGElement('g');
    selectionGroup.setAttribute('class', 'selectionOverlay');
    $(selectionGroup).appendTo(svg.firstElementChild);

    this.addCircles(svg, selectionGroup);
    this.addNumberHighlights(svg, selectionGroup);
  };

  ExpressionView.prototype.addCircles = function (svg, selectionGroup) {
    var view = this;

    $(svg).find('.op').each(function () {
      var op = this;
      var node = $(view.xml).find('#' + op.id); // xml is actually mathML... precision of language
      var circle = SVGUtils.createCircleAroundOperator(op, node);
      $(circle).click(function () {
        $(view).trigger('operatorClick', $(this).attr('for'));
      }).appendTo(selectionGroup);
    });
  };

  ExpressionView.prototype.addNumberHighlights = function (svg, selectionGroup) {
    var view = this;

    $(svg).find('.num').each(function () {
      var num = this;
      var rect = SVGUtils.createRectangleAroundNumber(num);
      $(rect).click(function () {
        $(view).trigger('numberClick', $(this).attr('for'));
      }).appendTo(selectionGroup);
    });
  };

  ExpressionView.prototype.render = function () {
    var script = document.createElement('script');
    $(script).attr('type', 'math/mml').text(this.xml.outerHTML).appendTo(document.body);

    var deferred = $.Deferred();

    MathJax.Hub.Queue(['Typeset', MathJax.Hub, script], function () {
      var svg = $('#' + script.id + '-Frame' + ' svg').get(0);
      deferred.resolve(svg);
    });

    return deferred;
  };

  return ExpressionView;
});
