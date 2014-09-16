/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  'use strict';

  var ExpressionModel = require('model/expression_model');
  var ExpressionView = require('view/expression_view');
  var Selection = require('selection');
  var $ = require('jquery');

  var transforms = require('model/transform_list');

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

  function hideContextMenu() {
    var contextMenu = $('#context_menu');
    contextMenu.find('button').hide();
  }

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

        hideContextMenu();

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

  model = ExpressionModel.fromASCII('3x^2 + -2x + -5');
  if (getParameterByName('format') === 'arithmetic') {
    model = ExpressionModel.fromASCII('5 - 1 + 2 * (3 - 4)');
  }

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

  $('#toggle_results').click(function () {
    $('.result').each(function () {
      this.classList.toggle('blue');
    });
  });

  function applyTransform(Transform) {
    var clone = model.clone();
    Transform.transform(clone.getNode(selection.id));
    $(clone.xml).removeExtra('mrow');  // TODO: move this into the distribute transform's cleanup
    model = clone;

    addExpression(model);
    hideContextMenu();
  }

  // context specific actions
  transforms.forEach(function (Transform) {
    $('#' + Transform.name).click(function () {
      applyTransform(Transform);
    });
  });

  // TODO: collect like terms
});
