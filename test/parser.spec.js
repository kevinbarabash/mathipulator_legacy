/**
 * Created by kevin on 2014-09-06.
 */

define(function (require) {

  var Parser = require('parser');
  var $ = require('jquery');

  describe('Parser', function () {

    var parser;

    beforeEach(function () {
      parser = new Parser();
    });

    describe('Expressions', function () {
      it('should parse simple expressions with +, - , *, /', function () {
        var result = parser.parse('1 + 2 - 3 / 4');
        assert($(result).is('math'), 'returns a <math> element');
        assert($(result).children().length === 1, 'contains a single child');
        assert($(result.firstElementChild).is('mrow'), 'only child is an <mrow> element');
      });

      it('should parse expressions with variables', function () {

      });

      it('should parse expressions with parentheses', function () {

      });
    });

    describe('Exponents', function () {
      it('should parse expression with positive exponents', function () {
        var result = parser.parse('x^3+2^4');

        var exponents = $(result).find('msup');

        assert.equal(exponents.length, 2, 'the expression has two exponents');

        assert.equal($(exponents[0]).children().length, 2, 'msup needs two children');
        assert($(exponents[0].firstElementChild).is('mi'));
        assert.equal($(exponents[0].firstElementChild).text(), 'x');
        assert($(exponents[0].lastElementChild).is('mn'));
        assert.equal($(exponents[0].lastElementChild).text(), '3');

        assert.equal($(exponents[1]).children().length, 2, 'msup needs two children');
        assert($(exponents[1].firstElementChild).is('mn'));
        assert.equal($(exponents[1].firstElementChild).text(), '2');
        assert($(exponents[1].lastElementChild).is('mn'));
        assert.equal($(exponents[1].lastElementChild).text(), '4');
      });

      it.skip('should parse expression with negative exponents', function () {
        // TODO: update parser to handle case where the negative exponent isn't wrapped
        var result = parser.parse('x^(-3)+2^-4');

        var exponents = $(result).find('msup');

        assert.equal(exponents.length, 2, 'the expression has two exponents');

        assert.equal($(exponents[0]).children().length, 2, 'msup needs two children');
        assert($(exponents[0].firstElementChild).is('mi'));
        assert.equal($(exponents[0].firstElementChild).text(), 'x');
        assert($(exponents[0].lastElementChild).is('mn'));
        assert.equal($(exponents[0].lastElementChild).text(), '-3');

        assert.equal($(exponents[1]).children().length, 2, 'msup needs two children');
        assert($(exponents[1].firstElementChild).is('mn'));
        assert.equal($(exponents[1].firstElementChild).text(), '2');
        assert($(exponents[1].lastElementChild).is('mn'));
        assert.equal($(exponents[1].lastElementChild).text(), '-4');
      });

      it('should parse an expression for the 2D Gaussian', function () {
        var result = parser.parse('e^(-(x^2+y^2))');

        assert($(result.firstElementChild).is('msup'), 'root is an <msup>');

        var exponents = $(result).find('msup');

        assert($(exponents[0].firstElementChild).is('mi'));
        assert.equal($(exponents[0].firstElementChild).text(), 'e');
        assert($(exponents[0].lastElementChild).is('mrow'));

        assert($(exponents[1].firstElementChild).is('mi'));
        assert.equal($(exponents[1].firstElementChild).text(), 'x');
        assert($(exponents[1].lastElementChild).is('mn'));
        assert.equal($(exponents[1].lastElementChild).text(), '2');

        assert($(exponents[2].firstElementChild).is('mi'));
        assert.equal($(exponents[2].firstElementChild).text(), 'y');
        assert($(exponents[2].lastElementChild).is('mn'));
        assert.equal($(exponents[2].lastElementChild).text(), '2');
      });
    });
  });

});
