/**
 * Created by kevin on 2014-09-12.
 */

define(function (require) {

  var $ = require('jquery');
  var uuid = require('util/uuid');

  require('jquery_extensions');

  function distributeBackwards (op, expr) {
    var mrow = $(expr).prev().prev();

    if (mrow.hasAddOps()) {
      mrow.children().each(function () {
        if (!$(this).is('mo')) {
          var node = $(expr).clone().get(0);
          $(node).attr('id', uuid());
          $(this).replaceWith('<mrow>' + this.outerHTML + '<mo class="op" id="' + uuid() + '">' + op + '</mo>' + node.outerHTML + '</mrow>');
        }
      });

      // cleanup
      $(expr).prev().remove();
      $(expr).remove();

      $(mrow).removeAttr('parens');
      $(mrow).closest('math').removeExtra('mrow');
      if ($(mrow).parent().hasAddOps()) {
        $(mrow).replaceWith($(mrow).children());
      }
    }
  }

  return {
    name: 'distribute_backwards',
    canTransform: function (node) {
      if ($(node).is('mo')) {
        return false;
      }

      var prev = $(node).prev();
      return (prev.isOp('*') || prev.isOp('/')) && prev.prev().is('mrow') && prev.prev().hasAddOps();
    },
    transform: function (node) {
      if (this.canTransform(node)) {
        var prev = $(node).prev();

        if (prev.isOp('*') && prev.prev().is('mrow')) {
          distributeBackwards('*', node);
        }

        if (prev.isOp('/') && prev.prev().is('mrow')) {
          distributeBackwards('/', node);
        }
      }
    }
  };
});
