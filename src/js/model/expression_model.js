/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  var Parser = require('model/parser');
  var parser = new Parser();
  var $ = require('jquery');

  require('jquery_extensions');

  var commute = require('model/transform/commute');
  var distribute = require('model/transform/distribute');
  var evaluate = require('model/transform/evaluate');
  var simplify = require('model/transform/simplify');
  var modify = require('model/transform/modify');

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
    $(clone.xml).removeExtra('mrow');
    return clone;
  };

  ExpressionModel.prototype.distribute = function (id) {
    var clone = this.clone();
    distribute(clone.getNode(id));
    $(clone.xml).removeExtra('mrow');
    return clone;
  };

  ExpressionModel.prototype.modify = function (op, exprModel) {
    var clone = this.clone();
    var root = clone.xml.firstElementChild;
    var expr = exprModel.xml.firstElementChild;
    modify(root, op, expr);
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

//  ExpressionModel.prototype.removeUnnecessaryParentheses = function () {
//    $(this.xml).findOp('(').each(function () {
//      if ($(this).next().next().text() === ')' && !$(this).next().is('mrow')) {
//        $(this).next().next().remove();
//        $(this).remove();
//      }
//    });
//  };

  return ExpressionModel;
});
