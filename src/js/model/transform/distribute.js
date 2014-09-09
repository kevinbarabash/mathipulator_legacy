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

  // xml expression, node id
  return function (node) {
    if ($(node).is('mo')) {
      return;
    }

    var expr = node;

    if ($(expr).next().isOp('*') && $(expr).next().next().is('mrow')) {
      distributeForwards('*', expr);
    }

    if ($(expr).prev().isOp('*') && $(expr).prev().prev().is('mrow')) {
      distributeBackwards('*', expr);
    }

    if ($(expr).prev().isOp('/') && $(expr).prev().prev().is('mrow')) {
      distributeBackwards('/', expr);
    }

    // TODO: figure out what to do when hasAddOp = false and hasMulOps = true
  };
});