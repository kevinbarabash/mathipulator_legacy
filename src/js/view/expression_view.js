/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {

  var Formatter = require('view/formatter');
  var SVGUtils = require('view/svg_utils');
  var $ = require('jquery');

  require('jquery_extensions');

  function ExpressionView(model, options) {
    this.xml = $(model.xml).clone().get(0);

    if (options && options.format === 'arithmetic') {
      Formatter.formatArithmetic(this.xml);
    } else {
      Formatter.formatAlgebra(this.xml);
    }
  }

  ExpressionView.prototype.createSelectionOverlay = function (svg) {
    var selectionGroup = SVGUtils.createSVGElement('g');
    selectionGroup.setAttribute('class', 'selectionOverlay');
    $(selectionGroup).appendTo(svg.firstElementChild);

    this.addCircles(svg, selectionGroup);
    this.addNumberHighlights(svg, selectionGroup);
  };

  ExpressionView.prototype.addCircles = function (svg, selectionGroup) {
    var view = this;

    $(svg).find('.op').each(function () {
      var op = this;
      var node = $(view.xml).find('#' + op.id); // xml is actually mathML... precision of language
      var circle = SVGUtils.createCircleAroundOperator(op, node);
      $(circle).click(function () {
        $(view).trigger('operatorClick', $(this).attr('for'));
      }).appendTo(selectionGroup);
    });
  };

  ExpressionView.prototype.addNumberHighlights = function (svg, selectionGroup) {
    var view = this;

    $(svg).find('.num').each(function () {
      var num = this;
      var rect = SVGUtils.createRectangleAroundNumber(num);
      $(rect).click(function () {
        $(view).trigger('numberClick', $(this).attr('for'));
      }).appendTo(selectionGroup);
    });
  };

  ExpressionView.prototype.render = function () {
    var script = document.createElement('script');
    $(script).attr('type', 'math/mml').text(this.xml.outerHTML).appendTo(document.body);

    var deferred = $.Deferred();
    var view = this;

    MathJax.Hub.Queue(['Typeset', MathJax.Hub, script], function () {
      var svg = $('#' + script.id + '-Frame' + ' svg').get(0);

      view.createSelectionOverlay(svg);
      view.svg = svg;
      SVGUtils.correctBBox(svg);

      deferred.resolve(svg);
    });

    return deferred;
  };

  return ExpressionView;
});
