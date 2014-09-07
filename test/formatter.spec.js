/**
 * Created by kevin on 2014-09-06.
 */

define(function (require) {

  var Formatter = require('formatter');
  var Parser = require('parser');
  var $ = require('jquery');

  describe('Formatter', function () {
    var parser;

    beforeEach(function () {
      parser = new Parser();
    });

    describe('createFractions', function () {
      it('should create fractions for division of numbers', function () {
        var xml = parser.parse('12/-32');

        Formatter.createFractions(xml);
        var mrow = xml.firstElementChild;
        var mfrac = mrow.firstElementChild;

        assert($(mrow).is('mrow'));
        assert($(mfrac).is('mfrac'));
        assert($(mfrac).children().length === 2);

        var numerator = mfrac.firstElementChild;
        var denominator = mfrac.lastElementChild;

        assert($(numerator).is('mn'));
        assert.equal($(numerator).text(), '12');
        assert($(denominator).is('mn'));
        assert.equal($(denominator).text(), '-32');
      });

      it('should create fractions for division of variables numbers', function () {
        var xml = parser.parse('x/-y');

        Formatter.createFractions(xml);
        var mrow = xml.firstElementChild;
        var mfrac = mrow.firstElementChild;

        assert($(mrow).is('mrow'));
        assert($(mfrac).is('mfrac'));
        assert($(mfrac).children().length === 2);

        var numerator = mfrac.firstElementChild;
        var denominator = mfrac.lastElementChild;

        assert($(numerator).is('mi'));
        assert.equal($(numerator).text(), 'x');
        assert($(denominator).is('mi'));
        assert.equal($(denominator).text(), '-y');
      });

      it('should create fractions for division of expressions', function () {
        var xml = parser.parse('(x+12)/(-y-32)');

        Formatter.createFractions(xml);
        var mrow = xml.firstElementChild;
        var mfrac = mrow.firstElementChild;

        assert($(mrow).is('mrow'));
        assert($(mfrac).is('mfrac'));
        assert($(mfrac).children().length === 2);

        var numerator = mfrac.firstElementChild;
        var denominator = mfrac.lastElementChild;

        assert($(numerator).is('mrow'));
        assert($(denominator).is('mrow'));
      });
    });
  });

});
