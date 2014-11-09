/**
 * Created by kevin on 2014-11-08.
 */

define(function (require) {

  var $ = require('jquery');
  var uuid = require('util/uuid');
  require('jquery_extensions');

  // TODO: needs to work with rational expressions

  return {
    name: 'add_fractions',

    canTransform: function (node) {
      var $node = $(node);
      // TODO: make this less restrictive in the future
      if ($node.isOp('+') && $node.prev().isFraction() && $node.next().isFraction()) {
        var denom1 = $node.prev().children().last();
        var denom2 = $node.next().children().last();
        if (denom1.text() === denom2.text()) {
          return true;
        }
      }
      return false;
    },

    // TODO: all transform must return a mapping which shows which nodes map to which
    transform: function (node) {
      if (this.canTransform(node)) {

        var $node = $(node);

        var numerator = $('<mrow></mrow>')
          .append($node.prev().children().first())
          .append($('<mo>+</mo>').attr('id', uuid()).addClass('op'))
          .append($node.next().children().first());

        var denominator = $node.prev().children().last();

        // TODO: determine if we need an <mrow> or not depending on whether the parent has addOps or not
        var frac = $('<mrow></mrow>')
          .append(numerator)
          .append($('<mo>/</mo>').attr('id', uuid()).addClass('op'))
          .append(denominator);

        $(frac).attr('id', uuid());

        // clean up
        $node.prev().remove();
        $node.next().remove();

        $node.replaceWith(frac);
      }
    }
  };
});
