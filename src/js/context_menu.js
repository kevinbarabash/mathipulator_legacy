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
    tagName: 'ul',

    // TODO: turn each event into it's own ListMenuItemView
    events: {
      'click li': 'applyTransform'
    },

    initialize: function (options) {
      this.model = options.model;
      this.problem = options.problem;
      this.transformList = options.transformList;
      this.mid = options.mid;
      this.delegateEvents(this.events);
    },

    applyTransform: function (e) {
      var clone = this.model.clone();

      var transformName = e.target.id;
      var node = clone.getNode(this.mid);
      TransformDict[transformName].transform(node);

      this.problem.push(clone);
      this.remove();
    },

    render: function() {
      var html = '';
      this.transformList.forEach(function (transform) {
        html += '<li id="' + transform.name + '">' + transform.name + '</li>';
      });

      this.$el.html(html);
      return this;
    }
  });
});
