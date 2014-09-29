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
      this.selection = new Backbone.Model();

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

      var selection = this.selection;
      $(document.body).click(function (e) {
        if ($(e.target).parents('svg').length === 0) {
          $('.selected').each(function () {
            this.classList.remove('selected');
          });
          selection.unset('mid');
        }
      });

      if (opts.active !== undefined) {
        this.active = opts.active;
      } else{
        this.active = true;
      }
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
      if (this.active) {
        var sid = this.modelToViewMap[mid].replace('v','s');
        var elem = $(this.svg).find('#' + sid).get(0);
        elem.classList.add('selected');
      }
    },

    deselectNode: function(mid) {
      if (this.active) {
        var sid = this.modelToViewMap[mid].replace('v','s');
        var elem = $(this.svg).find('#' + sid).get(0);
        elem.classList.remove('selected');
      }
    },

    addCircles: function (svg, selectionGroup) {
      var view = this;

      $(svg).find('.op').each(function () {
        var op = this;
        var node = $(view.xml).find('#' + op.id); // xml is actually mathML... precision of language
        var circle = SVGUtils.createCircleAroundOperator(op, node);
        var id = op.id.replace('s', 'v');

        $(circle).click(function () {
          view.updateSelection(id);
        }).appendTo(selectionGroup);

        circle.addEventListener('touchstart', function () {
          view.updateSelection(id);
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
          view.updateSelection(id);
        }).appendTo(selectionGroup);

        rect.addEventListener('touchstart', function () {
          view.updateSelection(id);
        });
      });
    },

    updateSelection: function (vid) {
      if (this.selection.get('mid')) {
        this.deselectNode(this.selection.get('mid'));
      }

      var mid = this.viewToModelMap[vid];
      if (mid !== this.selection.get('mid')) {
        this.selection.set('mid', mid);
        this.selectNode(mid);
      } else {
        this.selection.unset('mid');
      }
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

        view.el = svg;
        view.$el = $(svg);
        view.createSelectionOverlay(svg);
        view.svg = svg;
        SVGUtils.correctBBox(svg);
        $(svg).css({ height: '72px'});

        if (animate) {
          $(svg).css({ opacity: 0.0 }).animate({ opacity: 1.0 });
        }

        if (view.active) {
          svg.classList.add('active');
        }

        deferred.resolve(svg);
      });

      return deferred;
    },

    fadeOutAndRemove: function () {
      var view = this;
      var $bg = $('#bg');

      $bg.empty();
      $(this.el).appendTo($bg).transition({
        opacity: 0.0
      }, {
        complete: function () {
          view.remove();
        }
      });
    }
  });
});
