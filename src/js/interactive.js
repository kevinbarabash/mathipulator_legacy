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
  var views = [];
  var selection = new Selection();

  function getParameterByName(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
      results = regex.exec(location.search);
    return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  function updateContextMenu() {
    var contextMenu = $('#context-menu');
    contextMenu.find('button').hide();

    if (selection.id) {
      var node = model.getNode(selection.id);
      transforms.filter(function (transform) {
        return transform.canTransform(node);
      }).forEach(function (transform) {
        $('#context-menu #' + transform.name).show();
      });
    }
  }

  document.body.addEventListener('click', function (e) {
    if ($(e.target).parents('svg').length === 0) {
      if (!selection.isEmpty()) {
        $('svg').find('[for="' + selection.id + '"]').removeAttr('class');
        selection.clear();
        updateContextMenu();
      }
    }
  });

  function addExpression(expr) {
    selection.clear();
    updateContextMenu();
    models.push(expr);

    var view;
    var options = { format: 'algebra' };
    if (getParameterByName('format')) {
      options.format = getParameterByName('format');
    }

    var animate = views.length > 0;
    view = new ExpressionView(expr, options);
    view.render(animate);
    views.push(view);

    if (views.length > 2) {
      views[views.length - 3].hide();     // third last
    }
    if (views.length > 1) {
      views[views.length - 2].fade(0.3);  // second last
    }

    $(view).on('operatorClick numberClick', function (e, vid) {
      if (!selection.isEmpty()) {
        view.deselectNode(selection.id);
      }

      var mid = view.viewToModelMap[vid];
      if (mid !== selection.id) {
        selection.set(mid);
        view.selectNode(mid);
      } else {
        selection.clear();
      }
      updateContextMenu();
    });
  }

  if (getParameterByName('format') === 'arithmetic') {
    model = ExpressionModel.fromASCII('5 - 1 + 2 * (3 - 4)');
  } else {
    model = ExpressionModel.fromASCII('3x^2 + -2x + -5');
  }

  addExpression(model);

  $('#modExpr').click(function () {
    var mathInput$ = $('#inputMath');
    var input = mathInput$.val();

    var operator = input[0];
    var expr = ExpressionModel.fromASCII(input.substring(1));

    model = model.modify(operator, expr);
    addExpression(model);

    mathInput$.val('');
  });

  $('#simplify').click(function () {
    model = model.simplify();
    addExpression(model);
  });

  // TODO: improve organization of views... provide a list abstraction with commands like current, previous, etc.
  $('#toggle_results').click(function () {
    $('.result').last().each(function () {
      this.classList.toggle('blue');    // can't use jQuery's toggle because this an SVG node
    });
    $('.result-input').each(function () {
      this.classList.toggle('blue');    // can't use jQuery's toggle because this an SVG node
    });
  });

  $('#undo').click(function () {
    if (models.length > 0 && views.length > 0 && models.length === views.length) {
      var lastView = views[views.length - 1];
      var secondLastView = views[views.length - 2];
      var thirdLastView = views[views.length - 3];

      $(thirdLastView.svg).parent().animate({ opacity: 0.3 });
      $(secondLastView.svg).parent().animate({ opacity: 1.0 });
      $(lastView.svg).parent().animate({ opacity: 0.0 }, {
        complete: function() {
          $(this).hide();
        }
      });

      lastView.deactivate();
      secondLastView.activate();
      thirdLastView.deactivate();

      // TODO: create an undo/redo stack
      models = models.slice(0, models.length - 1);
      views = views.slice(0, views.length - 1);
    }
  });

  function markInputNodes(svg, inputIds) {
    if (inputIds) {
      inputIds.forEach(function (mid) {
        var vid = model.view.modelToViewMap[mid];
        var elem = $(svg).find('#' + vid).get(0);
        elem.classList.add('result-input');
      });
    }
  }

  function applyTransform(Transform) {
    var clone = model.clone();
    var inputIds = Transform.transform(clone.getNode(selection.id));
    markInputNodes(model.view.svg, inputIds);

    model = clone;
    addExpression(model);
  }

  // context specific actions
  transforms.forEach(function (Transform) {
    $('#' + Transform.name).click(function () {
      applyTransform(Transform);
    });
  });

});
