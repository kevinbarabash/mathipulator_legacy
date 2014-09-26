/**
 * Created by kevin on 2014-09-26.
 */

define(function (require) {
  var Backbone = require('backbone');

  var MathCollection = Backbone.Collection.extend({
    position: -1,

    push: function (model, options) {
      if (this.position < this.length - 1) {
        this.set(this.slice(0, this.position + 1));
      }
      Backbone.Collection.prototype.push.call(this, model, options);
      this.position++;
    },

    undo: function () {
      if (this.canUndo) {
        this.position--;
        return this.at(this.position);
      }
      return null;
    },

    redo: function () {
      if (this.canRedo) {
        this.position++;
        return this.at(this.position);
      }
      return null;
    }
  });

  Object.defineProperty(MathCollection.prototype, 'canUndo', {
    get: function () {
      return this.position > 0;
    }
  });

  Object.defineProperty(MathCollection.prototype, 'canRedo', {
    get: function () {
      return this.position < this.length - 1;
    }
  });

  return MathCollection;
});
