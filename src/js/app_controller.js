/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  'use strict';

  var MathView = require('view/math_view');
  var Selection = require('selection');
  var UndoManager = require('undo_manager');
  var GlobalMenu = require('global_menu');
  var ContextMenu = require('context_menu');

  var $ = require('jquery');
  require('jquery.transit');

  function AppController(options) {
    this.selection = new Selection();
    this.options = options;
    this.undoManager = new UndoManager();
    window.undoManager = this.undoManager;

    document.body.addEventListener('click', this.globalClickHandler.bind(this));

    $(this.undoManager).on('canUndoChanged', this.handleCanUndoChanged.bind(this));

    this.globalMenu = new GlobalMenu(this);
    this.contextMenu = new ContextMenu(this);
  }

  AppController.prototype.handleCanUndoChanged = function () {
    console.log('undo state: ' + this.undoManager.canUndo);
  };

  AppController.prototype.globalClickHandler = function (e) {
    if ($(e.target).parents('svg').length === 0) {
      if (!this.selection.isEmpty()) {
        $('.selected').each(function () {
          this.classList.remove('selected');
        });
        this.selection.clear();
        this.contextMenu.update();
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

    this.contextMenu.update();
  };

  AppController.prototype.showModel = function (model) {
    this.fadeTransition();
    var view = new MathView(model, this.options);
    view.render($('#fg'), true);

    var that = this;

    // TODO: move selection into the math_view
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
      that.contextMenu.update();
    });
  };

  return AppController;
});
