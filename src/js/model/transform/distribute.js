/**
 * Created by kevin on 2014-09-08.
 */

define(function (require) {

  var $ = require('jquery');
  require('jquery_extensions');

  function distributeForwards (op, expr) {
    var mrow = $(expr).next().next();

    if (mrow.hasAddOps()) {
      mrow.children().each(function () {
        if (!$(this).is('mo')) {
          $(this).replaceWith('<mrow>' + expr.outerHTML + '</mn><mo>' + op + '</mo>' + this.outerHTML + '</mrow>');
        }
      });

      // cleanup
      $(expr).next().remove();
      $(expr).remove();
    }
  }

  function distributeBackwards (op, expr) {
    var mrow = $(expr).prev().prev();

    if (mrow.hasAddOps()) {
      mrow.children().each(function () {
        if (!$(this).is('mo')) {
          $(this).replaceWith('<mrow>' + this.outerHTML + '</mn><mo>' + op + '</mo>' + expr.outerHTML + '</mrow>');
        }
      });

      // cleanup
      $(expr).prev().remove();
      $(expr).remove();
    }
  }

  return {
    name: 'distribute',
    canTransform: function (node) {
      if ($(node).is('mo')) {
        return false;
      }

      var next = $(node).next();
      var prev = $(node).prev();

      return next.isOp('*') && next.next().is('mrow') ||
        prev.isOp('*') && prev.prev().is('mrow') ||
        prev.isOp('/') && prev.prev().is('mrow');
    },
    transform: function (node) {
      if (this.canTransform(node)) {
        var next = $(node).next();
        var prev = $(node).prev();

        if (next.isOp('*') && next.next().is('mrow')) {
          distributeForwards('*', node);
        }

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