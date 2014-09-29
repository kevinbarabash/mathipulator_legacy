/**
 * Created by kevin on 2014-09-28.
 */

define(function (require) {

  var Backbone = require('backbone');
  var MathView = require('view/math_view');
  var $ = require('jquery');

  return Backbone.View.extend({
    el: '#history-view',

    initialize: function () {
      this.hide();
      this.views = [];
      this.table = document.createElement('table');
      this.$el.append(this.table);
    },

    modelAdded: function (model) {
      var view = new MathView({
        model: model,
        options: { format: 'arithmetic' },
        active: false
      });

      var row = document.createElement('tr');
      var cell = document.createElement('td');
      $(cell).attr({ align: 'right' });
      $(this.table).append(row);
      $(row).append(cell);

      view.render(cell);
      this.views.push(view);

      cell = document.createElement('td');
      $(cell).text('explanation').appendTo(row);
    },

    hide: function () {
      this.$el.css({ opacity: 0 });
      this.visible = false;
    },

    show: function () {
      this.$el.css({ opacity: 1 });
      this.visible = true;
    },

    toggle: function () {
      if (this.visible) {
        this.hide();
      } else {
        this.show();
      }
    },

    reset: function () {
      // TODO: remove all of the rows
      for (var i = 1; i < this.views.length; i++) {
        this.views[i].remove();
      }
      this.views = [this.views[0]];
    }
  });
});
