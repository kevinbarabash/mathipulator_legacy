/**
 * Created by kevin on 2014-09-09.
 */

define(function (require) {

  var $ = require('jquery');
  require('jquery_extensions');

  return {
    name: 'rewrite_subtraction',

    canTransform: function (node) {
      return $(node).isOp('-');
    },

    // TODO: return a record describe the inputs/outputs which can be used to color them later
    transform: function (node) {
      if (this.canTransform(node)) {
        var next = $(node).next();
        next.addClass('result');

        if (next.is('mi') || next.is('mn')) {
          next.text('-' + next.text());
        } else if (next.is('msup')) {
          var base = $(next.children()[0]);
          if (base.is('mi') || base.is('mn')) {
            base.text('-' + base.text());
          }
          // TODO: figure out how to handle the recursive case
          // e.g. <msup><msup><mi>x</mi><mn>2</mn</msup><mn>2</mn></msup>
          // TODO: create a function that returns the base node of any msup
        } else if (next.is('mrow')) {
          var firstChild = next.children().first();
          if (firstChild.is('mn') || firstChild.is('mo')) {
            if (firstChild.text().indexOf('-') === 0) {
              throw "we can't rewrite subtract where the operand is negative"
            }
            firstChild.text('-' + firstChild.text());
          }
        } else {
          throw 'we don\'t handle rewriting subtraction in this situation, yet';
        }

        $(node).text('+');
      }
    }
  };

});
