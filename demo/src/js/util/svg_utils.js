/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {

  var MathSymbols = require('math/math_symbols');
  var $ = require('jquery');

  var svgNS = 'http://www.w3.org/2000/svg';

  function accumTranslate(element) {
    var tx = 0;
    var ty = 0;

    while (element.tagName !== 'svg') {
      var transform = $(element).attr('transform');
      if (transform) {
        var matches = transform.match(/translate\(([^,]+),([^\)]+)\)/);
        if (matches && matches.length === 3) {
          tx += parseFloat(matches[1]);
          ty += parseFloat(matches[2]);
        }
      }
      element = element.parentElement;
    }

    return { tx: tx, ty: ty };
  }

  return {

    createSVGElement: function (name){
      return document.createElementNS(svgNS, name);
    },

    createCircleAroundOperator: function (op, node) {
      var translate = accumTranslate(op);
      var bbox = op.getBBox();
      var radius = 1.5 * Math.max(bbox.width, bbox.height) / 2;

      if (node.text() === MathSymbols.times) {
        radius = Math.max(bbox.width, bbox.height);
      }

      var circle = document.createElementNS(svgNS, 'circle');
      $(circle).attr({
        cx: translate.tx + bbox.width / 2 + bbox.x,
        cy: translate.ty + bbox.height / 2 + bbox.y,
        r: radius,
        fill: 'transparent',
        id: op.id.replace('v', 's')
      });

      return circle;
    },

    createRectangleAroundNumber: function (num) {
      var translate = accumTranslate(num);
      var bbox = num.getBBox();

      var rect = document.createElementNS(svgNS, 'rect');
      var multiplier = 29;
      var padding = multiplier * 5;

      $(rect).attr({
        x: translate.tx + bbox.x - padding,
        y: translate.ty + bbox.y - padding,
        width: bbox.width + 2 * padding,
        height: bbox.height + 2 * padding,
        fill: 'transparent',
        id: num.id.replace('v', 's')
      });

      return rect;
    },

    createRoundedRectangleAroundNode: function (node, radius, padding) {
      var translate = accumTranslate(node);
      var bbox = node.getBBox();
      padding = padding || 0;
      bbox.x -= padding;
      bbox.y -= padding;
      bbox.width += 2 * padding;
      bbox.height += 2 * padding;

      var path = document.createElementNS(svgNS, 'path');
      radius = radius || 300;

      var x = translate.tx + bbox.x - radius / 2;
      var y = translate.ty + bbox.y - radius / 2;
      var width = bbox.width + radius;
      var height = bbox.height + radius;

      var d = 'M' + x + ',' + y
        + 'h' + (width - radius)
        + 'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + radius
        + 'v' + (height - 2 * radius)
        + 'a' + radius + ',' + radius + ' 0 0 1 ' + -radius + ',' + radius
        + 'h' + (2 * radius - width)
        + 'a' + -radius + ',' + radius + ' 0 0 1 ' + -radius + ',' + -radius
        + 'v' + (2 * radius - height)
        + 'a' + -radius + ',' + -radius + ' 0 0 1 ' + radius + ',' + -radius
        + 'z';

      $(path).attr({
        d: d,
        fill: 'transparent',
        id: node.id.replace('v', 's')
      });

      return path;
    },

    correctBBox: function (svg) {
      var viewBox = svg.getAttribute('viewBox').split(' ');
      var bbox = svg.getBBox();
      var ratio = bbox.height / parseFloat(viewBox[3]);

      viewBox[3] = bbox.height;
      viewBox[1] = bbox.y;
      viewBox[0] = bbox.x;
      viewBox[2] = bbox.width;
      svg.setAttribute('viewBox', viewBox.join(' '));

      var height = parseFloat(svg.style.height);
      var unit = 'ex';

      height = ratio * height;

      svg.style.height = height + unit;
      svg.style.width = '';
    }

  };
});
