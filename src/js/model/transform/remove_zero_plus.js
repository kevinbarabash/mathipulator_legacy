/**
 * Created by kevin on 2014-10-01.
 */

define(function (require) {

  var $ = require('jquery');
  require('jquery_extensions');

  return {
    name: 'remove_0_plus',
    canTransform: function (node) {
      return $(node).number() === 0 && ($(node).next().isOp('+') || $(node).next().isOp('-')) ;
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
