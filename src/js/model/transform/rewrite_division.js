/**
 * Created by kevin on 2014-09-09.
 */

define(function (require) {

  var $ = require('jquery');
  require('jquery_extensions');

  return {
    name: 'rewrite_division',
    canTransform: function (node) {
      if ($(node).prev().isOp('/')) {
        return $(node).is('mi') || $(node).is('mn');
      }
    },
    transform: function (node) {
      if (this.canTransform(node)) {
        var opNode = $(node).prev();
        // TODO: need to give this <mn>1</mn> an id
        $(node).replaceWith('<mn>1</mn><mo>/</mo>' + node.outerHTML);
        opNode.text('*');
      }
    }
  };

});
