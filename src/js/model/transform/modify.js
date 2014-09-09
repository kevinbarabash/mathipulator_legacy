/**
 * Created by kevin on 2014-09-08.
 */

define(function (require) {

  var $ = require('jquery');
  require('jquery_extensions');

  function multiply (mrow, term) {
    if ($(mrow).hasAddOps()) {
      $(mrow).wrap('<mrow></mrow>').before(term.outerHTML + '<mo>*</mo>');
    } else if ($(mrow).hasMulOps()) {
      $(mrow).prepend(term.outerHTML + '<mo>*</mo>');
    } else {
      // TODO: throw a more helpful error
      throw "can't handle this case yet";
    }
  }

  function divide (mrow, term) {
    if ($(mrow).hasAddOps()) {
      $(mrow).wrap('<mrow></mrow>').after('<mo>/</mo>' + term.outerHTML);
    } else if ($(mrow).hasMulOps()) {
      $(mrow).append('<mo>/</mo>' + term.outerHTML);
    } else {
      // TODO: throw a more helpful error
      throw "can't handle this case yet";
    }
  }

  return function (node, operator, expr) {
    if (!$(node).is('mrow')) {
      return;
    }

    if (/[\+\-\/\*\^]/.test(operator)) {
      if (operator === '*') {
        multiply(node, expr);
      } else if (operator === '/') {
        divide(node, expr);
      } else {
        throw "we don't handle that operator yet, try again later";
      }
    }
  };
});
