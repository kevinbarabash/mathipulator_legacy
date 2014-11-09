/**
 * Created by kevin on 2014-11-08.
 */

define(function (require) {

  var $ = require('jquery');
  require('jquery_extensions');

  return {
    name: 'replace_div_1',
    canTransform: function (node) {
      return $(node).number() === 1 && $(node).prev().isOp('/');
    },
    transform: function (node) {
      if (this.canTransform(node)) {
        var root = $(node).closest('math').get(0);

        $(node).prev().remove();
        $(node).remove();

        // cleanup
        $(node).closest('math').removeExtra('mrow');

        var $mrow = $(root).find('mrow');
        $mrow.replaceWith($mrow.children().first());

        console.log(root);
      }
    }
  };
});
