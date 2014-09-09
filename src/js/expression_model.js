/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  var Parser = require('parser');
  var parser = new Parser();
  var $ = require('jquery');

  require('jquery_extensions');

  var commute = require('transformations/commute');
  var distribute = require('transformations/distribute');
  var evaluate = require('transformations/evaluate');
  var simplify = require('transformations/simplify');

  function ExpressionModel() {}

  ExpressionModel.fromASCII = function (ascii) {
    var model = new ExpressionModel();
    model.xml = parser.parse(ascii);
    return model;
  };

  ExpressionModel.fromXML = function (xml) {
    var model = new ExpressionModel();
    model.xml = $(xml).clone().get(0);
    return model;
  };

  // TODO: update the cloned ids
  // TODO: create a map from old ids to new ids
  ExpressionModel.prototype.clone = function () {
    return ExpressionModel.fromXML(this.xml);
  };

  ExpressionModel.prototype.getNode = function (id) {
    return $(this.xml).find('#' + id).get(0);
  };

  ExpressionModel.prototype.evaluate = function (id) {
    var clone = this.clone();
    evaluate(clone.getNode(id));
    clone.removeUnnecessaryRows();
    clone.removeUnnecessaryParentheses();
    return clone;
  };

  ExpressionModel.prototype.distribute = function (id) {
    var clone = this.clone();
    distribute(clone.getNode(id));
    clone.removeUnnecessaryRows();
    return clone;
  };

  ExpressionModel.prototype.modify = function (operator, expr) {
    if (/[\+\-\/\*\^]/.test(operator)) {
      if (operator === '*') {
        return this.multiply(expr);
      } else if (operator === '/') {
        return this.divide(expr);
      } else {
        throw "we don't handle that operator yet, try again later";
      }
    }
  };

  ExpressionModel.prototype.multiply = function (term) {
    var clone = this.clone();
    var mrow = clone.xml.firstElementChild;
    term = term.xml.firstElementChild;

    if ($(mrow).hasAddOps()) {
      $(mrow).wrap('<mrow></mrow>').before(term.outerHTML + '<mo>*</mo>');
    } else if ($(mrow).hasMulOps()) {
      $(mrow).prepend(term.outerHTML + '<mo>*</mo>');
    } else {
      // TODO: throw a more helpful error
      throw "can't handle this case yet";
    }

    return clone;
  };

  ExpressionModel.prototype.divide = function (term) {
    var clone = this.clone();
    var mrow = clone.xml.firstElementChild;
    term = term.xml.firstElementChild;

    if ($(mrow).hasAddOps()) {
      $(mrow).wrap('<mrow></mrow>').after('<mo>/</mo>' + term.outerHTML);
    } else if ($(mrow).hasMulOps()) {
      $(mrow).append('<mo>/</mo>' + term.outerHTML);
    } else {
      // TODO: throw a more helpful error
      throw "can't handle this case yet";
    }

    return clone;
  };

  ExpressionModel.prototype.simplify = function () {
    var clone = this.clone();
    simplify(clone.xml);
    return clone;
  };

  ExpressionModel.prototype.commute = function (id) {
    var clone = this.clone();
    commute(clone.getNode(id));
    return clone;
  };


  ExpressionModel.prototype.rewriteSubtraction = function (id) {
    var clone = this.clone();
    var node = clone.getNode(id);

    if ($(node).isOp('-')) {
      var next = $(node).next();

      if (next.is('mi') || next.is('mn')) {
        next.text('-' + next.text());
      } else if (next.is('msup')) {
        var base = $(next.children()[0]);
        if (base.is('mi') || base.is('mn')) {
          base.text('-' + base.text());
        }
        // TODO: figure out how to handle the recursive case
        // e.g. <msup><msup><mi>x</mi><mn>2</mn</msup><mn>2</mn></msup>
        // TODO: create a function that returns the base node of any msup
      } else if (next.is('mrow')) {
        // TODO: figure out what to do for this case
      } else {
        throw "we don't handle rewriting subtraction in this situation, yet";
      }

      $(node).text('+');
    }

    return clone;
  };

  // TODO: fix this transform to play nice with commuting multiplication
  ExpressionModel.prototype.rewriteDivision = function (id) {
    var clone = this.clone();
    var node = clone.getNode(id);

    if ($(node).prev().isOp('/')) {
      var opNode = $(node).prev();
      if ($(node).is('mi') || $(node).is('mn')) {
        $(node).replaceWith('<mn>1</mn><mo>/</mo>' + node.outerHTML);
        opNode.text('*');
      }
    }

    return clone;
  };

  ExpressionModel.prototype.removeUnnecessaryRows = function () {
    $(this.xml).find('mrow').each(function () {
      var children = $(this).children();
      if ($(this).is('mrow') && children.length === 1) {
        $(this).replaceWith(children[0]);
      } else if ($(this).is('mrow') && $(this.firstElementChild).text() === '(' && $(this.lastElementChild).text() === ')') {
        $(this).replaceWith(children);
      }
    });
  };

  ExpressionModel.prototype.removeUnnecessaryParentheses = function () {
    $(this.xml).findOp('(').each(function () {
      if ($(this).next().next().text() === ')' && !$(this).next().is('mrow')) {
        $(this).next().next().remove();
        $(this).remove();
      }
    });
  };

  return ExpressionModel;
});
