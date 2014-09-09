/**
 * Created by kevin on 2014-09-08.
 */

define(function (require) {
  var $ = require('jquery');
  require('jquery_extensions');

  function evalXmlNode(node) {
    var prev = $(node).prev();
    var next = $(node).next();

    var prevValue = parseFloat(prev.text());
    var nextValue = parseFloat(next.text());

    var op = $(node).text();

    var resultValue;
    switch (op) {
      case '+':
        if (prev.prev().isOp('-')) {
          throw 'must respect order-of-operations';
        }
        resultValue = prevValue + nextValue;
        break;
      case '-':
        if (prev.prev().isOp('-')) {
          throw 'must respect order-of-operations';
        }
        resultValue = prevValue - nextValue;
        break;
      case '*':
        if (prev.prev().isOp('/')) {
          throw 'must respect order-of-operations';
        }
        resultValue = prevValue * nextValue;
        break;
      case '/':
        if (prev.prev().isOp('/')) {
          throw 'must respect order-of-operations';
        }
        resultValue = prevValue / nextValue;   // TODO: adopt exact math library
        break;
      default:
        break;
    }

    next.remove();
    $(node).remove();

    // TODO: mark result node with a specific class so that it can be highlighted in the view
    var result = prev;
    result.text(resultValue).addClass('result');

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

  return function (node) {
    if ($(node).is('mo') && $(node).prev().is('mn') && $(node).next().is('mn')) {
      try {
        evalXmlNode(node);
      } catch(e) {
        throw "can't evaluate this node"
      }
    } else {
      throw "can't evaluate this node";
    }
  }
});