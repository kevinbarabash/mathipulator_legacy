/**
 * Created by kevin on 2014-09-26.
 */

define(function (require) {
  var Backbone = require('backbone');

  return Backbone.Model.extend({
    steps: new Backbone.Collection(),

    initialize: function () {
      this.set('position', -1);
      this.steps.problem = this;

      this.on('change:position', this.positionChanged);
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
      if (this.get('canUndo')) {
        this.set('position', this.get('position') - 1);
      }
    },

    redo: function () {
      if (this.get('canRedo')) {
        this.set('position', this.get('position') + 1);
      }
    },

    positionChanged: function (model, position) {
      if (position > 0) {
        this.set('canUndo', true);
      } else {
        this.set('canUndo', false);
      }
      if (position < this.steps.length - 1) {
        this.set('canRedo', true);
      } else {
        this.set('canRedo', false);
      }
      this.set('current', this.steps.at(position));
    }
  });
});
