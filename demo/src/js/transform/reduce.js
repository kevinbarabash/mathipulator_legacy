/**
 * Created by kevin on 2014-11-04.
 */

define(function (require) {

  var $ = require('jquery');
  var builder = require('math/math_builder');

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
        var numeratorCoefficient = $(node).numerator().getCoefficient();
        var denominatorCoefficient = $(node).denominator().getCoefficient();

        var gcf = Math.gcf(numeratorCoefficient, denominatorCoefficient);

        var numeratorFactors = $(node).numerator().getVariableFactors();
        numeratorFactors.unshift(numeratorCoefficient / gcf);
        var numerator = builder.createTerm(numeratorFactors);

        var denominatorFactors = $(node).denominator().getVariableFactors();
        denominatorFactors.unshift(denominatorCoefficient / gcf);
        var denominator = builder.createTerm(denominatorFactors);

        $(node).children().first().replaceWith(numerator);
        $(node).children().last().replaceWith(denominator);
      }
    }
  };
});
