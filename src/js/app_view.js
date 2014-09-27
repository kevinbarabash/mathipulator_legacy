/**
 * Created by kevin on 2014-09-26.
 */

define(function (require) {
  var Backbone = require('backbone');
  var MathView = require('view/math_view');
  var $ = require('jquery');

  return Backbone.View.extend({
    positionCallback: function (collection) {
      var model = collection.at(collection.position);
      this.fadeTransition();

      var view = new MathView({
        model: model,
        options: { format: 'arithmetic' }
      });

      view.render($('#fg'), true);
      this.trigger('viewadded', view);
    },

    fadeTransition: function () {
      $('#bg').empty();
      $('#fg').children().appendTo($('#bg')).transition({
        opacity: 0.0
      }, {
        complete: function () {
          $(this).remove();
        }
      }).find('.selected').each(function () {
        this.classList.remove('selected');
      });
    }
  });
});
