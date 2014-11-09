
define(function () {

  Math.primeFactorization = function(num) {
    var root = Math.sqrt(num),
      result = arguments[1] || [],  //get unnamed paremeter from recursive calls
      x = 2;

    if (num % x) {
      x = 3;
      while ((num % x) && ((x = x + 2) < root)) { }
    }

    x = (x <= root) ? x : num;
    result.push(x);

    return (x === num) ? result : Math.primeFactorization(num / x, result);
  };

  Math.gcf = function (number1, number2) {
    return number2 === 0 ? number1 : Math.gcf(number2, number1 % number2);
  };

});
