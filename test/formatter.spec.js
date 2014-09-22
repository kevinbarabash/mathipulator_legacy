/**
 * Created by kevin on 2014-09-06.
 */

define(function (require) {

  var Formatter = require('view/formatter');
  var Parser = require('model/parser');
  var $ = require('jquery');

  describe('Formatter', function () {
    var parser;

    beforeEach(function () {
      parser = new Parser();
    });

    describe.skip('createFractions', function () {
      it('should create fractions for division of numbers', function () {
        var xml = parser.parse('-12/-32');
        Formatter.createFractions(xml);

        var expectedXml = '<mrow><mfrac><mn>-12</mn><mn>-32</mn></mfrac></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should create multiple fractions for division separated by multiplication', function () {
        var xml = parser.parse('1/2*3/4');
        Formatter.createFractions(xml);

        var expectedXml = '<mrow><mfrac><mn>1</mn><mn>2</mn></mfrac><mo>*</mo><mfrac><mn>3</mn><mn>4</mn></mfrac></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should create multiple fractions for division separated by addition', function () {
        var xml = parser.parse('1/2+3/4');
        Formatter.createFractions(xml);

        // TODO: think about whether we need all those <mrow> elements
        var expectedXml = '<mrow><mrow><mfrac><mn>1</mn><mn>2</mn></mfrac></mrow><mo>+</mo><mrow><mfrac><mn>3</mn><mn>4</mn></mfrac></mrow></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should create fractions for division of variables numbers', function () {
        var xml = parser.parse('-x/-y');
        Formatter.createFractions(xml);

        var expectedXml = '<mrow><mfrac><mi>-x</mi><mi>-y</mi></mfrac></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should create fractions for division of expressions', function () {
        var xml = parser.parse('(x+12)/(-y-32)');
        Formatter.createFractions(xml);

        $(xml).find('*').removeAttr('parens'); // only concerned with structure

        var expectedXml = '<mrow><mfrac><mrow><mi>x</mi><mo>+</mo><mn>12</mn></mrow><mrow><mi>-y</mi><mo>-</mo><mn>32</mn></mrow></mfrac></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      // TODO: re-enable after writing test for powers of expressions
      it.skip('should create fractions for divions of powers', function () {
        var xml = parser.parse('x^2/(x+1)^2');
        Formatter.createFractions(xml);

        $(xml).find('*').removeAttr('parens'); // only concerned with structure

        var expectedXml = '<mrow><mfrac><msup><mi>x</mi><mn>2</mn></msup><msup><mrow><mn>x</mn><mo>+</mo><mn>1</mn></mrow><mn>2</mn></msup></mfrac></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });
    });

    describe('formatArithmetic', function () {
      it('should add parentheses around a single negative number', function () {
        var xml = parser.parse('-2');
        Formatter.formatArithmetic(xml);
        $(xml).find('*').removeAttr('stretchy').removeAttr('class');
        var expectedXml = '<mo>(</mo><mrow><mo>\u2212</mo><mn>2</mn></mrow><mo>)</mo>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should add parentheses around negative numbers in an expression', function () {
        var xml = parser.parse('x + -2');
        Formatter.formatArithmetic(xml);
        $(xml).find('*').removeAttr('stretchy').removeAttr('class');
        var expectedXml = '<mrow><mi>x</mi><mo>+</mo><mo>(</mo><mrow><mo>\u2212</mo><mn>2</mn></mrow><mo>)</mo></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should add parentheses around a single negative variable', function () {
        var xml = parser.parse('-x');
        Formatter.formatArithmetic(xml);
        $(xml).find('*').removeAttr('stretchy').removeAttr('class');
        var expectedXml = '<mo>(</mo><mrow><mo>\u2212</mo><mi>x</mi></mrow><mo>)</mo>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should add parentheses around negative variables in an expression', function () {
        var xml = parser.parse('1 + -x');
        Formatter.formatArithmetic(xml);
        $(xml).find('*').removeAttr('stretchy').removeAttr('class');
        var expectedXml = '<mrow><mn>1</mn><mo>+</mo><mo>(</mo><mrow><mo>\u2212</mo><mi>x</mi></mrow><mo>)</mo></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      // TODO: need to fix this case
      it.skip('should parentheses around a negative term: 1 + -2x -> 1 + (-2x)', function () {
        var xml = parser.parse('1 + -2x');
        Formatter.formatArithmetic(xml);
        $(xml).find('*').removeAttr('class');
        var expectedXml = '<mrow><mn>1</mn><mo>+</mo><mo>(</mo><mrow><mo>\u2212</mo><mn>2</mn><mi>x</mi></mrow><mo>)</mo></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

    });

    describe('formatAlgebra', function () {
      // TODO: split this into fractions, powers, multiplication, etc.

      it('should add parentheses around negative numbers in an expression', function () {
        var xml = parser.parse('x + -2');
        Formatter.formatArithmetic(xml);
        $(xml).find('*').removeAttr('stretchy').removeAttr('class');
        var expectedXml = '<mrow><mi>x</mi><mo>+</mo><mo>(</mo><mrow><mo>\u2212</mo><mn>2</mn></mrow><mo>)</mo></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should add parentheses for multiplication of numbers', function () {
        var xml = parser.parse('2*3');
        Formatter.formatAlgebra(xml);
        $(xml).find('*').removeAttr('stretchy').removeAttr('class');
        var expectedXml = '<mrow><mo>(</mo><mn>2</mn><mo>)</mo><mo>(</mo><mn>3</mn><mo>)</mo></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('shouldn\'t add parentheses for multiplication of variables or numbers and variables', function () {
        var xml = parser.parse('x*y + 2*a*b*c');
        Formatter.formatAlgebra(xml);
        var expectedXml = '<mrow><mrow><mi>x</mi><mi>y</mi></mrow><mo>+</mo><mrow><mn>2</mn><mi>a</mi><mi>b</mi><mi>c</mi></mrow></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should remove the \'*\' and add parentheses for multiplication of a number and an expression', function () {
        var xml = parser.parse('2*(x+1)');
        Formatter.formatAlgebra(xml);
        $(xml).find('*').removeAttr('stretchy').removeAttr('class');
        var expectedXml = '<mrow><mn>2</mn><mo>(</mo><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should have unnecessary parentheses in a fraction', function () {
        var xml = parser.parse('1/(x+1)');
        Formatter.formatAlgebra(xml);
        var expectedXml = '<mfrac><mn>1</mn><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow></mfrac>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should format simple fractions without parentheses correctly', function () {
        var xml = parser.parse('1/2+-3/4');
        Formatter.formatAlgebra(xml);
        $(xml).find('*').removeAttr('stretchy').removeAttr('class');
        var expectedXml = '<mrow><mfrac><mn>1</mn><mn>2</mn></mfrac><mo>+</mo><mfrac><mrow><mo>-</mo><mn>3</mn></mrow><mn>4</mn></mfrac></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should format simple fractions with parentheses correctly', function () {
        var xml = parser.parse('(1/2)+(-3/4)');
        Formatter.formatAlgebra(xml);
        $(xml).find('*').removeAttr('stretchy').removeAttr('class');
        var expectedXml = '<mrow><mo>(</mo><mfrac><mn>1</mn><mn>2</mn></mfrac><mo>)</mo><mo>+</mo><mo>(</mo><mfrac><mrow><mo>-</mo><mn>3</mn></mrow><mn>4</mn></mfrac><mo>)</mo></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should add parentheses for multiplication of an expression and a number', function () {
        var xml = parser.parse('2*(x+1)');
        Formatter.formatAlgebra(xml);
        $(xml).find('*').removeAttr('stretchy').removeAttr('class');
        var expectedXml = '<mrow><mn>2</mn><mo>(</mo><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow>';
        // TODO: do we even need extra <mrow>s in the the view MathML as long as we have a mapping between the view elements and the model?
        assert.equal(xml.innerHTML, expectedXml);
      });
    });

  });
});
