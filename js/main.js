/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  'use strict';

  var ExpressionModel = require('expression_model');
  var ExpressionView = require('expression_view');

  function addExpression(model) {
    var view = new ExpressionView(model.xml);

    view.sanitize();

    view.render().then(function (svg) {
      view.addCircles(svg);
      view.addNumberHighlights(svg);
    });

    $(view).on('my-event', function (e, id) {
      model.evaluateNode(id).then(function () {
        model.removeUnnecessaryRows();
        addExpression(model.clone());
      });
    });
  }

  var model = ExpressionModel.fromASCII('5 - 1 + 2 * (3 - 4)');
  addExpression(model);

});
