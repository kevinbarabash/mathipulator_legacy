/**
 * Created by kevin on 2014-11-04.
 */

/**
 * Created by kevin on 2014-10-01.
 */

define(function (require) {

  var $ = require('jquery');
//  var uuid = require('util/uuid');
  require('jquery_extensions');

  function primeFactorization(num){
    var root = Math.sqrt(num),
      result = arguments[1] || [],  //get unnamed paremeter from recursive calls
      x = 2;

    if (num % x) {
      x = 3;
      while ((num % x) && ((x = x + 2) < root)) { }
    }

    x = (x <= root) ? x : num;
    result.push(x);

    return (x === num) ? result : primeFactorization(num / x, result) ;
  }

  function gcd(number1, number2) {
    if(number2 === 0){
      return number1;
    }
    return gcd(number2, number1 % number2);
  }

  return {
    name: 'reduce',

    canTransform: function (node) {
      if ($(node).isOp('/') && !$(node).next().hasAddOps() && !$(node).prev().hasAddOps()) {
        return true;
      }
      return false;
    },

    // TODO: all transform must return a mapping which shows which nodes map to which
    transform: function (node) {
      if (this.canTransform(node)) {

        var prevNumFacts = $(node).prev().getNumericFactors();
        var nextNumFacts = $(node).next().getNumericFactors();

        var numeratorCoefficient = prevNumFacts.reduce(function (result, value) {
          return result * value;
        }, 1);
        var denominatorCoefficient = nextNumFacts.reduce(function (result, value) {
          return result * value;
        }, 1);

        var factor = gcd(numeratorCoefficient, denominatorCoefficient);

        numeratorCoefficient /= factor;
        denominatorCoefficient /= factor;

        var numerator = '<mn>' + numeratorCoefficient + '</mn>' +
          $(node).prev().getVariableFactors().map(function (name) {
            return '<mi>' + name + '</mi>';
          }).join('<mo>*</mo>');
        var denominator = '<mn>' + denominatorCoefficient + '</mn>' +
          $(node).next().getVariableFactors().map(function (name) {
            return '<mi>' + name + '</mi>';
          }).join('<mo>*</mo>');

//        $(node).prev().replaceWith('<mrow>' + numerator + '</mrow>');
//        $(node).next().replaceWith('<mrow>' + denominator + '</mrow>');
        $(node).prev().replaceWith(numerator);
        $(node).next().replaceWith(denominator);
      }
    }
  };
});
