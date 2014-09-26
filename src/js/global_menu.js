/**
 * Created by kevin on 2014-09-25.
 */

define(function (require) {
  var Backbone = require('backbone');
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

    initialize: function (mathView) { // TODO: eventually update this to be the real 'MathView'
      this.delegateEvents(this.events);
      this.mathView = mathView;
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
      var model = this.mathView.undoManager.current.value;
      this.mathView.addExpression(model.simplify());
    },

    undo: function () {
      var undoManager = this.mathView.undoManager;

      if (undoManager.canUndo) {
        var model = undoManager.undo();
        this.mathView.showModel(model);
      }
    },

    redo: function () {
      var undoManager = this.mathView.undoManager;

      if (undoManager.canRedo) {
        var model = undoManager.redo();
        this.mathView.showModel(model);
      }
    },

    // TODO: create a history view that we can swap out with the main view
    history: function (e) {
      console.log('history: %o', e);
    },

    reset: function () {
      var undoManager = this.mathView.undoManager;

      undoManager.current = undoManager.list.first;
      undoManager.clear();
      var model = undoManager.current.value;
      this.showModel(model);
    }
  });
});
