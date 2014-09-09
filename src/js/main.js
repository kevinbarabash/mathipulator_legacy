/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  'use strict';

  var ExpressionModel = require('expression_model');
  var ExpressionView = require('expression_view');
  var Selection = require('selection');
  var $ = require('jquery');

  var model = null;
  var selection = new Selection();

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  document.body.addEventListener('click', function (e) {
    if ($(e.target).parents('svg').length === 0) {
      if (!selection.isEmpty()) {
        $('svg').find('[for="' + selection.id + '"]').removeAttr('class');
        selection.clear();
      }
    }
  });

  function addExpression(expr) {
    console.log(expr.xml);

    var view;
    var options = { format: 'algebra' };
    if (getParameterByName('format')) {
      options.format = getParameterByName('format');
    }

    view = new ExpressionView(expr, options);
    view.render();

    // TODO: prevent selection of items in old views
    // TODO: come up with something better than 'for'

    // TODO: insert a separate object for the highlight and get rid of the hover
    // TODO: populate the action list;

    $(view).on('operatorClick numberClick', function (e, id) {
      if (!selection.isEmpty()) {
        $(view.svg).find('[for="' + selection.id + '"]').removeAttr('class'); // can't use removeClass b/c SVG
      }

      if (id !== selection.id) {
        selection.set(model.getNode(id));
        $(view.svg).find('[for="' + id + '"]').attr('class', 'selected');
      } else {
        selection.clear();
      }
    });
  }


  model = ExpressionModel.fromASCII('3x^2 + -2x + 5');
  if (getParameterByName('format') === 'arithmetic') {
    model = ExpressionModel.fromASCII('5 - 1 + 2 * (3 - 4)');
  }

  // TODO: determine when to set stretch=false and when not to
//  model = ExpressionModel.fromASCII('1/(x-(2+1/x)) + 1/(x^2+1/x) + (x+1)^2');

  addExpression(model);


  $('#modExpr').click(function () {
    var mathInput$ = $('#inputMath');
    var input = mathInput$.val();

    var operator = input[0];
    var expr = ExpressionModel.fromASCII(input.substring(1));

    model = model.modify(operator, expr);
    addExpression(model);
    // TODO: have a list of models, one for each line/step

    mathInput$.val('');
  });

  $('#distribute').click(function () {
    if (!selection.isEmpty()) {
      model = model.distribute(selection.id);
      addExpression(model);

      selection.clear();
    }
  });

  $('#simplify').click(function () {
    model = model.simplify();
    addExpression(model);
  });

  $('#evaluate').click(function () {
    try {
      model = model.evaluate(selection.id);
      addExpression(model);
    } catch(e) {
      console.log('error evaluating node: %o', e);
    }
  });

  $('#commute').click(function () {
    model = model.commute(selection.id);
    addExpression(model);
  });

  $('#rewriteSubtraction').click(function () {
    model = model.rewriteSubtraction(selection.id);
    addExpression(model);
  });

  $('#rewriteDivision').click(function () {
    model = model.rewriteDivision(selection.id);
    addExpression(model);
  });

  // TODO: collect like terms
});
