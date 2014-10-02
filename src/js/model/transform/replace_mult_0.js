/**
 * Created by kevin on 2014-10-01.
 */

define(function (require) {

  var $ = require('jquery');
  require('jquery_extensions');

  return {
    name: 'replace_mult_0',
    canTransform: function (node) {
      return $(node).number() === 0 && $(node).next().isOp('*');
    },
    transform: function (node) {
      if (this.canTransform(node)) {
        while ($(node).next().is('*')) {
          $(node).next().remove();
        }
        $(node).closest('math').removeExtra('mrow');
      }
    }
  };
});
