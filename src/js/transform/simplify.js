/**
 * Created by kevin on 2014-09-08.
 */

define(function (require) {
  var $ = require('jquery');
  require('jquery_extensions');

  function simplifyMultiplication (xml) {
    $(xml).findOp('*').each(function () {
      var prev, next;

      // TODO: handle multiplier being either before or after the '*'
      if ($(this).prev().is('mn')) {
        prev = $(this).prev().number();

        if ($(this).next().is('mrow') && $(this).next().hasMulOps()) {
          var mrow = $(this).next().get(0);
          if ($(mrow.firstElementChild).is('mn')) {
            next = $(mrow.firstElementChild).number();
            $(mrow.firstElementChild).text(prev * next);
            $(this).prev().remove();
            $(this).remove();
            $(mrow).unwrap();
          }
        } else if ($(this).next().is('mn')) {
          next = $(this).next().number();
          $(this).next().text(prev * next);
          $(this).prev().remove();
          $(this).remove();
        }
      }
    });
  }

  function simplifyDivision (xml) {
    $(xml).findOp('/').each(function () {
      var prev, next;

      if ($(this).next().is('mn')) {
        next = $(this).next().number(); // denominator

        if ($(this).prev().is('mrow') && $(this).prev().hasMulOps()) {
          var mrow = $(this).prev().get(0);
          if ($(mrow.firstElementChild).is('mn')) {
            prev = $(mrow.firstElementChild).number();
            $(mrow.firstElementChild).text(prev / next);
            $(this).next().remove();
            $(this).remove();
            $(mrow).unwrap();
          }
        } else if ($(this).prev().is('mn')) {
          prev = $(this).prev().number();
          $(this).prev().text(prev / next);
          $(this).next().remove();
          $(this).remove();
        }
      }
    });
  }

  return function (root) {
    simplifyMultiplication(root);
    simplifyDivision(root);
    $(root).removeExtra('mrow');
  };
});
