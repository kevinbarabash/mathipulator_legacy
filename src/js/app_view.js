/**
 * Created by kevin on 2014-09-26.
 */

define(function (require) {
  var Backbone = require('backbone');
  var MathView = require('view/math_view');
  var $ = require('jquery');

  return Backbone.View.extend({
    positionCallback: function (collection) {
      if (this.view) {
        this.view.fadeOutAndRemove();
      }

      var model = collection.at(collection.position);
      this.view = new MathView({
        model: model,
        options: { format: 'arithmetic' }
      });

      this.view.render($('#fg'), true);
    }
  });
});
