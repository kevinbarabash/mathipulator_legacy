/**
 * Created by kevin on 2014-09-26.
 */

define(function (require) {
  var Backbone = require('backbone');
  var Selection = require('selection');
  var MathView = require('view/math_view');
  var $ = require('jquery');

  return Backbone.View.extend({
    initialize: function () {
      this.selection = new Selection();
      document.body.addEventListener('click', this.globalClickHandler.bind(this));
    },

    positionCallback: function (collection) {
      var model = collection.at(collection.position);
      this.fadeTransition();

      var view = new MathView({
        model: model,
        options: { format: 'arithmetic' }
      });

      view.render($('#fg'), true);

      var that = this;

      // TODO: move selection into the math_view
      $(view).on('operatorClick numberClick', function (e, vid) {
        if (that.selection.get('mid')) {
          view.deselectNode(that.selection.get('mid'));
        }

        var mid = view.viewToModelMap[vid];
        if (mid !== that.selection.get('mid')) {
          that.selection.set('mid', mid);
          view.selectNode(mid);
        } else {
          that.selection.set('mid', 'asdf');
        }
      });
    },

    fadeTransition: function () {
      $('#fg').children().appendTo($('#bg')).transition({
        opacity: 0.0
      }, {
        complete: function () {
          $(this).remove();
        }
      }).find('.selected').each(function () {
        this.classList.remove('selected');
      });
    },

    globalClickHandler: function (e) {
      if ($(e.target).parents('svg').length === 0) {
        $('.selected').each(function () {
          this.classList.remove('selected');
        });
        this.selection.unset('mid');
      }
    }
  });
});
