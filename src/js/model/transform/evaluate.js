/**
 * Created by kevin on 2014-09-08.
 */

define(function (require) {
  var $ = require('jquery');
  var uuid = require('uuid');

  require('jquery_extensions');

  function evaluate(node) {
    var prev = $(node).prev();
    var next = $(node).next();

    var prevValue = parseFloat(prev.text());
    var nextValue = parseFloat(next.text());

    var op = $(node).text();

    var resultValue;
    switch (op) {
      case '+':
        resultValue = prevValue + nextValue;
        break;
      case '-':
        resultValue = prevValue - nextValue;
        break;
      case '*':
        resultValue = prevValue * nextValue;
        break;
      case '/':
        resultValue = prevValue / nextValue;   // TODO: adopt exact math library
        break;
      default:
        break;
    }

    next.remove();
    prev.remove();

    var result = $('<mn></mn>').text(resultValue).attr({
      'class': 'num result',
      id: uuid()
    });
    $(node).replaceWith(result);

    return result;
  }

  function cleanup(result) {
    if (result.siblings().length === 0 && result.parent().is('mrow')) {
      result.unwrap('mrow');
    }
    if (result.prev().isOp('(') && result.next().isOp(')')) {
      result.prev().remove();
      result.next().remove();
    }
    if (result.siblings().length === 0 && result.parent().is('mrow')) {
      result.unwrap('mrow');
    }
  }

  return {
    name: 'evaluate',

    canTransform: function (node) {
      var prev = $(node).prev();
      var next = $(node).next();

      if ($(node).is('mo') && prev.is('mn') && next.is('mn')) {
        var op = $(node).text();

        if (op === '+' || op === '-') {
          return !prev.prev().isOp('-');
        } else if (op === '*' || op === '/') {
          return !prev.prev().isOp('/');
        }
      }

      // TODO: add error handling
      return false;
    },

    // TODO: return a record describe the inputs/outputs which can be used to color them later
    transform: function (node) {
      if (this.canTransform(node)) {
        var result = evaluate(node);
        cleanup(result);
      }
    }
  };
});
