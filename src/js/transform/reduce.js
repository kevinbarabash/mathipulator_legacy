/**
 * Created by kevin on 2014-11-04.
 */

/**
 * Created by kevin on 2014-10-01.
 */

define(function (require) {

  var $ = require('jquery');
  var uuid = require('util/uuid');
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
      if ($(node).is('mrow') && $(node).children().length === 3) {
        if ($(node).find(':nth-child(2)').isOp('/')) {
          var numer = $(node).children().first();
          var denom = $(node).children().last();
          return (denom.hasMulOps() || denom.is('mn')) && (numer.hasMulOps() || numer.is('mn'));
        }
      }
      return false;
    },

    // TODO: all transform must return a mapping which shows which nodes map to which
    transform: function (node) {
      if (this.canTransform(node)) {

        var prevNumFacts = $(node).children().first().getNumericFactors();
        var nextNumFacts = $(node).children().last().getNumericFactors();

        var numeratorCoefficient = prevNumFacts.reduce(function (result, value) {
          return result * value;
        }, 1);
        var denominatorCoefficient = nextNumFacts.reduce(function (result, value) {
          return result * value;
        }, 1);

        var factor = gcd(numeratorCoefficient, denominatorCoefficient);

        numeratorCoefficient /= factor;
        denominatorCoefficient /= factor;

        var numerator = '<mn class="num" id="' + uuid() + '">' + numeratorCoefficient + '</mn>' +
          $(node).prev().getVariableFactors().map(function (name) {
            return '<mi>' + name + '</mi>';
          }).join('<mo class="op" id="' + uuid() + '">*</mo>');
        var denominator = '<mn class="num" id="' + uuid() + '">' + denominatorCoefficient + '</mn>' +
          $(node).next().getVariableFactors().map(function (name) {
            return '<mi>' + name + '</mi>';
          }).join('<mo class="op" id="' + uuid() + '">*</mo>');

//        $(node).prev().replaceWith('<mrow>' + numerator + '</mrow>');
//        $(node).next().replaceWith('<mrow>' + denominator + '</mrow>');
        $(node).children().first().replaceWith(numerator);
        $(node).children().last().replaceWith(denominator);
      }
    }
  };
});
