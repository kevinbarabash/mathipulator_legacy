/**
 * Created by kevin on 2014-09-26.
 */

define(function (require) {
  var Backbone = require('backbone');
  var MathView = require('view/math_view');
  var ContextMenu = require('context_menu');
  var TransformList = require('model/transform_list');

  var $ = require('jquery');

  return Backbone.View.extend({
    positionCallback: function (problem) {
      if (this.view) {
        this.view.fadeOutAndRemove();
      }

      this.problem = problem;
      this.model = problem.current;

      this.view = new MathView({
        model: this.model,
        options: { format: 'arithmetic' }
      });

      this.listenTo(this.view.selection, 'change:mid', this.handleSelectionChange);
      this.view.render($('#fg'), true);
    },

    handleSelectionChange: function (selection, mid) {
      if (this.contextMenu) {
        this.contextMenu.remove();
      }
      if (mid) {
        var node = this.model.getNode(mid);
        var list = TransformList.filter(function (transform) {
          return transform.canTransform(node);
        });

        this.contextMenu = new ContextMenu({
          model: this.model,
          problem: this.problem,
          transformList: list,
          mid: mid
        });

        var $el = this.contextMenu.render().$el;
        $('#context-menu').append($el);
      }
    }
  });
});
