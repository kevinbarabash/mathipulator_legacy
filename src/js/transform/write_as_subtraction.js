/**
 * Created by kevin on 2014-09-14.
 */

define(function (require) {

  var $ = require('jquery');
  require('jquery_extensions');

  return {
    name: 'write_as_subtraction',

    canTransform: function (node) {
      if ($(node).isOp('+')) {
        if ($(node).next().is('mn') || $(node).next().is('mi')) {
          if ($(node).next().text().indexOf('-') === 0) {
            return true;
          }
        }
      }
      return false;
    },

    // TODO: return a record describe the inputs/outputs which can be used to color them later
    transform: function (node) {
      if (this.canTransform(node)) {
        var next = $(node).next();

        if (next.is('mi') || next.is('mn')) {
          next.text(next.text().substring(1));
        } else if (next.is('msup')) {
          var base = $(next.children()[0]);
          if (base.is('mi') || base.is('mn')) {
            base.text(base.text().substring(1));
          }
          // TODO: figure out how to handle the recursive case
          // e.g. <msup><msup><mi>x</mi><mn>2</mn</msup><mn>2</mn></msup>
          // TODO: create a function that returns the base node of any msup
        } else if (next.is('mrow')) {
          // TODO: figure out what to do for this case
          throw 'we don\'t handle rewriting subtraction in this situation, yet';
        } else {
          throw 'we don\'t handle rewriting subtraction in this situation, yet';
        }

        $(node).text('-');
      }
    }
  };
});
