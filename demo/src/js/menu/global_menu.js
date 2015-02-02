/**
 * Created by kevin on 2014-09-25.
 */

define(function (require) {
  var Backbone = require('backbone');
  var ExpressionModel = require('model/expression_model');
  var $ = require('jquery');

  return Backbone.View.extend({
    el: '.global-menu',

    // TODO: change to 'click #undo.active'
    events: {
      'click #simplify': 'simplify',
      'click #undo': 'undo',
      'click #redo': 'redo',
      'click #history': 'history',
      'click #reset': 'reset'
    },

    initialize: function (options) { // TODO: eventually update this to be the real 'appView'
      this.delegateEvents(this.events);
      this.problem = options.problem;
      this.historyView = options.historyView;
    },

    simplify: function () {
      // TODO: add a method to determine if something can be simplified or not
      // TODO: activate the menu item only when it's possible to simplify
      var model = this.problem.get('current');
      this.problem.push(model.simplify());
    },

    undo: function () {
      if (this.problem.get('canUndo')) {
        this.problem.undo();
      }
    },

    redo: function () {
      if (this.problem.get('canRedo')) {
        this.problem.redo();
      }
    },

    history: function () {
      this.historyView.toggle();
      if (this.historyView.visible) {
        $('#fg').css({ opacity: 0.0 });
      } else {
        $('#fg').css({ opacity: 1.0 });
      }
    },

    reset: function () {
      this.problem.reset();
      this.historyView.reset();
    },

    canUndoChanged: function(model, value) {
      if (value) {
        // TODO: put CSS in .style
        $('#undo').css({ opacity: 1.0 });
      } else {
        $('#undo').css({ opacity: 0.5 });
      }
    },

    canRedoChanged: function(model, value) {
      if (value) {
        // TODO: put CSS in .style
        $('#redo').css({ opacity: 1.0 });
      } else {
        $('#redo').css({ opacity: 0.5 });
      }
    }
  });
});
