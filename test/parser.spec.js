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

    describe('Numbers', function () {
      it('should create a single mn a positive number: 12 -> <mn>12</mn>', function () {
        var xml = parser.parse('12');
        var expectedXml = '<mn>12</mn>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should create a single mn a negative number: -12 -> <mn>-12</mn>', function () {
        var xml = parser.parse('-12');
        $(xml).find('*').removeAttr('class').removeAttr('id');
        var expectedXml = '<mn>-12</mn>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should create a single mn a decimal number: -1.23 -> <mn>-1.23</mn>', function () {
        var xml = parser.parse('-1.23');
        $(xml).find('*').removeAttr('class').removeAttr('id');
        var expectedXml = '<mn>-1.23</mn>';
        assert.equal(xml.innerHTML, expectedXml);
      });
    });

    describe('Variables', function () {
      it('should create a single mi a positive variable: x -> <mi>x</mi>', function () {
        var xml = parser.parse('x');
        $(xml).find('*').removeAttr('class').removeAttr('id');
        var expectedXml = '<mi>x</mi>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should create a single mi a negative variable: -x -> <mi>-x</mi>', function () {
        var xml = parser.parse('-x');
        $(xml).find('*').removeAttr('class').removeAttr('id');
        var expectedXml = '<mi>-x</mi>';
        assert.equal(xml.innerHTML, expectedXml);
      });
    });

    describe('Expressions', function () {
      it('should parse simple expressions with +, - , *, /', function () {
        var xml = parser.parse('1 + 2 - 3 * 4 / 5');

        var expectedXml = '<mrow><mn>1</mn><mo>+</mo><mn>2</mn><mo>-</mo><mrow><mn>3</mn><mo>*</mo><mn>4</mn><mo>/</mo><mn>5</mn></mrow></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse expressions with variables: a + b - c * d / e', function () {
        var xml = parser.parse('a + b - c * d / e');

        var expectedXml = '<mrow><mi>a</mi><mo>+</mo><mi>b</mi><mo>-</mo><mrow><mi>c</mi><mo>*</mo><mi>d</mi><mo>/</mo><mi>e</mi></mrow></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse multi-factor terms as multiplication', function () {
        var xml = parser.parse('1 - 2xy');

        $(xml).find('*').removeAttr('display');

        var expectedXml = '<mrow><mn>1</mn><mo>-</mo><mrow><mn>2</mn><mo>*</mo><mi>x</mi><mo>*</mo><mi>y</mi></mrow></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse expressions with parentheses: 2*(x+1)', function () {
        var xml = parser.parse('2*(x+1)');

        $(xml).find('*').removeAttr('parens');

        var expectedXml = '<mrow><mn>2</mn><mo>*</mo><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse numbers and identifiers before parentheses as multiplication: 2(x+1)', function () {
        var xml = parser.parse('2(x+1)');

        $(xml).find('*').removeAttr('display');

        var expectedXml = '<mrow><mn>2</mn><mo>*</mo><mrow parens="true"><mi>x</mi><mo>+</mo><mn>1</mn></mrow></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse adjacent parentheses as multiplication: (x+1)(x-1)', function () {
        var xml = parser.parse('(x+1)(x-1)');

        $(xml).find('*').removeAttr('display').removeAttr('parens');

        var expectedXml = '<mrow><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow><mo>*</mo><mrow><mi>x</mi><mo>-</mo><mn>1</mn></mrow></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      // TODO: fix the code to handle this case then re-enable test
      it.skip('should parse unary minus: -(x+1)', function () {
        var xml = parser.parse('-(x+1)');

        $(xml).find('*').removeAttr('display').removeAttr('parens');

        var expectedXml = '<mrow></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });
    });

    describe('Powers', function () {
      it('should parse a single power as an msup: x^2 -> <msup><mi>x</mi><mn>2</mn></msup>', function () {
        var xml = parser.parse('x^2');
        $(xml).find('*').removeAttr('class').removeAttr('id');
        var expectedXml = '<msup><mi>x</mi><mn>2</mn></msup>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse powers with numeric exponents: x^3 + 2^4', function () {
        var xml = parser.parse('x^3+2^4');

        var expectedXml = '<mrow><msup><mi>x</mi><mn>3</mn></msup><mo>+</mo><msup><mn>2</mn><mn>4</mn></msup></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse powers with variable exponents: x^y + 2^z', function () {
        var xml = parser.parse('x^y+2^z');

        var expectedXml = '<mrow><msup><mi>x</mi><mi>y</mi></msup><mo>+</mo><msup><mn>2</mn><mi>z</mi></msup></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse powers with an expression as a base: (x+1)^2', function () {
        var xml = parser.parse('(x+1)^2');

        $(xml).find('*').removeAttr('parens');

        var expectedXml = '<msup><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow><mn>2</mn></msup>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse expression with negative exponents', function () {
        var xml = parser.parse('x^(-3)+2^-4');

        $(xml).find('*').removeAttr('parens');

        var expectedXml = '<mrow><msup><mi>x</mi><mn>-3</mn></msup><mo>+</mo><msup><mn>2</mn><mn>-4</mn></msup></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse powers of powers with numbers: x^2^2', function () {
        var xml = parser.parse('x^2^2');

        $(xml).find('*').removeAttr('parens');

        var expectedXml = '<msup><mi>x</mi><msup><mn>2</mn><mn>2</mn></msup></msup>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse powers of powers with expressions: (x+1)^(x+1)^(x+1)', function () {
        var xml = parser.parse('(x+1)^(x+1)^(x+1)');

        $(xml).find('*').removeAttr('parens');

        var expectedXml = '<msup><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow><msup><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow></msup></msup>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should parse fractional exponents: 440^(2/12)', function () {
        var xml = parser.parse('440^(2/12)');

        $(xml).find('*').removeAttr('parens');

        var expectedXml = '<msup><mn>440</mn><mrow><mn>2</mn><mo>/</mo><mn>12</mn></mrow></msup>';  // doesn't use mfrac
        assert.equal(xml.innerHTML, expectedXml);
      });

      // TODO: this should work after we figure out what to do with unary minuses infront of expression in parentheses
      it.skip('should parse an expression for the 2D Gaussian', function () {
        var xml = parser.parse('e^(-(x^2+y^2))');

        $(xml).find('*').removeAttr('parens');

        var expectedXml = '<msup><mi>e</mi><mrow><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><msup><mi>y</mi><mn>2</mn></msup></mrow></msup>'
        assert.equal(xml.innerHTML, expectedXml);
      });
    });

    describe('Parentheses', function () {
      it('should add parens="true" attribute if there are parentheses', function () {
        var xml = parser.parse('(x+1)');
        var expectedXml = '<mrow parens="true"><mi>x</mi><mo>+</mo><mn>1</mn></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should not add parens="true" for sub-expression: 1 + 2 * 3', function () {
        var xml = parser.parse('1+2*3');
        var expectedXml = '<mrow><mn>1</mn><mo>+</mo><mrow><mn>2</mn><mo>*</mo><mn>3</mn></mrow></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });
    });

  });
});
