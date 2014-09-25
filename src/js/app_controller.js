/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  'use strict';

  var ExpressionModel = require('model/expression_model');
  var ExpressionView = require('view/expression_view');
  var Selection = require('selection');
  var UndoManager = require('undo_manager');
  var $ = require('jquery');
  require('jquery.transit');

  var TransformList = require('model/transform_list');

  function AppController(options) {
    this.selection = new Selection();
    this.options = options;
    this.undoManager = new UndoManager();
    window.undoManager = this.undoManager;

    document.body.addEventListener('click', this.globalClickHandler.bind(this));

    $('#modExpr').click(this.modifyExpressionHandler.bind(this));
    $('#simplify').click(this.simplifyExpressionHandler.bind(this));
    $('#undo').click(this.undoHandler.bind(this));
    $('#redo').click(this.redoHandler.bind(this));
    $('#reset').click(this.resetHandler.bind(this));

    TransformList.forEach(function (Transform) {
      $('#' + Transform.name).click(this.applyTransform.bind(this, Transform));
      var button = document.getElementById(Transform.name);
      button.addEventListener('touchstart', this.applyTransform.bind(this, Transform));
    }, this);

    $(this.undoManager).on('canUndoChanged', this.handleCanUndoChanged.bind(this));
  }

  AppController.prototype.handleCanUndoChanged = function () {
    console.log('undo state: ' + this.undoManager.canUndo);
  };

  AppController.prototype.updateContextMenu = function () {
    var contextMenu = $('#context-menu');
    contextMenu.find('li').hide();
    var model = this.undoManager.current.value;

    if (this.selection.id) {
      var node = model.getNode(this.selection.id);
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
      opacity: 0.0
    }, {
      complete: function () {
        $(this).remove();
      }
    }).find('.selected').each(function () {
      this.classList.remove('selected');
    });
  };

  AppController.prototype.addExpression = function (expr) {
    this.selection.clear();

    this.undoManager.push(expr);
    this.showModel(expr);

    this.updateContextMenu();
  };

  AppController.prototype.showModel = function (model) {
    this.fadeTransition();
    var view = new ExpressionView(model, this.options);
    view.render($('#fg'), true);

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
    var model = this.undoManager.current.value;

    this.addExpression(model.modify(operator, expr));

    mathInput$.val('');
  };

  AppController.prototype.simplifyExpressionHandler = function () {
    var model = this.undoManager.current.value;
    this.addExpression(model.simplify());
  };

  AppController.prototype.undoHandler = function () {
    if (this.undoManager.canUndo) {
      var model = this.undoManager.undo();
      this.showModel(model);
    }
  };

  AppController.prototype.redoHandler = function () {
    if (this.undoManager.canRedo) {
      var model = this.undoManager.redo();
      this.showModel(model);
    }
  };

  AppController.prototype.resetHandler = function () {
    this.undoManager.current = this.undoManager.list.first;
    this.undoManager.clear();
    var model = this.undoManager.current.value;
    this.showModel(model);
  };

  AppController.prototype.applyTransform = function (Transform) {
    var model = this.undoManager.current.value;
    var clone = model.clone();
    Transform.transform(clone.getNode(this.selection.id));
    this.addExpression(clone);
  };

  return AppController;

  // TODO: update how we show the inputs to a particular action
});
