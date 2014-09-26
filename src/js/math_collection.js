/**
 * Created by kevin on 2014-09-26.
 */

define(function (require) {
  var Backbone = require('backbone');

  return Backbone.Collection.extend({
    model: Backbone.Model
  });
});
