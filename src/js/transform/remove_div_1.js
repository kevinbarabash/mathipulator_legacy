/**
 * Created by kevin on 2014-11-08.
 */

define(function (require) {

  var $ = require('jquery');
  require('jquery_extensions');

  return {
    name: 'remove_div_1',
    canTransform: function (node) {
      return $(node).number() === 1 && $(node).prev().isOp('/');
    },
    transform: function (node) {
      if (this.canTransform(node)) {
        var $root = $(node).closest('math');

        $(node).prev().remove();
        $(node).remove();

        // cleanup
        $root.removeExtra('mrow');
      }
    }
  };
});
