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
      this.collection = options.collection;
      this.delegateEvents(this.events);
    },

    applyTransform: function (e) {
      var mathCollection = this.collection;
      var model = mathCollection.at(mathCollection.position);
      var clone = model.clone();

      var transformName = e.target.id;
      var node = clone.getNode(this.mid);
      TransformDict[transformName].transform(node);

      this.collection.push(clone);
    },

    update: function (value) {
      this.$('li').hide();
      var collection = this.collection;
      var model = collection.at(collection.position);

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
    },

    render: function() {
      var html = '<li id="evaluate">Evaluate</li>' +
        '<li id="commute">Commute</li>' +
        '<li id="distribute_forwards">Distribute Forwards</li>' +
        '<li id="distribute_backwards">Distribute Backwards</li>' +
        '<li id="rewrite_subtraction">Rewrite Subtraction</li>' +
        '<li id="rewrite_division">Rewrite Division</li>' +
        '<li id="write_as_subtraction">Write As Subtraction</li>';

      this.$el.html(html);
      return this;
    }
  });
});
