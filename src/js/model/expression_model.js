/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  var Backbone = require('backbone');
  var Parser = require('model/parser');
  var parser = new Parser();
  var $ = require('jquery');

  require('jquery_extensions');

  var simplify = require('model/transform/simplify');
  var modify = require('model/transform/modify');

  var id = 0;
  function genId() {
    return 'mid-' + (id++);
  }

  var ExpressionModel = Backbone.Model.extend({
    constructor: function (xml) {
      this.xml = xml;
    },

    clone: function () {
      return ExpressionModel.fromXML(this.xml);
    },

    addIds: function () {
      $(this.xml).find('mrow,msup,mn,mi,mo').each(function () {
        $(this).attr('id', genId());
      });
    },

    getNode: function (id) {
      return $(this.xml).find('#' + id).get(0);
    },

    // non-context specific transforms
    // these are available all the time
    modify: function (op, exprModel) {
      var clone = this.clone();
      var root = clone.xml.firstElementChild;
      var expr = exprModel.xml.firstElementChild;
      modify(root, op, expr);
      return clone;
    },

    simplify: function () {
      var clone = this.clone();
      simplify(clone.xml);
      return clone;
    }
  });

  ExpressionModel.fromASCII = function (ascii) {
    var xml = parser.parse(ascii);
    var model = new ExpressionModel(xml);
    model.addIds();
    return model;
  };

  ExpressionModel.fromXML = function (xml) {
    var model = new ExpressionModel($(xml).clone().get(0));
    $(model.xml).find('.result').removeClass('result');
    return model;
  };

  return ExpressionModel;
});
