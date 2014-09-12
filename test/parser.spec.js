/**
 * Created by kevin on 2014-09-06.
 */

define(function (require) {

  var Parser = require('model/parser');
  var $ = require('jquery');

  describe('Parser', function () {

    var parser;

    beforeEach(function () {
      parser = new Parser();
    });

    describe('Expressions', function () {
      it('should parse simple expressions with +, - , *, /', function () {
        var xml = parser.parse('1 + 2 - 3 * 4 / 5');

        $(xml).find('*').removeAttr('class').removeAttr('id');

        var expectedXml = '<mrow><mn>1</mn><mo>+</mo><mn>2</mn><mo>-</mo><mrow><mn>3</mn><mo>*</mo><mn>4</mn><mo>/</mo><mn>5</mn></mrow></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse expressions with variables: a + b - c * d / e', function () {
        var xml = parser.parse('a + b - c * d / e');

        $(xml).find('*').removeAttr('class').removeAttr('id');

        var expectedXml = '<mrow><mi>a</mi><mo>+</mo><mi>b</mi><mo>-</mo><mrow><mi>c</mi><mo>*</mo><mi>d</mi><mo>/</mo><mi>e</mi></mrow></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse multi-factor terms as multiplication', function () {
        var xml = parser.parse('1 - 2xy');

        $(xml).find('*').removeAttr('class').removeAttr('id').removeAttr('display');

        var expectedXml = '<mrow><mn>1</mn><mo>-</mo><mrow><mn>2</mn><mo>*</mo><mi>x</mi><mo>*</mo><mi>y</mi></mrow></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse expressions with parentheses: 2*(x+1)', function () {
        var xml = parser.parse('2*(x+1)');

        $(xml).find('*').removeAttr('class').removeAttr('id').removeAttr('parens');

        var expectedXml = '<mrow><mn>2</mn><mo>*</mo><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse numbers and identifiers before parentheses as multiplication: 2(x+1)', function () {
        var xml = parser.parse('2(x+1)');

        $(xml).find('*').removeAttr('class').removeAttr('id').removeAttr('display');

        var expectedXml = '<mrow><mn>2</mn><mo>*</mo><mrow parens="true"><mi>x</mi><mo>+</mo><mn>1</mn></mrow></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse adjacent parentheses as multiplication: (x+1)(x-1)', function () {
        var xml = parser.parse('(x+1)(x-1)');

        $(xml).find('*').removeAttr('class').removeAttr('id').removeAttr('display').removeAttr('parens');

        var expectedXml = '<mrow><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow><mo>*</mo><mrow><mi>x</mi><mo>-</mo><mn>1</mn></mrow></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });
    });

    describe('Powers', function () {
      it('should parse powers with numeric exponents: x^3 + 2^4', function () {
        var xml = parser.parse('x^3+2^4');

        $(xml).find('*').removeAttr('class').removeAttr('id');

        var expectedXml = '<mrow><msup><mi>x</mi><mn>3</mn></msup><mo>+</mo><msup><mn>2</mn><mn>4</mn></msup></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse powers with variable exponents: x^y + 2^z', function () {
        var xml = parser.parse('x^y+2^z');

        $(xml).find('*').removeAttr('class').removeAttr('id');

        var expectedXml = '<mrow><msup><mi>x</mi><mi>y</mi></msup><mo>+</mo><msup><mn>2</mn><mi>z</mi></msup></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse powers with an expression as a base: (x+1)^2', function () {
        var xml = parser.parse('(x+1)^2');

        $(xml).find('*').removeAttr('class').removeAttr('id').removeAttr('parens');

        var expectedXml = '<mrow><msup><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow><mn>2</mn></msup></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      // TODO: update parser to handle case where the negative exponent isn't wrapped
      it('should parse expression with negative exponents', function () {
//        var xml = parser.parse('x^(-3)+2^-4');
        var xml = parser.parse('x^(-3)');

        $(xml).find('*').removeAttr('class').removeAttr('id').removeAttr('parens');

        var expectedXml = '<mrow><msup><mi>x</mi><mn>-3</mn></msup></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      // TODO: this should pass after we fix the negative exponent problem first
      it.skip('should parse an expression for the 2D Gaussian', function () {
        var xml = parser.parse('e^(-(x^2+y^2))');

        $(xml).find('*').removeAttr('class').removeAttr('id').removeAttr('parens');

        var expectedXml = '<mrow><msup><mi>e</mi><mrow><mo>-</mo><mrow></mrow><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><msup><mi>y</mi><mn>2</mn></msup></mrow></msup></mrow>'
        assert.equal(xml.innerHTML, expectedXml);
      });
    });
  });

});
