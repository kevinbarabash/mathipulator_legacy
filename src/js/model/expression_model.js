/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  var Parser = require('model/parser');
  var parser = new Parser();
  var $ = require('jquery');

  require('jquery_extensions');

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

  // non-context specific transforms
  // these are available all the time
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
