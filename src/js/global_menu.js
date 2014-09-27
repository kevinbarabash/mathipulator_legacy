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

    initialize: function (appView) { // TODO: eventually update this to be the real 'appView'
      this.delegateEvents(this.events);
      this.appView = appView;
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
      var mathCollection = this.appView.mathCollection;
      var model = mathCollection.at(mathCollection.position);
      mathCollection.push(model.simplify());
    },

    undo: function () {
      var mathCollection = this.appView.mathCollection;

      if (mathCollection.canUndo) {
        mathCollection.undo();
      }
    },

    redo: function () {
      var mathCollection = this.appView.mathCollection;

      if (mathCollection.canRedo) {
        mathCollection.redo();
      }
    },

    // TODO: create a history view that we can swap out with the main view
    history: function (e) {
      console.log('history: %o', e);
    },

    // TODO: fix me
    reset: function () {
      var undoManager = this.appView.undoManager;

      undoManager.current = undoManager.list.first;
      undoManager.clear();
    }
  });
});
