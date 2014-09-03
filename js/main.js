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

    view.render().then(function (svg) {
      view.addCircles(svg);
      view.addNumberHighlights(svg);
      SVGUtils.correctBBox(svg);
    });

    $(view).on('my-event', function (e, id) {
      model.evaluateNode(id).then(function () {
        model.removeUnnecessaryRows();
        addExpression(model.clone());
      });
    });
  }

  var model;

//  model = ExpressionModel.fromASCII('5 - 1 + 2 * (3 - 4)');
  model = ExpressionModel.fromASCII('x^2 + 2x + 1');
//  model = ExpressionModel.fromASCII('1/(x-1) + 1/(x+1)');
  addExpression(model);


  $('#addExpr').click(function () {
    var input = $('#inputMath').val();

    var operator = input[0];
    if (/[\+\-\/\*\^]/.test(operator)) {
      var clone = model.clone();
      clone.multiply(3);
      addExpression(clone);

      console.log(clone.xml);

      model = clone; // replace of the next
      // TODO: have a list of models, one for each line/step
    }
  });

  $('#distribute').click(function () {
    var hasAddOps = function(mrow) {
      var result = false;
      $(mrow).children().each(function () {
        if ($(this).is('mo')) {
          if ($(this).text() === '+' || $(this).text() === '-') {
            result = true;
          }
        }
      });
      return result;
    };

    var clone = model.clone();
    var term = '3';

    // in the real case we'll be given a number node
    // then we'll check if we can distribute that number
    $(clone.xml).find('mn').filter(function () {
      return $(this).text() === '3'
    }).each(function () {
      // distribute should be run on one node at a time
      if ($(this).next().is('mo') && $(this).next().text() === '*' && $(this).next().next().is('mrow')) {
        var mrow = $(this).next().next().get(0);
        if (hasAddOps(mrow)) {
          $(mrow).children().each(function () {
            if (!$(this).is('mo')) {
              $(this).replaceWith('<mrow><mn>' + term + '</mn><mo>*</mo>' + this.outerHTML + '</mrow>');
            }
          });
        }
        $(this).next().remove();
        $(this).remove();
      }
    });

    console.log(clone.xml);
    addExpression(clone);
  });

  $('#simplifyMultiplication').click(function () {
//    simplifyMultiplication(expr);
//    console.log(expr.toASCII());
  });
});
