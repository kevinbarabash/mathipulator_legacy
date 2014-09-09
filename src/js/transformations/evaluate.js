/**
 * Created by kevin on 2014-09-08.
 */

define(function (require) {
  var $ = require('jquery');
  require('jquery_extensions');

  function evalXmlNode(node) {
    var prev = parseFloat($(node).prev().text());
    var op = $(node).text();
    var next = parseFloat($(node).next().text());

    var result;
    switch (op) {
      case '+':
        if ($(node).prev().prev().text() === '-') {
          throw 'must respect order-of-operations';
        }
        result = prev + next;
        break;
      case '-':
        if ($(node).prev().prev().text() === '-') {
          throw 'must respect order-of-operations';
        }
        result = prev - next;
        break;
      case '*':
        if ($(node).prev().prev().text() === '/') {
          throw 'must respect order-of-operations';
        }
        result = prev * next;
        break;
      case '/':
        if ($(node).prev().prev().text() === '/') {
          throw 'must respect order-of-operations';
        }
        result = prev / next;   // TODO: adopt exact math library
        break;
      default:
        break;
    }

    // TODO: mark result node with a specific class so that it can be highlighted in the view
    $(node).prev().text(result).addClass('result');
    $(node).next().remove();
    $(node).remove();
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