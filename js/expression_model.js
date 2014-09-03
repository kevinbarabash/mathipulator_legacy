/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  var Parser = require('simple_mml_parser');
  var parser = new Parser();

  function ExpressionModel() {}

  ExpressionModel.fromASCII = function (ascii) {
    var model = new ExpressionModel();
    model.xml = parser.parse(ascii);
    return model;
  };

  ExpressionModel.fromXML = function (xml) {
    var model = new ExpressionModel();
    model.xml = $(xml).clone().get(0);
    return model;
  };

  ExpressionModel.prototype.clone = function () {
    return ExpressionModel.fromXML(this.xml);
  };

  function evalXmlNode(node) {
    var prev = parseFloat($(node).prev().text());
    var op = $(node).text();
    var next = parseFloat($(node).next().text());

    var result;
    switch (op) {
      case '+':
        result = prev + next;
        break;
      case '-':
        result = prev - next;
        break;
      case '*':
        result = prev * next;
        break;
      case '/':
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

  ExpressionModel.prototype.evaluateNode = function (id) {
    var node = $(this.xml).find('#' + id);

    var deferred = $.Deferred();

    if (node.is('mo') && node.prev().is('mn') && node.next().is('mn')) {
      evalXmlNode(node);
      deferred.resolve();
    } else {
      deferred.reject();
    }

    return deferred;
  };

  ExpressionModel.prototype.distribute = function(term) {
    var mrow = this.xml.firstElementChild;

    var hasMulOps = function(mrow) {
      var result = false;
      $(mrow).children().each(function () {
        if ($(this).is('mo')) {
          if ($(this).text() === '*' || $(this).text() === '/') {
            result = true;
          }
        }
      });
      return result;
    };

    // this is distribution
    if (!hasMulOps(mrow)) {
      $(mrow).children().each(function () {
        if (!$(this).is('mo')) {
          $(this).replaceWith('<mrow><mn>' + term + '</mn><mo>*</mo>' + this.outerHTML + '</mrow>');
        }
      });
    }
  };

  ExpressionModel.prototype.multiply = function(term) {
    var mrow = this.xml.firstElementChild;

    // TODO: extract these out into a MathML Utils module
    // TODO: maybe a jquery extension
    var hasAddOps = function(mrow) {
      var result = false;
      $(mrow).children().each(function () {
        if ($(this).is('mo')) {
          if ($(this).text() === '+' || $(this).text() === '-') {
            result = true;
          }
        }
      });
      return result;
    };

    var hasMulOps = function(mrow) {
      var result = false;
      $(mrow).children().each(function () {
        if ($(this).is('mo')) {
          if ($(this).text() === '*' || $(this).text() === '/') {
            result = true;
          }
        }
      });
      return result;
    };

    if (hasAddOps(mrow)) {
      $(mrow).wrap('<mrow></mrow>').before('<mn>3</mn><mo>*</mo>');
    } else if (hasMulOps(mrow)) {
      $(mrow).prepend('<mn>3</mn><mo>*</mo>');
    } else {
      // TODO: throw a more helpful error
      throw "can't handle this case yet";
    }
  };

  ExpressionModel.prototype.removeUnnecessaryRows = function () {

    function removeUnnecessaryRows(elem) {
      $(elem).children().each(function () {
        var children = $(this).children();

        if ($(this).hasClass('num')) {
          removeUnnecessaryRows(this);
        } else if ($(this).is('mrow') && children.length === 1) {
          $(this).replaceWith(children[0]);
        } else if ($(this).is('mrow') && $(this.firstElementChild).text() === '(' && $(this.lastElementChild).text() === ')') {
          $(this).replaceWith(children);
        } else {
          removeUnnecessaryRows(this);
        }
      });
    }

    removeUnnecessaryRows(this.xml);
  };

  return ExpressionModel;
});
