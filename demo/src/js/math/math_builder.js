/**
 * Created by kevin on 2014-11-09.
 */

define(function (require, exports) {

  var uuid = require('util/uuid');

  var varRegex = /[a-zA-Z]/;
  var opRegex = /[\+\-\*\/]/;
  var numRegex = /[1-9]+[0-9]*/;

  function createAtom(value) {
    if (numRegex.test(value)) {
      return '<mn id="' + uuid() + '" class="num">' + value + '</mn>';
    } else if (varRegex.test(value)) {
      return '<mi id="' + uuid() + '" class="var">' + value + '</mi>';
    } else if (opRegex.test(value)) {
      return '<mo id="' + uuid() + '" class="op">' + value + '</mo>';
    } else {
      throw '"' + value + '" is not a valid atom';
    }
  }

  function createRow(content) {
    return '<mrow id="' + uuid() + '">' + content + '</mrow>';
  }

  function createTerm(factors) {
    var result = '';
    if (factors.length > 0) {
      result += createAtom(factors[0]);
    }
    for (var i = 1; i < factors.length; i++) {
      result += createAtom('*') + createAtom(factors[i]);
    }

    if (factors.length > 1) {
      return createRow(result);
    }
    return result;
  }

  exports.createAtom = createAtom;
  exports.createTerm = createTerm;
});
