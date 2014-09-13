/**
 * Created by kevin on 2014-09-08.
 */

define(function (require) {

  var $ = require('jquery');
  var uuid = require('uuid');

  require('jquery_extensions');

  function distributeForwards (op, expr) {
    var mrow = $(expr).next().next();

    if (mrow.hasAddOps()) {
      mrow.children().each(function () {
        if (!$(this).is('mo')) {
          var id = uuid();
          $(this).replaceWith('<mrow>' + expr.outerHTML + '<mo class="op" id="' + id + '">' + op + '</mo>' + this.outerHTML + '</mrow>');
        }
      });

      // cleanup
      $(expr).next().remove();
      $(expr).remove();

      $(mrow).removeAttr('parens');
    }
  }

  return {
    name: 'distribute_forwards',
    canTransform: function (node) {
      if ($(node).is('mo')) {
        return false;
      }

      var next = $(node).next();

      return next.isOp('*') && next.next().is('mrow');
    },
    transform: function (node) {
      if (this.canTransform(node)) {
        var next = $(node).next();

        if (next.isOp('*') && next.next().is('mrow')) {
          distributeForwards('*', node);
        }
      }
    }
  };
});
