/**
 * Created by kevin on 2014-10-01.
 */

define(function (require) {

  var $ = require('jquery');
  require('jquery_extensions');

  return {
    name: 'remove_plus_0',
    canTransform: function (node) {
      return $(node).isOp('+') && $(node).next().number() === 0;
    },
    transform: function (node) {
      if (this.canTransform(node)) {
        var prev = $(node).prev();
        $(node).next().remove();
        $(node).remove();
        $(prev).closest('math').removeExtra('mrow');
      }
    }
  };
});
