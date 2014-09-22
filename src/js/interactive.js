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

  var models = [];
  var model;
  var stepIndex = -1;
  var views = [];
  var selection = new Selection();

  function getParameterByName(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
      results = regex.exec(location.search);
    return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  function hideContextMenu() {
    var contextMenu = $('#context-menu');
    contextMenu.find('button').hide();
  }

  document.body.addEventListener('click', function (e) {
    if ($(e.target).parents('svg').length === 0) {
      if (!selection.isEmpty()) {
        $('svg').find('[for="' + selection.id + '"]').removeAttr('class');
        selection.clear();
        hideContextMenu();
      }
    }
  });

  function addExpression(expr) {
    models.push(expr);
    stepIndex = 0;

    var view;
    var options = { format: 'algebra' };
    if (getParameterByName('format')) {
      options.format = getParameterByName('format');
    }

    var animate = views.length > 0;
    view = new ExpressionView(expr, options);
    view.render(animate);

    if (views.length > 1) {
      var secondLastView = views[views.length - 2];
      $(secondLastView.svg).parent().parent().animate({ opacity: 0.0 });
    }
    if (views.length > 0) {
      var lastView = views[views.length - 1];
      var overlay = $(lastView.svg).find('.selection-overlay').get(0);
      overlay.classList.remove('active');
      $(lastView.svg).parent().parent().animate({ opacity: 0.3 });
    }
    views.push(view);

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
          $('#context-menu #' + transform.name).show();
        });
      } else {
        selection.clear();
        hideContextMenu();
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
    $('.result').last().each(function () {
      this.classList.toggle('blue');    // can't use jQuery's toggle because this an SVG node
    });
  });

  $('#undo').click(function () {
    if (models.length > 0 && views.length > 0 && models.length === views.length) {
      var lastView = views[views.length - 1];
      var secondLastView = views[views.length - 2];
      var thirdLastView = views[views.length - 3];

      $(thirdLastView.svg).parent().parent().animate({ opacity: 0.3 });
      $(secondLastView.svg).parent().parent().animate({ opacity: 1.0 });
      $(lastView.svg).parent().parent().animate({ opacity: 0.0 });

      var lastOverlay = $(lastView.svg).find('.selection-overlay').get(0);
      lastOverlay.classList.remove('active');

      var secondLastOverlay = $(secondLastView.svg).find('.selection-overlay').get(0);
      secondLastOverlay.classList.add('active');

      var thirdLastOverlay = $(thirdLastView.svg).find('.selection-overlay').get(0);
      thirdLastOverlay.classList.remove('active');

      // TODO: update this so that we're not actually remove stuff from the stack but instead tracking the top
      // TODO: think about using an index or using a linked list...
      // TODO: an index is probably simpler if we have to remove everything after a certain point
      models = models.slice(0, models.length - 1);
      views = views.slice(0, views.length - 1);
    }
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
