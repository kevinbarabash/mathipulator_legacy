/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  var Parser = require('parser');
  var parser = new Parser();

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

  ExpressionModel.prototype.distribute = function (term) {
    var mrow;

    // verify that we can do a distribution operation before doing it
    // check if the term is followed by multiplication and an mrow
    if ($(term).next().is('mo') && $(term).next().text() === '*' && $(term).next().next().is('mrow')) {
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

    if ($(term).prev().is('mo') && $(term).prev().text() === '/' && $(term).prev().prev().is('mrow')) {
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

    this.removeUnnecessaryRows();
  };

  ExpressionModel.prototype.multiply = function (term) {
    var mrow = this.xml.firstElementChild;

    if ($(mrow).hasAddOps()) {
      $(mrow).wrap('<mrow></mrow>').before(term.outerHTML + '<mo>*</mo>');
    } else if ($(mrow).hasMulOps()) {
      $(mrow).prepend(term.outerHTML + '<mo>*</mo>');
    } else {
      // TODO: throw a more helpful error
      throw "can't handle this case yet";
    }
  };

  ExpressionModel.prototype.divide = function (term) {
    var mrow = this.xml.firstElementChild;

    if ($(mrow).hasAddOps()) {
      $(mrow).wrap('<mrow></mrow>').after('<mo>/</mo>' + term.outerHTML);
    } else if ($(mrow).hasMulOps()) {
      $(mrow).append('<mo>/</mo>' + term.outerHTMl);
    } else {
      // TODO: throw a more helpful error
      throw "can't handle this case yet";
    }
  };

  // TODO: simplify other operations, e.g. division
  ExpressionModel.prototype.simplifyMultiplication = function () {
    $(this.xml).find('mo').filter(function () {
      return $(this).text() === '*'
    }).each(function () {
      var prev, next;

      if ($(this).prev().is('mn')) {
        prev = $(this).prev().number();

        if ($(this).next().is('mrow') && $(this).next().hasMulOps()) {
          var mrow = $(this).next().get(0);
          if ($(mrow.firstElementChild).is('mn')) {
            next = $(mrow.firstElementChild).number();
            $(mrow.firstElementChild).text(prev * next);
            $(this).prev().remove();
            $(this).remove();
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

  function removeUnnecessaryRows (elem) {
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

  ExpressionModel.prototype.removeUnnecessaryRows = function () {
    removeUnnecessaryRows(this.xml);
  };

  return ExpressionModel;
});
