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


  model = ExpressionModel.fromASCII('3x^2 + 2x + 5');
  if (getParameterByName('format') === 'arithmetic') {
    model = ExpressionModel.fromASCII('5 - 1 + 2 * (3 - 4)');
  }

  // TODO: determine when to set stretch=false and when not to
//  model = ExpressionModel.fromASCII('1/(x-(2+1/x)) + 1/(x^2+1/x) + (x+1)^2');

  addExpression(model);


  $('#addExpr').click(function () {
    var mathInput$ = $('#inputMath');
    var input = mathInput$.val();

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

    mathInput$.val('');
  });

  $('#distribute').click(function () {
    if (!selection.isEmpty()) {
      var clone = model.clone();

      var node = $(clone.xml).find('#' + $(selection.root).attr('id')).get(0);
      $(node).removeAttr('id');
      clone.distribute(node);

      addExpression(clone);
      model = clone;

      selection.clear();
    }
  });

  $('#simplify').click(function () {
    var clone = model.clone();
    clone.simplify();

    addExpression(clone);
    model = clone; // replace of the next
  });

  $('#evaluate').click(function () {
    // could use a try catch block instead ?
    model.evaluateNode(selection.id).then(function () {
      addExpression(model.clone());
    });
  });
});
