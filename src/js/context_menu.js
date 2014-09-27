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
      var mathCollection = this.mathView.mathCollection;
      var model = mathCollection.at(mathCollection.position);
      var clone = model.clone();

      var transformName = e.target.id;
      var node = clone.getNode(this.mid);
      TransformDict[transformName].transform(node);

      this.mathView.mathCollection.push(clone);
    },

    update: function (selection, value) {
      this.$('li').hide();
      var mathCollection = this.mathView.mathCollection;
      var model = mathCollection.at(mathCollection.position);

      var mid = value;
      this.mid = mid;
      if (mid) {
        var node = model.getNode(mid);
        TransformList.filter(function (transform) {
          return transform.canTransform(node);
        }).forEach(function (transform) {
          this.$('#' + transform.name).show();
        }, this);
      }
    }
  });
});
