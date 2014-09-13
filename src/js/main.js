/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  'use strict';

  var ExpressionModel = require('model/expression_model');
  var ExpressionView = require('view/expression_view');
  var Selection = require('selection');
  var $ = require('jquery');

  var Commute = require('model/transform/commute');
  var Evaluate = require('model/transform/evaluate');
  var DistributeForwards = require('model/transform/distribute_forwards');
  var DistributeBackwards = require('model/transform/distribute_backwards');
  var RewriteSubtraction = require('model/transform/rewrite_subtraction');
  var RewriteDivision = require('model/transform/rewrite_division');

  var transforms = [Commute, Evaluate, DistributeForwards, DistributeBackwards, RewriteSubtraction, RewriteDivision];

  var model = null;
  var selection = new Selection();

  function getParameterByName(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
      results = regex.exec(location.search);
    return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  document.body.addEventListener('click', function (e) {
    if ($(e.target).parents('svg').length === 0) {
      if (!selection.isEmpty()) {
        $('svg').find('[for="' + selection.id + '"]').removeAttr('class');
        selection.clear();
      }
    }
  });

  $('#context_menu button').hide();

  function addExpression(expr) {
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
        var node = model.getNode(id);
        selection.set(node);
        $(view.svg).find('[for="' + id + '"]').attr('class', 'selected');

        $('#context_menu button').hide();

        transforms.filter(function (transform) {
          return transform.canTransform(node);
        }).forEach(function (transform) {
          $('#context_menu #' + transform.name).show();
        });
      } else {
        selection.clear();
      }
    });
  }

  // TODO: allow people to type in an expression (or select from a list)

//  model = ExpressionModel.fromASCII('3x^2 + -2x + -5/4'); // TODO: fix formatting issues
//  model = ExpressionModel.fromASCII('3x^2 + -2x + -5');
//  model = ExpressionModel.fromASCII('(x+1)*4*(x-1)');

  // TODO: to do manual visual testing... have a page that just renders a series of expressions
  model = ExpressionModel.fromASCII('e^(-(x^2+y^2))');
//  model = ExpressionModel.fromASCII('(x+1)*4*(x-1)');  // TODO: define where valid positions of unary minuses 4*-(x-1)?

  // TODO: should be able to distribute a unary minus... or rewrite it as multiplication by -1

//  console.log(model.xml);
  // TODO: need to fix <msup> where the first element is a <mrow>
//  model = ExpressionModel.fromASCII('(x+1)^2');
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

  $('#simplify').click(function () {
    model = model.simplify();
    addExpression(model);
  });

  function applyTransform(Transform) {
    var clone = model.clone();
    Transform.transform(clone.getNode(selection.id));
    $(clone.xml).removeExtra('mrow');  // TODO: move this into the distribute transform's cleanup
    model = clone;
    addExpression(model);
    $('#context_menu button').hide();
  }

  // context specific actions
  transforms.forEach(function (Transform) {
    $('#' + Transform.name).click(function () {
      applyTransform(Transform);
    });
  });

  // TODO: collect like terms
});
