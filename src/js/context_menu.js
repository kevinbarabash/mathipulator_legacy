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
    tagName: 'div',
    className: 'popup-container',

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
      var html = '<ul class="menu-container" style="background-color: rgba(0,0,0,0.5);margin:0;text-align:left;">';
      this.transformList.forEach(function (transform) {
        html += '<li id="' + transform.name + '">' + transform.name + '</li>';
      });
      html += '</ul>';
      html += '<svg xmlns="http://www.w3.org/2000/svg" width="40px" height="20px" viewBox="0 0 40 20">' +
        '<polyline stroke="none" fill="rgba(0,0,0,0.5)" points="0,0 20,20 40,0"></polyline>' +
      '</svg>';

      this.$el.html(html);
      return this;
    }
  });
});
