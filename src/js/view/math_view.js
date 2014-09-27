/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  /*global MathJax */

  var Backbone = require('backbone');
  var Formatter = require('view/formatter');
  var SVGUtils = require('view/svg_utils');
  var $ = require('jquery');

  require('jquery.transit');
  require('jquery_extensions');

  // TODO: update how we show the inputs to a particular action

  var id = 0;
  function genId() {
    return 'vid-' + (id++);
  }

  return Backbone.View.extend({

    modelToViewMap: {},
    viewToModelMap: {},

    initialize: function(opts) {
      var model = opts.model;
      var options = opts.options;

      this.xml = $(model.xml).clone().get(0);
      this.createIdMaps();

      $(this.xml).find('mn').addClass('num');
      $(this.xml).find('mo').addClass('op');
      $(this.xml).attr('display', 'block');

      var format = options.format || 'arithmetic';

      if (format === 'arithmetic') {
        Formatter.formatArithmetic(this.xml);
      } else {
        Formatter.formatAlgebra(this.xml);
      }

      this.fontSize = options.fontSize || '100%';
    },

    createIdMaps: function () {
      var xml = this.xml;
      var modelToViewMap = this.modelToViewMap;
      var viewToModelMap = this.viewToModelMap;

      $(xml).find('[id]').each(function () {
        var modelId = $(this).attr('id');
        var viewId = genId();

        $(this).attr('id', viewId);

        modelToViewMap[modelId] = viewId;
        viewToModelMap[viewId] = modelId;
      });
    },

    createSelectionOverlay: function (svg) {
      var selectionGroup = SVGUtils.createSVGElement('g');
      selectionGroup.setAttribute('class', 'selection-overlay');
      $(selectionGroup).prependTo(svg.firstElementChild);

      this.addCircles(svg, selectionGroup);
      this.addNumberHighlights(svg, selectionGroup);

      this.overlay = selectionGroup;
    },

    selectNode: function (mid) {
      var sid = this.modelToViewMap[mid].replace('v','s');
      var elem = $(this.svg).find('#' + sid).get(0);
      elem.classList.add('selected');
    },

    deselectNode: function(mid) {
      var sid = this.modelToViewMap[mid].replace('v','s');
      var elem = $(this.svg).find('#' + sid).get(0);
      elem.classList.remove('selected');
    },

    addCircles: function (svg, selectionGroup) {
      var view = this;

      $(svg).find('.op').each(function () {
        var op = this;
        var node = $(view.xml).find('#' + op.id); // xml is actually mathML... precision of language
        var circle = SVGUtils.createCircleAroundOperator(op, node);
        var id = op.id.replace('s', 'v');

        $(circle).click(function () {
          $(view).trigger('operatorClick', id);
        }).appendTo(selectionGroup);
        circle.addEventListener('touchstart', function () {
          $(view).trigger('operatorClick', id);
        });

      });
    },

    addNumberHighlights: function (svg, selectionGroup) {
      var view = this;

      $(svg).find('.num').each(function () {
        var num = this;
        var rect = SVGUtils.createRoundedRectangleAroundNode(num);
        var id = num.id.replace('s', 'v');
        $(rect).click(function () {
          $(view).trigger('numberClick', id);
        }).appendTo(selectionGroup);
        rect.addEventListener('touchstart', function () {
          $(view).trigger('operatorClick', id);
        });
      });
    },

    render: function (container, animate) {
      var script = document.createElement('script');
      $(script).attr('type', 'math/mml').text(this.xml.outerHTML).appendTo(container);

      var deferred = $.Deferred();
      var view = this;

      MathJax.Hub.Queue(['Typeset', MathJax.Hub, script], function () {
        var svg = $('#' + script.id + '-Frame' + ' svg').get(0);

        var container = $(svg).parent().parent();
        container.replaceWith(svg);

        view.createSelectionOverlay(svg);
        view.svg = svg;
        SVGUtils.correctBBox(svg);
        $(svg).css({ width: '80%', height: '20%' });
        if (animate) {
          $(svg).css({ opacity: 0.0 }).animate({ opacity: 1.0 });
        }

        var overlay = $(svg).find('.selection-overlay').get(0);
        overlay.classList.add('active');

//        $(svg).find('.result').each(function () {
//          this.classList.add('blue');
//        });

        deferred.resolve(svg);
      });

      return deferred;
    }
  });
});
