/**
 * Created by kevin on 2014-11-04.
 */

define(function (require) {

  var $ = require('jquery');
  var uuid = require('util/uuid');

  require('jquery_extensions');
  require('math/math_extensions');

  return {
    name: 'reduce',

    canTransform: function (node) {
      if ($(node).isFraction()) {
        var numerator = $(node).numerator();
        var denominator = $(node).denominator();

        if (numerator.isTerm() && denominator.isTerm()) {
          var numeratorCoefficient = numerator.getCoefficient();
          var denominatorCoefficient = denominator.getCoefficient();

          var factor = Math.gcf(numeratorCoefficient, denominatorCoefficient);

          var numeratorFactors = $(node).numerator().getVariableFactors();
          var denominatorFactors = $(node).denominator().getVariableFactors();

          // TODO: handle rational expressions
          if (factor !== 1 || numeratorFactors.length > 0 || denominatorFactors.length > 0) {
            return true;
          }
        }
      }

      return false;
    },

    // TODO: all transform must return a mapping which shows which nodes map to which
    transform: function (node) {
      if (this.canTransform(node)) {
        var i, factor;

        var numeratorCoefficient = $(node).numerator().getCoefficient();
        var denominatorCoefficient = $(node).denominator().getCoefficient();

        var gcf = Math.gcf(numeratorCoefficient, denominatorCoefficient);

        numeratorCoefficient /= gcf;
        denominatorCoefficient /= gcf;

        var numerator = '<mn class="num" id="' + uuid() + '">' + numeratorCoefficient + '</mn>';

        var numeratorFactors = $(node).numerator().getVariableFactors();
        if (numeratorFactors.length > 0) {
          for (i = 0; i < numeratorFactors.length; i++) {
            factor = numeratorFactors[i];
            numerator += '<mo class="op" id="' + uuid() + '">*</mo>' + '<mi>' + factor + '</mi>';
          }
          numerator = $('<mrow></mrow>').attr('id', uuid()).append(numerator);
        }

        var denominator = '<mn class="num" id="' + uuid() + '">' + denominatorCoefficient + '</mn>';

        var denominatorFactors = $(node).denominator().getVariableFactors();
        if (denominatorFactors.length > 0) {
          for (i = 0; i < denominatorFactors.length; i++) {
            factor = denominatorFactors[i];
            denominator += '<mo class="op" id="' + uuid() + '">*</mo>' + '<mi>' + factor + '</mi>';
          }
          denominator = $('<mrow></mrow>').attr('id', uuid()).append(denominator);
        }

        $(node).children().first().replaceWith(numerator);
        $(node).children().last().replaceWith(denominator);
      }
    }
  };
});
