/**
 * Created by kevin on 2014-10-01.
 */

define(function (require) {

  var $ = require('jquery');
  require('jquery_extensions');

  return {
    name: 'remove_zero',
    canTransform: function (node) {
      if ($(node).number() === 0) {
        if ($(node).next().isOp('+') || $(node).next().isOp('-')) {
          return true;
        } else if ($(node).prev().isOp('+') || $(node).prev().isOp('-')) {
          return true;
        }
      }
      return false;
    },
    transform: function (node) {
      if (this.canTransform(node)) {
        var root = $(node).closest('math');
        if ($(node).prev().isOp('+') || $(node).prev().isOp('-')) {
          $(node).prev().remove();
        }
        if (!$(node).prev().is('*')) {
          if ($(node).next().isOp('+') || $(node).next().isOp('-')) {
            $(node).next().remove();
          }
        }
        $(node).remove();
        root.removeExtra('mrow');
      }
    }
  };
});
