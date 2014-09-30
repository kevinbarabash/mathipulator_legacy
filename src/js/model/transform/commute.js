/**
 * Created by kevin on 2014-09-08.
 */

define(function (require) {

  var $ = require('jquery');
  require('jquery_extensions');

  return {
    name: 'commute',

    canTransform: function (node) {
      if ($(node).isOp('+') || $(node).isOp('*') || $(node).isOp('=')) {
        var op = $(node).text();
        var prevOp = $(node).prev().prev().get(0);
        if (prevOp) {
          return $(prevOp).isOp(op);
        } else {
          return true;
        }
      }
      return false;
    },

    // TODO: all transform must return a mapping which shows which nodes map to which
    transform: function (node) {
      if (this.canTransform(node)) {
        var next = $(node).next();
        var prev = $(node).prev();
        next.insertBefore(node);
        prev.insertAfter(node);
      }
    }
  };
});
