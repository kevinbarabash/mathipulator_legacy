/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  'use strict';

  var ExpressionModel = require('expression_model');
  var ExpressionView = require('expression_view');
  var SVGUtils = require('svg_utils');

  function addExpression(model) {
    var view = new ExpressionView(model.xml);

    view.algebraFormatter();
//    view.arithmeticFormatter();

    view.render().then(function (svg) {
      view.addCircles(svg);
      view.addNumberHighlights(svg);
      SVGUtils.correctBBox(svg);
    });

    $(view).on('operatorClick', function (e, id) {
      model.evaluateNode(id).then(function () {
        addExpression(model.clone());
      });
    });

    $(view).on('numberClick', function (e, id) {
      var clone = model.clone();

      var node = $(clone.xml).find('#' + id).get(0);
      $(node).removeAttr('id');
      clone.distribute(node);

      addExpression(clone);
    });
  }

  var model;

//  model = ExpressionModel.fromASCII('5 - 1 + 2 * (3 - 4)');
  model = ExpressionModel.fromASCII('x^2 + 2x + 1');
//  model = ExpressionModel.fromASCII('-1/(x-1) + 1/(x+1)');
  addExpression(model);


  $('#addExpr').click(function () {
    var input = $('#inputMath').val();

    var operator = input[0];
    if (/[\+\-\/\*\^]/.test(operator)) {
      var expr = ExpressionModel.fromASCII(input.substring(1));
      var clone = model.clone();

      if (operator === '*') {
        clone.multiply(expr.xml.firstElementChild);
      } else if (operator === '/') {
        clone.divide(expr.xml.firstElementChild);
      } else {
        throw "we don't handle that operator yet, try again later";
      }

      addExpression(clone);

      model = clone; // replace of the next
      // TODO: have a list of models, one for each line/step
    }
  });

  $('#distribute').click(function () {
    var clone = model.clone();

    // in the real case the user will select a number
    // and then we'll check if it can be distributed
    var num = $(clone.xml).find('mn').first().get(0);
    clone.distribute(num);

    addExpression(clone);
    model = clone; // replace of the next
  });

  $('#simplifyMultiplication').click(function () {
//    simplifyMultiplication(expr);
//    console.log(expr.toASCII());
  });
});
