/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  'use strict';

  var ExpressionModel = require('expression_model');
  var ExpressionView = require('expression_view');
  var SVGUtils = require('svg_utils');

  function addExpression(expr) {
    console.log(expr.xml);
    var view = new ExpressionView(expr.xml);

//    view.algebraFormatter();
    view.arithmeticFormatter();

    view.render().then(function (svg) {
      view.createSelectionOverlay(svg);
      SVGUtils.correctBBox(svg);
    });

    $(view).on('operatorClick', function (e, id) {
      expr.evaluateNode(id).then(function () {
        addExpression(expr.clone());
      });
    });

    $(view).on('numberClick', function (e, id) {
      var clone = expr.clone();

      var node = $(clone.xml).find('#' + id).get(0);
      $(node).removeAttr('id');
      clone.distribute(node);

      addExpression(clone);
      model = clone;
    });
  }

  var model;

  model = ExpressionModel.fromASCII('5 - 1 + 2 * (3 - 4)');
//  model = ExpressionModel.fromASCII('3x^2 + 2x + 5');
  // TODO: determine when to set stretch=false and when not to
//  model = ExpressionModel.fromASCII('1/(x-(2+1/x)) + 1/(x^2+1/x) + (x+1)^2');
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
    var clone = model.clone();
    clone.simplifyMultiplication();

    addExpression(clone);
    model = clone; // replace of the next
  });
});
