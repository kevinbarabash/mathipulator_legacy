/**
 * Created by kevin on 2014-10-01.
 */

define(function (require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var genId = require('uuid');
  require('jquery_extensions');

  return {
    name: 'collect_like_terms',

    canTransform: function (node) {
      if ($(node).isOp('+') || $(node).isOp('-')) {
        if ($(node).prev().hasMulOps() && $(node).next().hasMulOps()) {

          var prevFactors = [];
          $(node).prev().children().each(function () {
            if ($(this).is('mi')) {
              prevFactors.push($(this).text());
            }
          });

          var nextFactors = [];
          $(node).next().children().each(function () {
            if ($(this).is('mi')) {
              nextFactors.push($(this).text());
            }
          });

         if (_.isEqual(prevFactors, nextFactors)) {
           return true;
         }
        }
      }
      return false;
    },

    // TODO: all transform must return a mapping which shows which nodes map to which
    transform: function (node) {
      if (this.canTransform(node)) {

        var prevFactors = [];
        $(node).prev().children().each(function () {
          if ($(this).is('mn')) {
            prevFactors.push($(this).number());
          }
        });

        var nextFactors = [];
        $(node).next().children().each(function () {
          if ($(this).is('mn')) {
            nextFactors.push($(this).number());
          }
        });

        var term = [];
        $(node).next().children().each(function () {
          if ($(this).is('mi')) { // TODO: handle powers
            term.push('<mi>' + $(this).text() + '</mi>');
          }
        });

        // TODO: don't forget about order-of-operations
        var coeff = prevFactors[0];
        if ($(node).isOp('+')) {
          coeff += nextFactors[0];
        } else if ($(node).isOp('-')) {
          coeff -= nextFactors[0];
        }

        // TODO: give everything an id
        term = $('<mrow><mn class="num">' + coeff + '</mn><mo class="op">*</mo>' + term.join('<mo>*</mo>') + '</mrow>');
        term.find('mn,mo,mi').each(function () {
          $(this).attr('id', genId());
        });

        $(node).next().remove();
        $(node).prev().remove();
        $(node).replaceWith(term);

        $(node).closest('math').removeExtra('mrow');
      }
    }
  };
});
