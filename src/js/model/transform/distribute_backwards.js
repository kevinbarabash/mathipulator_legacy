/**
 * Created by kevin on 2014-09-12.
 */

define(function (require) {

  var $ = require('jquery');
  var uuid = require('uuid');

  require('jquery_extensions');

  function distributeBackwards (op, expr) {
    var mrow = $(expr).prev().prev();

    if (mrow.hasAddOps()) {
      mrow.children().each(function () {
        if (!$(this).is('mo')) {
          var id = uuid();
          $(this).replaceWith('<mrow>' + this.outerHTML + '<mo class="op" id="' + id + '">' + op + '</mo>' + expr.outerHTML + '</mrow>');
        }
      });

      // cleanup
      $(expr).prev().remove();
      $(expr).remove();

      $(mrow).removeAttr('parens');
      $(mrow).closest('math').removeExtra('mrow');
    }
  }

  return {
    name: 'distribute_backwards',
    canTransform: function (node) {
      if ($(node).is('mo')) {
        return false;
      }

      var prev = $(node).prev();
      return (prev.isOp('*') || prev.isOp('/')) && prev.prev().is('mrow');
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
