/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  /*global MathJax */

  var Formatter = require('view/formatter');
  var SVGUtils = require('view/svg_utils');
  var $ = require('jquery');

  require('jquery_extensions');

  function ExpressionView(model, options) {
    this.modelToViewMap = {};
    this.viewToModelMap = {};
    this.model = model;
    this.model.view = this;

    this.xml = $(model.xml).clone().get(0);
    this.createIdMap();

    $(this.xml).find('mn').addClass('num');
    $(this.xml).find('mo').addClass('op');
    $(this.xml).attr('display', 'block');

    if (options && options.format === 'arithmetic') {
      Formatter.formatArithmetic(this.xml);
    } else {
      Formatter.formatAlgebra(this.xml);
    }
  }

  var id = 0;
  function genId() {
    return 'vid-' + (id++);
  }

  function sidToVid(sid) {
    return sid.replace('s', 'v');
  }

  ExpressionView.prototype.createIdMap = function() {
    var modelToViewMap = this.modelToViewMap;
    var viewToModelMap = this.viewToModelMap;

    $(this.xml).find('[id]').each(function () {
      var modelId = $(this).attr('id');
      var viewId = genId();

      $(this).attr('id', viewId);

      modelToViewMap[modelId] = viewId;
      viewToModelMap[viewId] = modelId;
    });
  };

  ExpressionView.prototype.createSelectionOverlay = function (svg) {
    var selectionGroup = SVGUtils.createSVGElement('g');
    selectionGroup.setAttribute('class', 'selection-overlay');
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
      var id = sidToVid(op.id);
      $(circle).click(function () {
        $(view).trigger('operatorClick', id);
      }).appendTo(selectionGroup);
    });
  };

  ExpressionView.prototype.addNumberHighlights = function (svg, selectionGroup) {
    var view = this;

    $(svg).find('.num').each(function () {
      var num = this;
      var rect = SVGUtils.createRectangleAroundNumber(num);
      var id = sidToVid(num.id);
      $(rect).click(function () {
        $(view).trigger('numberClick', id);
      }).appendTo(selectionGroup);
    });
  };

  ExpressionView.prototype.render = function (animate) {
    var script = document.createElement('script');
    $(script).attr('type', 'math/mml').text(this.xml.outerHTML).appendTo(document.body);

    var deferred = $.Deferred();
    var view = this;

    MathJax.Hub.Queue(['Typeset', MathJax.Hub, script], function () {
      var svg = $('#' + script.id + '-Frame' + ' svg').get(0);

      view.createSelectionOverlay(svg);
      view.svg = svg;
      SVGUtils.correctBBox(svg);
      if (animate) {
        $(svg).css({ opacity: 0.0 }).animate({ opacity: 1.0 });
      }
      var overlay = $(svg).find('.selection-overlay').get(0);
      overlay.classList.add('active');

      deferred.resolve(svg);
    });

    return deferred;
  };

  return ExpressionView;
});
