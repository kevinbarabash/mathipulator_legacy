/**
 * Created by kevin on 2014-09-25.
 */

define(function (require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
//  var ExpressionModel = require('model/expression_model');

  return Backbone.View.extend({
    el: '.global-menu',

    events: {
      'click #modify': 'modify',
      'click #simplify': 'simplify',
      'click #undo': 'undo',
      'click #redo': 'redo',
      'click #history': 'history',
      'click #reset': 'reset'
    },

    initialize: function (options) { // TODO: eventually update this to be the real 'appView'
      this.delegateEvents(this.events);
      this.problem = options.problem;
    },

    // TODO: figure out where to put the text box to enter a new expression/modification
    modify: function () {
//      var mathInput$ = $('#inputMath');
//      var input = mathInput$.val();
//
//      var operator = input[0];
//      var expr = ExpressionModel.fromASCII(input.substring(1));
//      var model = this.undoManager.current.value;
//
//      this.addExpression(model.modify(operator, expr));
//
//      mathInput$.val('');
    },

    simplify: function () {
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

    // TODO: create a history view that we can swap out with the main view
    history: function (e) {
      console.log('history: %o', e);
    },

    // TODO: fix me
    reset: function () {
//      var undoManager = this.appView.undoManager;
//
//      undoManager.current = undoManager.list.first;
//      undoManager.clear();
    },

    canUndoChanged: function(model, value) {
      if (value) {
        $('#undo').css({ opacity: 1.0 });
      } else {
        $('#undo').css({ opacity: 0.5 });
      }
    },

    canRedoChanged: function(model, value) {
      if (value) {
        $('#redo').css({ opacity: 1.0 });
      } else {
        $('#redo').css({ opacity: 0.5 });
      }
    }
  });
});
