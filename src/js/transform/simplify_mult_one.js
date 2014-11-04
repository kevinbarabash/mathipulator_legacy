/**
 * Created by kevin on 2014-10-03.
 */

define(function (require) {

  var $ = require('jquery');
  require('jquery_extensions');

  return {
    name: 'simplify_multi_one',
    canTransform: function (node) {
      return $(node).number() === 1 && $(node).next().isOp('*');
    },
    transform: function (node) {
      if (this.canTransform(node)) {
        var root = $(node).closest('math');
        $(node).remove();
        root.removeExtra('mrow');
      }
    }
  };
});
