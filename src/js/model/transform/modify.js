/**
 * Created by kevin on 2014-09-08.
 */

define(function (require) {

  var $ = require('jquery');
  var uuid = require('uuid');

  require('jquery_extensions');

  // TODO: need to give these guys IDs
  // TODO: switch to UUID

  function add (mrow, term) {
    var id = uuid();

    if ($(mrow).hasAddOps()) {
      $(mrow).prepend(term.outerHTML + '<mo class="op" id="' + id + '">+</mo>');
    } else if ($(mrow).hasMulOps()) {
      $(mrow).wrap('<mrow></mrow>').before(term.outerHTML + '<mo class="op" id="' + id + '">+</mo>');
    } else {
      throw "we can't add to a power, root, or function yet";
    }
  }

  function subtract (mrow, term) {
    var id = uuid();

    if ($(mrow).hasAddOps()) {
      $(mrow).append('<mo class="op" id="' + id + '">-</mo>' + term.outerHTML);
    } else if ($(mrow).hasMulOps()) {
      $(mrow).wrap('<mrow></mrow>').after('<mo class="op" id="' + id + '">-</mo>' + term.outerHTML);
    } else {
      throw "can't subtract a power, root, or function yet";
    }
  }

  function multiply (mrow, term) {
    var id = uuid();

    if ($(mrow).hasAddOps()) {
      $(mrow).wrap('<mrow></mrow>').before(term.outerHTML + '<mo class="op" id="' + id + '">*</mo>');
    } else if ($(mrow).hasMulOps()) {
      $(mrow).prepend(term.outerHTML + '<mo class="op" id="' + id + '">*</mo>');
    } else {
      throw "can't multiple a power, root, or function yet";
    }
  }

  function divide (mrow, term) {
    var id = uuid();

    if ($(mrow).hasAddOps()) {
      $(mrow).wrap('<mrow></mrow>').after('<mo class="op" id="' + id + '">/</mo>' + term.outerHTML);
    } else if ($(mrow).hasMulOps()) {
      $(mrow).append('<mo class="op" id="' + id + '">/</mo>' + term.outerHTML);
    } else {
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
//          break;
      }
    }
  };
});
