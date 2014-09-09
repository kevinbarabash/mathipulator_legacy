/**
 * Created by kevin on 2014-09-08.
 */

define(function (require) {
  var $ = require('jquery');
  require('jquery_extensions');

  function canCommute (node, op) {
    if ($(node).isOp(op)) {
      var prevOp = $(node).prev().prev().get(0);
      if (prevOp) {
        if ($(prevOp).isOp(op)) {
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  }

  return function (node) {
    if (canCommute(node, '+') || canCommute(node, '*')) {
      var next$ = $(node).next();
      var prev$ = $(node).prev();
      next$.insertBefore(node);
      prev$.insertAfter(node);
    }
  };
});
