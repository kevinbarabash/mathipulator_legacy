/**
 * Created by kevin on 2014-09-25.
 */

define(function (require) {
  var Backbone = require('backbone');
  var TransformList = require('model/transform_list');

  var TransformDict = {};
  TransformList.forEach(function (transform) {
    TransformDict[transform.name] = transform;
  });

  return Backbone.View.extend({
    el: '#context-menu',

    // TODO: turn each event into it's own ListMenuItemView
    events: {
      'click li': 'applyTransform'
    },

    initialize: function (mathView) {
      this.mathView = mathView;
      this.delegateEvents(this.events);
    },

    applyTransform: function (e) {
      var undoManager = this.mathView.undoManager;

      var model = undoManager.current.value;
      var clone = model.clone();

      var transformName = e.target.id;
      var node = clone.getNode(this.mathView.selection.id);
      TransformDict[transformName].transform(node);

      this.mathView.addExpression(clone);
    },

    update: function () {
      this.$('li').hide();
      var undoManager = this.mathView.undoManager;
      var selection = this.mathView.selection;
      var model = undoManager.current.value;

      if (selection.id) {
        var node = model.getNode(selection.id);
        TransformList.filter(function (transform) {
          return transform.canTransform(node);
        }).forEach(function (transform) {
          this.$('#' + transform.name).show();
        }, this);
      }
    }
  });
});
