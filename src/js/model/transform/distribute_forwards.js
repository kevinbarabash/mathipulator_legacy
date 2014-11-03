/**
 * Created by kevin on 2014-09-08.
 */

define(function (require) {

  var $ = require('jquery');
  var genId = require('uuid');

  require('jquery_extensions');

  function distributeForwards (op, expr) {
    var mrow = $(expr).next().next();

    if (mrow.hasAddOps()) {
      mrow.children().each(function () {
        if (!$(this).is('mo')) {
          var node = $(expr).clone().get(0);
          $(node).attr('id', genId());
          $(this).replaceWith('<mrow>' + node.outerHTML + '<mo class="op" id="' + genId() + '">' + op + '</mo>' + this.outerHTML + '</mrow>');
        }
      });

      // cleanup
      $(expr).next().remove();
      $(expr).remove();

      $(mrow).removeAttr('parens');
      $(mrow).closest('math').removeExtra('mrow');
      if ($(mrow).parent().hasAddOps()) {
        $(mrow).replaceWith($(mrow).children());
      }
    }
  }

  return {
    name: 'distribute_forwards',
    canTransform: function (node) {
      if ($(node).is('mo')) {
        return false;
      }

      var next = $(node).next();

      return next.isOp('*') && next.next().is('mrow') && next.next().hasAddOps();
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
