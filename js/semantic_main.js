/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  'use strict';

  var SimpleMathMLParser = require('simple_mml_parser');
  var ExpressionView = require('expression_view');


  var accumTranslate = function (element) {
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
  };



  var svgNS = 'http://www.w3.org/2000/svg';


  function correctBBox(svg) {
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

  function evalXmlNode(node) {
    var prev = parseFloat(node.prev().text());
    var op = node.text();
    var next = parseFloat(node.next().text());

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

    node.prev().text(result);
    node.next().remove();
    node.remove();
  }


  function addCircles(svg, originalXml, xml) {
    $(svg).find('.op').each(function () {
      var op = this;

      var translate = accumTranslate(op);
      var bbox = op.getBBox();
      var radius = 1.5 * Math.max(bbox.width, bbox.height) / 2;

      var node = $(xml).find('#' + op.id);
      if (node.text() === '\xD7') {
        radius = Math.max(bbox.width, bbox.height);
      }

      var circle = document.createElementNS(svgNS, 'circle');
      $(circle).attr({
        cx: translate.tx + bbox.width / 2 + bbox.x,
        cy: translate.ty + bbox.height / 2 + bbox.y,
        r: radius,
        fill: 'transparent',
        for: op.id
      }).hover(function () {
        var fill = $(this).attr('fill');

        if (fill === 'transparent') {
          $(this).attr({
            fill: 'rgba(0,255,0,0.5)'
          });
        } else {
          $(this).attr({
            fill: 'transparent'
          });
        }
      }).click(function () {
        $(op).trigger('my-event');
        // next line modelXML
        var xml = $(originalXml).clone().get(0);  // TODO: update IDs
        var node = $(xml).find('#' + $(this).attr('for'));

        if (node.is('mo') && node.prev().is('mn') && node.next().is('mn')) {
          evalXmlNode(node);
          removeUnnecessaryRows(xml);

          // TODO: extract closure into proper method
          addMath(xml).then(function (svg, view, originalXml) {
            addCircles(svg, originalXml, view.xml);
            addNumberHighlights(svg);
            correctBBox(svg);
          });
        }
      }).appendTo(svg.firstElementChild);
    });
  }

  function addNumberHighlights(svg) {
    $(svg).find('.num').each(function () {
      var translate = accumTranslate(this);
      var bbox = this.getBBox();

      var rect = document.createElementNS(svgNS, 'rect');
      var multipier = 29;
      var padding = multipier * 5;

      $(rect).attr({
        x: translate.tx + bbox.x - padding,
        y: translate.ty + bbox.y - padding,
        width: bbox.width + 2*padding,
        height: bbox.height + 2*padding,
        fill: 'transparent',
        for: this.id
      }).hover(function () {
        var fill = $(this).attr('fill');

        if (fill === 'transparent') {
          $(this).attr({
            fill: 'rgba(255,0,255,0.5)'
          });
        } else {
          $(this).attr({
            fill: 'transparent'
          });
        }
      }).appendTo(svg.firstElementChild);
    });
  }

  function addMath(originalXml) {
    var view = new ExpressionView(originalXml);

    view.fixNegativeNumbers();
    view.createFractions();
    view.formatDivision();
    view.removeUnnecessaryParentheses();
    view.removeUnnecessaryRows();

    var script = document.createElement('script');
    $(script).attr('type', 'math/mml').text(view.xml.outerHTML).appendTo(document.body);

    var deferred = $.Deferred();

    MathJax.Hub.Queue(
      ['Typeset', MathJax.Hub, script],
      function() {
        var svg = $('#' + script.id + '-Frame' + ' svg').get(0);
        deferred.resolve(svg, view, originalXml);
      }
    );

    return deferred.promise();
  }

  $('.op').on('my-event', function (e) {
    console.log('my-event, e = %o', e);
  });

  var parser = new SimpleMathMLParser();
  var xml1 = parser.parse('1 + 2/3 * 4/5 - 6 - 7');
  var xml2 = parser.parse('1 + 2 - 3 * 4 - 5 + 6');
  var xml3 = parser.parse('5 - 1 + 2 * (3 - 4)');


  addMath(xml3).then(function (svg, view, originalXml) {
    addCircles(svg, originalXml, view.xml);
    addNumberHighlights(svg);
    correctBBox(svg);
  });

  console.log(xml3);

});
