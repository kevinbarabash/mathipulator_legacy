/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  var Parser = require('parser');
  var parser = new Parser();
  var $ = require('jquery');

  require('jquery_extensions');

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

  ExpressionModel.prototype.evaluateNode = function (id) {
    var clone = this.clone();
    var node = clone.getNode(id);

    if ($(node).is('mo') && $(node).prev().is('mn') && $(node).next().is('mn')) {
      try {
        evalXmlNode(node);
        clone.removeUnnecessaryRows();
        clone.removeUnnecessaryParentheses();
      } catch(e) {
        throw "can't evaluate this node"
      }
    } else {
      throw "can't evaluate this node";
    }

    return clone;
  };

  ExpressionModel.prototype.getNode = function (id) {
    return $(this.xml).find('#' + id).get(0);
  };

  ExpressionModel.prototype.distribute = function (id) {

    var clone = this.clone();
    var term = clone.getNode(id);

    var mrow;

    // verify that we can do a distribution operation before doing it
    // check if the term is followed by multiplication and an mrow
    if ($(term).next().isOp('*') && $(term).next().next().is('mrow')) {
      mrow = $(term).next().next().get(0);

      // check that the row has multiple terms
      if ($(mrow).hasAddOps()) {

        // actual distribute the term
        $(mrow).children().each(function () {
          if (!$(this).is('mo')) {
            $(this).replaceWith('<mrow>' + term.outerHTML + '</mn><mo>*</mo>' + this.outerHTML + '</mrow>');
          }
        });

        // cleanup
        $(term).next().remove();
        $(term).remove();
      }
      // TODO: figure out what to do when hasAddOp = false and hasMulOps = true
    }

    if ($(term).prev().isOp('/') && $(term).prev().prev().is('mrow')) {
      mrow = $(term).prev().prev().get(0);

      // check that the row has multiple terms
      if ($(mrow).hasAddOps()) {

        // actual distribute the term
        $(mrow).children().each(function () {
          if (!$(this).is('mo')) {
            $(this).replaceWith('<mrow>' + this.outerHTML + '</mn><mo>/</mo>' + term.outerHTML + '</mrow>');
          }
        });

        // cleanup
        $(term).prev().remove();
        $(term).remove();
      }
    }

    clone.removeUnnecessaryRows();
    return clone;
  };

  ExpressionModel.prototype.modify = function (operator, expr) {
    if (/[\+\-\/\*\^]/.test(operator)) {
      if (operator === '*') {
        return this.multiply(expr);
      } else if (operator === '/') {
        return this.divide(expr);
      } else {
        throw "we don't handle that operator yet, try again later";
      }
    }
  };

  ExpressionModel.prototype.multiply = function (term) {
    var clone = this.clone();
    var mrow = clone.xml.firstElementChild;
    term = term.xml.firstElementChild;

    if ($(mrow).hasAddOps()) {
      $(mrow).wrap('<mrow></mrow>').before(term.outerHTML + '<mo>*</mo>');
    } else if ($(mrow).hasMulOps()) {
      $(mrow).prepend(term.outerHTML + '<mo>*</mo>');
    } else {
      // TODO: throw a more helpful error
      throw "can't handle this case yet";
    }

    return clone;
  };

  ExpressionModel.prototype.divide = function (term) {
    var clone = this.clone();
    var mrow = clone.xml.firstElementChild;
    term = term.xml.firstElementChild;

    if ($(mrow).hasAddOps()) {
      $(mrow).wrap('<mrow></mrow>').after('<mo>/</mo>' + term.outerHTML);
    } else if ($(mrow).hasMulOps()) {
      $(mrow).append('<mo>/</mo>' + term.outerHTML);
    } else {
      // TODO: throw a more helpful error
      throw "can't handle this case yet";
    }

    return clone;
  };

  ExpressionModel.prototype.simplify = function () {
    var clone = this.clone();
    this.simplifyMultiplication(clone.xml);
    this.simplifyDivision(clone.xml);
    return clone;
  };

  // TODO: move this method to a helper module similar to formatter.js, but for transforming mathml
  ExpressionModel.prototype.simplifyMultiplication = function (xml) {
    $(xml).findOp('*').each(function () {
      var prev, next;

      // TODO: handle multiplier being either before or after the '*'
      if ($(this).prev().is('mn')) {
        prev = $(this).prev().number();

        if ($(this).next().is('mrow') && $(this).next().hasMulOps()) {
          var mrow = $(this).next().get(0);
          if ($(mrow.firstElementChild).is('mn')) {
            next = $(mrow.firstElementChild).number();
            $(mrow.firstElementChild).text(prev * next);
            $(this).prev().remove();
            $(this).remove();
            $(mrow).unwrap();
          }
        } else if ($(this).next().is('mn')) {
          next = $(this).next().number();
          $(this).next().text(prev * next);
          $(this).prev().remove();
          $(this).remove();
        }
      }
    });
  };

  // TODO: move this method to a helper module similar to formatter.js, but for transforming mathml
  ExpressionModel.prototype.simplifyDivision = function (xml) {
    $(xml).findOp('/').each(function () {
      var prev, next;

      if ($(this).next().is('mn')) {
        next = $(this).next().number(); // denominator

        if ($(this).prev().is('mrow') && $(this).prev().hasMulOps()) {
          var mrow = $(this).prev().get(0);
          if ($(mrow.firstElementChild).is('mn')) {
            prev = $(mrow.firstElementChild).number();
            $(mrow.firstElementChild).text(prev / next);
            $(this).next().remove();
            $(this).remove();
            $(mrow).unwrap();
          }
        } else if ($(this).prev().is('mn')) {
          prev = $(this).prev().number();
          $(this).prev().text(prev / next);
          $(this).next().remove();
          $(this).remove();
        }
      }
    });
  };

  ExpressionModel.prototype.commute = function (id) {
    var clone = this.clone();
    var node = clone.getNode(id);
    // TODO: update clone's ids

    if (clone.canCommuteAddition(node) || clone.canCommuteMultiplication(node)) {
      var next$ = $(node).next();
      var prev$ = $(node).prev();
      next$.insertBefore(node);
      prev$.insertAfter(node);
    }

    return clone;
  };

  ExpressionModel.prototype.canCommuteAddition = function (node) {
    if ($(node).isOp('+')) {
      var prevOp = $(node).prev().prev().get(0);
      if (prevOp) {
        if ($(prevOp).isOp('+')) {
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  };

  ExpressionModel.prototype.canCommuteMultiplication = function (node) {
    if ($(node).isOp('*')) {
      var prevOp = $(node).prev().prev().get(0);
      if (prevOp) {
        if ($(prevOp).isOp('*')) {
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  };

  ExpressionModel.prototype.rewriteSubtraction = function (id) {
    var clone = this.clone();
    var node = clone.getNode(id);

    if ($(node).isOp('-')) {
      var next = $(node).next();

      if (next.is('mi') || next.is('mn')) {
        next.text('-' + next.text());
      } else if (next.is('msup')) {
        var base = $(next.children()[0]);
        if (base.is('mi') || base.is('mn')) {
          base.text('-' + base.text());
        }
        // TODO: figure out how to handle the recursive case
        // e.g. <msup><msup><mi>x</mi><mn>2</mn</msup><mn>2</mn></msup>
        // TODO: create a function that returns the base node of any msup
      } else if (next.is('mrow')) {
        // TODO: figure out what to do for this case
      } else {
        throw "we don't handle rewriting subtraction in this situation, yet";
      }

      $(node).text('+');
    }

    return clone;
  };

  // TODO: fix this transform to play nice with commuting multiplication
  ExpressionModel.prototype.rewriteDivision = function (id) {
    var clone = this.clone();
    var node = clone.getNode(id);

    if ($(node).prev().isOp('/')) {
      var opNode = $(node).prev();
      if ($(node).is('mi') || $(node).is('mn')) {
        $(node).replaceWith('<mn>1</mn><mo>/</mo>' + node.outerHTML);
        opNode.text('*');
      }
    }

    return clone;
  };

  ExpressionModel.prototype.removeUnnecessaryRows = function () {
    $(this.xml).find('mrow').each(function () {
      var children = $(this).children();
      if ($(this).is('mrow') && children.length === 1) {
        $(this).replaceWith(children[0]);
      } else if ($(this).is('mrow') && $(this.firstElementChild).text() === '(' && $(this.lastElementChild).text() === ')') {
        $(this).replaceWith(children);
      }
    });
  };

  ExpressionModel.prototype.removeUnnecessaryParentheses = function () {
    $(this.xml).findOp('(').each(function () {
      if ($(this).next().next().text() === ')' && !$(this).next().is('mrow')) {
        $(this).next().next().remove();
        $(this).remove();
      }
    });
  };

  return ExpressionModel;
});
