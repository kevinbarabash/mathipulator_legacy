/**
 * Created by kevin on 2014-09-26.
 */

define(function (require) {
  var Backbone = require('backbone');

  var MathProblem = Backbone.Model.extend({
    steps: new Backbone.Collection(),

    initialize: function () {
      this.set('position', -1);
      this.steps.problem = this;
    },

    push: function (model) {
      var position = this.get('position');
      if (position < this.length - 1) {
        this.steps.set(this.steps.slice(0, position + 1));
      }
      this.steps.push(model);
      this.set('position', position + 1);
    },

    undo: function () {
      if (this.canUndo) {
        this.set('position', this.get('position') - 1);
      }
    },

    redo: function () {
      if (this.canRedo) {
        this.set('position', this.get('position') + 1);
      }
    }
  });

  Object.defineProperty(MathProblem.prototype, 'canUndo', {
    get: function () {
      return this.position > 0;
    }
  });

  Object.defineProperty(MathProblem.prototype, 'canRedo', {
    get: function () {
      return this.get('position') < this.steps.length - 1;
    }
  });

  Object.defineProperty(MathProblem.prototype, 'current', {
    get: function () {
      return this.steps.at(this.get('position'));
    }
  });

  return MathProblem;
});
