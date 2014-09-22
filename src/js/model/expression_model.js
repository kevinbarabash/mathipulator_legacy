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
    model.addIds();
    return model;
  };

  ExpressionModel.fromXML = function (xml) {
    var model = new ExpressionModel();
    model.xml = $(xml).clone().get(0);
    model.addIds();
    $(model.xml).find('.result').removeClass('result');
    return model;
  };

  ExpressionModel.prototype.clone = function () {
    return ExpressionModel.fromXML(this.xml);
  };

  ExpressionModel.prototype.getNodeWithOld = function (id) {
    if (this.oldToNewMap[id]) {
      id = this.oldToNewMap[id];
    }
    return $(this.xml).find('#' + id).get(0);
  };

  var id = 0;

  ExpressionModel.prototype.addIds = function () {
    var oldToNewMap = this.oldToNewMap = {};
    var newToOldMap = this.newToOldMap = {};

    $(this.xml).find('mrow,msup,mn,mi,mo').each(function () {
      if ($(this).attr('id')) {
        // bidirectional map relies on unique ids between steps
        newToOldMap['_' + id] = $(this).attr('id');
        oldToNewMap[$(this).attr('id')] = '_' + id;
      }
      $(this).attr('id', '_' + id);
      id++;
    });
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

  return ExpressionModel;
});
