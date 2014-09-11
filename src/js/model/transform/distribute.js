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
          $(this).replaceWith('<mrow>' + expr.outerHTML + '</mn><mo class="op" id="' + id + '">' + op + '</mo>' + this.outerHTML + '</mrow>');
        }
      });

      // cleanup
      $(expr).next().remove();
      $(expr).remove();

      $(mrow).removeAttr('parens');
    }
  }

  function distributeBackwards (op, expr) {
    var mrow = $(expr).prev().prev();

    if (mrow.hasAddOps()) {
      mrow.children().each(function () {
        if (!$(this).is('mo')) {
          var id = uuid();
          $(this).replaceWith('<mrow>' + this.outerHTML + '</mn><mo class="op" id="' + id + '">' + op + '</mo>' + expr.outerHTML + '</mrow>');
        }
      });

      // cleanup
      $(expr).prev().remove();
      $(expr).remove();

      $(mrow).removeAttr('parens');
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
