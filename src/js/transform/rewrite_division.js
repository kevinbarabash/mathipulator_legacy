/**
 * Created by kevin on 2014-09-09.
 */

define(function (require) {

  var uuid = require('util/uuid');
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
        var newNode = $('<mrow><mn>1</mn><mo>/</mo>' + node.outerHTML + '</mrow>');
        $(newNode).find('mn,mo,mi').each(function () {
          $(this).attr('id', uuid());
        });
        $(node).replaceWith(newNode);
        opNode.text('*');
      }
    }
  };

});
