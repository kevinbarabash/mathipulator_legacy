/**
 * Created by kevin on 2014-10-02.
 */

define(function (require) {
  var uuid = require('util/uuid');
  var $ = require('jquery');
  require('jquery_extensions');

  return {
    name: 'reduce_coeffs',
    canTransform: function (node) {
      if ($(node).is('mn')) {
        if ($(node).prev().isOp('/')) {
          var denom = $(node);
          var numer = $(node).prev().prev();
          return (denom.hasMulOps() || denom.is('mn')) && (numer.hasMulOps() || numer.is('mn'));
        }
      }
      return false;
    },
    transform: function (node) {
      if (this.canTransform(node)) {
        var denom = $(node);
        var numer = $(node).prev().prev();

        if (denom.is('mn')) {
          if (numer.is('mn')) {
            // TODO: do the division
            // maybe call 'divide' on the '/' node
          } else if (numer.hasMulOps()) {
            var coeffFactors = [];
            var varFactors = [];

            numer.children().each(function () {
              if ($(this).isOp('/')) {
                throw 'there shouldn\'t be a "/" operator here';
              } else if (!$(this).isOp('*')) {
                if ($(this).is('mn')) {
                  coeffFactors.push(this);
                } else {
                  varFactors.push(this);
                }
              }
            });

            var coeff = 1;
            coeffFactors.forEach(function (factor) {
              coeff *= $(factor).number();
            });
            coeff /= $(denom).number();

            var newNumer = '<mrow><mn class="num" id="' + uuid() + '">' + coeff + '</mn>';
            varFactors.forEach(function (factor) {
              newNumer += '<mo class="op" id="' + uuid() + '">*</mo>';
              newNumer += factor.outerHTML;
            });
            newNumer += '</mrow>';

            numer.replaceWith(newNumer);
            denom.prev().remove();
            denom.remove();
          } else {
            throw 'we don\'t handle division with this kind of numerator';
          }
        } else if (denom.hasMulOps()) {
          throw 'we don\'t handle division by polynomal terms yet';
        } else {
          throw 'we don\'t handle division by this expression yet';
        }
      }
    }
  };
});
