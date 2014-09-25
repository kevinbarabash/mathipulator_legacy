/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  'use strict';

  var ExpressionModel = require('model/expression_model');
  var ExpressionView = require('view/expression_view');
  var Selection = require('selection');
  var $ = require('jquery');
  require('jquery.transit');

  var TransformList = require('model/transform_list');

  function AppController(options) {
    this.models = [];
    this.model = null;
    this.views = [];
    this.selection = new Selection();
    this.options = options;

    document.body.addEventListener('click', this.globalClickHandler.bind(this));

    $('#modExpr').click(this.modifyExpressionHandler.bind(this));
    $('#simplify').click(this.simplifyExpressionHandler.bind(this));
    $('#toggle_results').click(this.toggleResultsHandler.bind(this));
    $('#undo').click(this.undoHandler.bind(this));

    TransformList.forEach(function (Transform) {
      $('#' + Transform.name).click(this.applyTransform.bind(this, Transform));
      var button = document.getElementById(Transform.name);
      button.addEventListener('touchstart', this.applyTransform.bind(this, Transform));
    }, this);
  }

  AppController.prototype.updateContextMenu = function () {
    var contextMenu = $('#context-menu');
    contextMenu.find('button').hide();
    contextMenu.find('li').hide();

    if (this.selection.id) {
      var node = this.model.getNode(this.selection.id);
      TransformList.filter(function (transform) {
        return transform.canTransform(node);
      }).forEach(function (transform) {
        $('#context-menu #' + transform.name).show();
      });
    }
  };

  AppController.prototype.globalClickHandler = function (e) {
    if ($(e.target).parents('svg').length === 0) {
      if (!this.selection.isEmpty()) {
        $('.selected').each(function () {
          this.classList.remove('selected');
        });
        this.selection.clear();
        this.updateContextMenu();
      }
    }
  };

  AppController.prototype.fadeTransition = function () {
    $('#fg').children().appendTo($('#bg')).transition({
      opacity: 0.0,
      top: '-40px'
    }, {
      complete: function () {
        $(this).hide();
      }
    }).find('.selected').each(function () {
      this.classList.remove('selected');
    });
  };

  AppController.prototype.addExpression = function (expr) {
    this.selection.clear();
    this.updateContextMenu();
    this.models.push(expr);
    this.model = expr;

    this.fadeTransition();

    var animate = this.views.length > 0;
    var view = new ExpressionView(expr, this.options);
    view.render($('#fg'), animate);
    this.views.push(view);


    var that = this;
    $(view).on('operatorClick numberClick', function (e, vid) {
      if (!that.selection.isEmpty()) {
        view.deselectNode(that.selection.id);
      }

      var mid = view.viewToModelMap[vid];
      if (mid !== that.selection.id) {
        that.selection.set(mid);
        view.selectNode(mid);
      } else {
        that.selection.clear();
      }
      that.updateContextMenu();
    });
  };

  AppController.prototype.modifyExpressionHandler = function () {
    var mathInput$ = $('#inputMath');
    var input = mathInput$.val();

    var operator = input[0];
    var expr = ExpressionModel.fromASCII(input.substring(1));

    this.model = this.model.modify(operator, expr);
    this.addExpression(this.model);

    mathInput$.val('');
  };

  AppController.prototype.simplifyExpressionHandler = function () {
    this.model = this.model.simplify();
    this.addExpression(this.model);
  };

  AppController.prototype.toggleResultsHandler = function () {
    $('.result').last().each(function () {
      this.classList.toggle('blue');    // can't use jQuery's toggle because this an SVG node
    });
    $('.result-input').each(function () {
      this.classList.toggle('blue');    // can't use jQuery's toggle because this an SVG node
    });
  };

  AppController.prototype.animateUndo = function (currentView, previousView) {
    $(previousView.svg).parent().show().transition({
      opacity: 1.0,
      top: 0
    }, {
      complete: function () {
        $('#fg').append(this);
      }
    });

    $(currentView.svg).parent().transition({
      opacity: 0.0
    }, {
      complete: function() {
        $(this).hide();
      }
    });
  };

  AppController.prototype.undoHandler = function () {
    var models = this.models;
    var views = this.views;

    if (models.length > 0 && views.length > 0 && models.length === views.length) {
      var lastView = views[views.length - 1];
      var secondLastView = views[views.length - 2];

      this.animateUndo(views[views.length - 1], views[views.length - 2]);

      lastView.deactivate();
      secondLastView.activate();

      // TODO: create an undo/redo stack
      this.models = models.slice(0, models.length - 1);
      this.views = views.slice(0, views.length - 1);
    }
  };

  AppController.prototype.markInputNodes = function (svg, inputIds) {
    if (inputIds) {
      inputIds.forEach(function (mid) {
        var vid = this.model.view.modelToViewMap[mid];
        var elem = $(svg).find('#' + vid).get(0);
        elem.classList.add('result-input');
      }, this);
    }
  };

  AppController.prototype.applyTransform = function (Transform) {
    var clone = this.model.clone();
    var inputIds = Transform.transform(clone.getNode(this.selection.id));
    this.markInputNodes(this.model.view.svg, inputIds);

    this.model = clone;
    this.addExpression(this.model);
  };

  return AppController;
  // TODO: create a stack with commands like current, previous, etc.
});
