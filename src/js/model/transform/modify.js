/**
 * Created by kevin on 2014-09-08.
 */

define(function (require) {

  var $ = require('jquery');
  require('jquery_extensions');

  // TODO: need to give these guys IDs
  // TODO: switch to UUID

  function add (mrow, term) {
    if ($(mrow).hasAddOps()) {
      $(mrow).prepend(term.outerHTML + '<mo class="op">+</mo>');
    } else if ($(mrow).hasMulOps()) {
      $(mrow).wrap('<mrow></mrow>').before(term.outerHTML + '<mo class="op">+</mo>');
    } else {
      console.log(mrow);
      throw "we can't add to a power, root, or function yet";
    }
  }

  function subtract (mrow, term) {
    if ($(mrow).hasAddOps()) {
      $(mrow).append('<mo class="op">-</mo>' + term.outerHTML);
    } else if ($(mrow).hasMulOps()) {
      $(mrow).wrap('<mrow></mrow>').after('<mo class="op">-</mo>' + term.outerHTML);
    } else {
      console.log(mrow);
      throw "can't subtract a power, root, or function yet";
    }
  }

  function multiply (mrow, term) {
    if ($(mrow).hasAddOps()) {
      $(mrow).wrap('<mrow></mrow>').before(term.outerHTML + '<mo>*</mo>');
    } else if ($(mrow).hasMulOps()) {
      $(mrow).prepend(term.outerHTML + '<mo>*</mo>');
    } else {
      console.log(mrow);
      throw "can't multiple a power, root, or function yet";
    }
  }

  function divide (mrow, term) {
    if ($(mrow).hasAddOps()) {
      $(mrow).wrap('<mrow></mrow>').after('<mo>/</mo>' + term.outerHTML);
    } else if ($(mrow).hasMulOps()) {
      $(mrow).append('<mo>/</mo>' + term.outerHTML);
    } else {
      console.log(mrow);
      throw "we can't divide a power, root, or function yet";
    }
  }

  return function (node, operator, expr) {
    if (!$(node).is('mrow')) {
      return;
    }

    if (/[\+\-\/\*\^]/.test(operator)) {
      switch (operator) {
        case '+':
          add(node, expr);
          break;
        case '-':
          subtract(node, expr);
          break;
        case '*':
          multiply(node, expr);
          break;
        case '/':
          divide(node, expr);
          break;
        default:
          throw "we don't handle that operator yet, try again later";
          break;
      }
    }
  };
});
