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

    describe('createFractions', function () {
      it('should create fractions for division of numbers', function () {
        var xml = parser.parse('-12/-32');
        Formatter.createFractions(xml);

        $(xml).find('*').removeAttr('class').removeAttr('id');

        var expectedXml = '<mrow><mfrac><mn>-12</mn><mn>-32</mn></mfrac></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should create multiple fractions for division separated by multiplication', function () {
        var xml = parser.parse('1/2*3/4');
        Formatter.createFractions(xml);

        $(xml).find('*').removeAttr('class').removeAttr('id');

        var expectedXml = '<mrow><mfrac><mn>1</mn><mn>2</mn></mfrac><mo>*</mo><mfrac><mn>3</mn><mn>4</mn></mfrac></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should create multiple fractions for division separated by addition', function () {
        var xml = parser.parse('1/2+3/4');
        Formatter.createFractions(xml);

        $(xml).find('*').removeAttr('class').removeAttr('id');

        // TODO: think about whether we need all those <mrow> elements
        var expectedXml = '<mrow><mrow><mfrac><mn>1</mn><mn>2</mn></mfrac></mrow><mo>+</mo><mrow><mfrac><mn>3</mn><mn>4</mn></mfrac></mrow></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should create fractions for division of variables numbers', function () {
        var xml = parser.parse('-x/-y');
        Formatter.createFractions(xml);

        $(xml).find('*').removeAttr('class').removeAttr('id');

        var expectedXml = '<mrow><mfrac><mi>-x</mi><mi>-y</mi></mfrac></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should create fractions for division of expressions', function () {
        var xml = parser.parse('(x+12)/(-y-32)');
        Formatter.createFractions(xml);

        $(xml).find('*').removeAttr('class').removeAttr('id').removeAttr('parens'); // only concerned with structure

        var expectedXml = '<mrow><mfrac><mrow><mi>x</mi><mo>+</mo><mn>12</mn></mrow><mrow><mi>-y</mi><mo>-</mo><mn>32</mn></mrow></mfrac></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      // TODO: re-enable after writing test for powers of expressions
      it.skip('should create fractions for divions of powers', function () {
        var xml = parser.parse('x^2/(x+1)^2');
        Formatter.createFractions(xml);

        $(xml).find('*').removeAttr('class').removeAttr('id').removeAttr('parens'); // only concerned with structure

        var expectedXml = '<mrow><mfrac><msup><mi>x</mi><mn>2</mn></msup><msup><mrow><mn>x</mn><mo>+</mo><mn>1</mn></mrow><mn>2</mn></msup></mfrac></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });
    });

    describe('formatArithmetic', function () {
      it.skip("needs to be written", function () {
        // TODO: write some tests
      });
    });

    describe('formatAlgebra', function () {
      it.skip("needs to be written", function () {
        // TODO: write some tests
      });
    });

  });
});
