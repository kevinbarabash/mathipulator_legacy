/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {

  // TODO: add options parameter
  // TODO: create factory methods for specific sets of options
  // TODO: once options have been element, santize xml on creation
  function ExpressionView(xml) {
    this.xml = $(xml).clone().get(0);
  }

  // private function
  function fixNegativeNumbers(node) {
    $(node).children().each(function () {
      if (this.tagName === 'MN') {
        var num = this.textContent;
        if (num.indexOf('-') !== -1) {
          num = -parseFloat(num);
          $(this).replaceWith('<mrow class="num"><mo stretchy="false">(</mo><mo>-</mo><mn>' + num + '</mn><mo stretchy="false">)</mo></mrow>');
        }
      }
      fixNegativeNumbers(this);
    });
  }

  ExpressionView.prototype.fixNegativeNumbers = function() {
    fixNegativeNumbers(this.xml);
  };

  // private function
  function createFractions(elem) {
    $(elem).children().each(function () {
      if (this.tagName === 'MO') {
        if ($(this).text() === '/') {
          var frac = $('<mfrac>').append($(this).prev(), $(this).next());
          $(this).replaceWith(frac);
          stretchyFalse(frac);
        }
      }
      createFractions(this);
    });
  }

  ExpressionView.prototype.createFractions = function () {
    createFractions(this.xml);
  };

  // private function
  function formatDivison(elem) {
    $(elem).children().each(function () {
      if (this.tagName === 'MO') {
        // TODO: create a dictionary for these magic values
        if ($(this).text() === '/') {
          $(this).text('\xF7');
        }
        if ($(this).text() === '*') {
          $(this).text('\xD7');
        }
        if ($(this).text() === '-') {
          $(this).text('\u2212');
        }
      }
      formatDivison(this);
    });
  }

  ExpressionView.prototype.formatDivision = function () {
    formatDivison(this.xml);
  };

  // private function
  // TODO: add a separate function to remove parentheses from denominators
  function removeUnnecessaryParentheses(elem) {
    $(elem).children().each(function () {
      var children = $(this).children();
      if (children.length === 3) {
        if (children[0].tagName === 'MO' && $(children[0]).text() === '(' &&
          children[2].tagName === 'MO' && $(children[2]).text() === ')' &&
          children[1].tagName === 'MROW' && $(children[1]).children().length === 1) {
          $(children[0]).remove();
          $(children[2]).remove();
        }
      }
      removeUnnecessaryParentheses(this);
    });
  }

  ExpressionView.prototype.removeUnnecessaryParentheses = function () {
    removeUnnecessaryParentheses(this.xml);
  };

  // private function
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

  ExpressionView.prototype.removeUnnecessaryRows = function () {
    removeUnnecessaryRows(this.xml);
  };

  function stretchyFalse(elem) {
    $(elem).children().each(function () {
      if (this.tagName === 'MO') {
        var text = $(this).text();
        if (text === '(' || text === ')') {
          $(this).attr('stretchy', 'false');
        }
      }
      stretchyFalse(this);
    });
  }

  ExpressionView.prototype.sanitize = function () {
    this.fixNegativeNumbers();
    this.createFractions();
    this.formatDivision();
    this.removeUnnecessaryParentheses();
    this.removeUnnecessaryRows();
  };

  var svgNS = 'http://www.w3.org/2000/svg';

  ExpressionView.prototype.addCircles = function (svg) {
    var view = this;

    $(svg).find('.op').each(function () {
      var op = this;

      var translate = accumTranslate(op);
      var bbox = op.getBBox();
      var radius = 1.5 * Math.max(bbox.width, bbox.height) / 2;

      var node = $(view.xml).find('#' + op.id);
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
        $(view).trigger('my-event', $(this).attr('for'));
      }).appendTo(svg.firstElementChild);
    });
  };

  ExpressionView.prototype.addNumberHighlights = function (svg) {
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
  };

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

  ExpressionView.prototype.render = function () {
    var script = document.createElement('script');
    $(script).attr('type', 'math/mml').text(this.xml.outerHTML).appendTo(document.body);

    var deferred = $.Deferred();

    MathJax.Hub.Queue(['Typeset', MathJax.Hub, script], function () {
      var svg = $('#' + script.id + '-Frame' + ' svg').get(0);
      ExpressionView.correctBBox(svg);
      deferred.resolve(svg);
    });

    return deferred;
  };

  ExpressionView.correctBBox = function (svg) {
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
  };

  return ExpressionView;
});
