/**
 * Created by kevin on 2014-10-01.
 */

define(function (require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var genId = require('util/uuid');
  require('jquery_extensions');

  return {
    name: 'collect_like_terms',

    canTransform: function (node) {
      if ($(node).isOp('+') || $(node).isOp('-')) {
        var prevFactors = $(node).prev().getVariableFactors();
        var nextFactors = $(node).next().getVariableFactors();

        if (_.isEqual(prevFactors, nextFactors)) {
         return true;
        }
      }
      return false;
    },

    // TODO: all transform must return a mapping which shows which nodes map to which
    transform: function (node) {
      if (this.canTransform(node)) {
        var term = $(node).next().getVariableFactors().map(function (name) {
          return '<mi>' + name + '</mi>';
        });

        // TODO: don't forget about order-of-operations
        var coeff = $(node).prev().getNumericFactors().reduce(function (result, value) {
          return result * value;
        }, 1);
        if ($(node).isOp('+')) {
          coeff += $(node).next().getNumericFactors().reduce(function (result, value) {
            return result * value;
          }, 1);
        } else if ($(node).isOp('-')) {
          coeff -= $(node).next().getNumericFactors().reduce(function (result, value) {
            return result * value;
          }, 1);
        }

        // TODO: give everything an id
        term = $('<mrow><mn class="num">' + coeff + '</mn><mo class="op">*</mo>' + term.join('<mo>*</mo>') + '</mrow>');
        term.find('mn,mo,mi').each(function () {
          $(this).attr('id', genId());
        });

        $(node).next().remove();
        $(node).prev().remove();
        $(node).replaceWith(term);

        $(term).closest('math').removeExtra('mrow');
      }
    }
  };
});
