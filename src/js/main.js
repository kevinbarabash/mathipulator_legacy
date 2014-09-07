/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  'use strict';

  var ExpressionModel = require('expression_model');
  var ExpressionView = require('expression_view');
  var SVGUtils = require('svg_utils');
  var $ = require('jquery');

  var model = null;
  var selection = null;

  document.body.addEventListener('click', function (e) {
    if ($(e.target).parents('svg').length === 0) {
      // deselects
      // TODO: create a selection object with methods: set, clear, grow, shrink
      if (selection !== null) {
        $('svg').find('rect').filter(function () {
          return $(this).attr('for') === selection;
        }).get(0).removeAttribute('class');
        selection = null;
      }
    }
  });

  function addExpression(expr) {
    console.log(expr.xml);
    var view = new ExpressionView(expr);

    view.algebraFormatter();
//    view.arithmeticFormatter();

    view.render().then(function (svg) {
      view.createSelectionOverlay(svg);
      view.svg = svg;
      SVGUtils.correctBBox(svg);
    });

    $(view).on('operatorClick', function (e, id) {
      expr.evaluateNode(id).then(function () {
        addExpression(expr.clone());
      });
    });

    $(view).on('numberClick', function (e, id) {
      if (selection !== null) {
        $(view.svg).find('rect').filter(function () {
          return $(this).attr('for') === selection;
        }).get(0).removeAttribute('class');
      }

      selection = id;

      $(view.svg).find('rect').filter(function () {
        return $(this).attr('for') === id;
      }).get(0).setAttribute('class', 'selected');

      // TODO: insert a separate object for the highlight and get rid of the hover
      // TODO: populate the action list;
    });
  }

//  model = ExpressionModel.fromASCII('5 - 1 + 2 * (3 - 4)');
  model = ExpressionModel.fromASCII('3x^2 + 2x + 5');
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

    $('#inputMath').val('');
  });

  $('#distribute').click(function () {
    if (selection !== null) {
      var clone = model.clone();

      var node = $(clone.xml).find('#' + selection).get(0);
      $(node).removeAttr('id');
      clone.distribute(node);

      addExpression(clone);
      model = clone;

      selection = null;
    }
  });

  $('#simplifyMultiplication').click(function () {
    var clone = model.clone();
    clone.simplifyMultiplication();

    addExpression(clone);
    model = clone; // replace of the next
  });
});
