/**
 * Created by kevin on 2014-09-11.
 */

define(function (require) {

  var Evaluate = require('model/transform/evaluate');
  var Parser = require('model/parser');
  var $ = require('jquery');
  require('jquery_extensions');

  describe('Evaluate', function () {
    var parser;

    beforeEach(function () {
      parser = new Parser();
    });

    describe('addition/subtraction', function () {
      it('should evaluate addition: 1 + 2 - 3 -> 3 - 3', function () {
        var xml = parser.parse('1 + 2 - 3');
        var node = $(xml).findOp('+').get(0);
        Evaluate.transform(node);

        // sanitize
        $(xml).find('*').removeAttr('class').removeAttr('id');

        var expectedXml = '<mrow><mn>3</mn><mo>-</mo><mn>3</mn></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should evaluate subtraction: 1 + 2 - 3 -> 1 - (-1)', function () {
        var xml = parser.parse('1 + 2 - 3');
        var node = $(xml).findOp('-').get(0);
        Evaluate.transform(node);

        // sanitize
        $(xml).find('*').removeAttr('class').removeAttr('id');

        var expectedXml = '<mrow><mn>1</mn><mo>+</mo><mn>-1</mn></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should not evaluate addition occuring after another subtraction: 1 - 2 + 3 -> 1 - 2 + 3', function () {
        var xml = parser.parse('1 - 2 + 3');
        var node = $(xml).findOp('+').get(0);
        assert(!Evaluate.canTransform(node));
      });

      it('should not evaluate subtraction occuring after another subtraction: 1 - 2 - 3 -> 1 - 2 - 3', function () {
        var xml = parser.parse('1 - 2 - 3');
        var node = $(xml).findOp('-').get(1);
        assert(!Evaluate.canTransform(node));
      });
    });

    describe('multiplication/division', function () {
      it('should evaluate multiplication: 1 * 2 / 3 -> 2 / 3', function () {
        var xml = parser.parse('1 * 2 / 3');
        var node = $(xml).findOp('*').get(0);
        Evaluate.transform(node);

        // sanitize
        $(xml).find('*').removeAttr('class').removeAttr('id');

        var expectedXml = "<mrow><mn>2</mn><mo>/</mo><mn>3</mn></mrow>";
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should evaluate division: 1 * 2 / 3 -> 1 * 0.6666666666', function () {
        var xml = parser.parse('1 * 2 / 3');
        var node = $(xml).findOp('/').get(0);
        Evaluate.transform(node);

        // sanitize
        $(xml).find('*').removeAttr('class').removeAttr('id');

        var expectedXml = '<mrow><mn>1</mn><mo>*</mo><mn>' + (2/3) + '</mn></mrow>';
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should not evaluate multiplication occuring after division', function () {
        var xml = parser.parse('1 / 2 * 3');
        var node = $(xml).findOp('*').get(1);
        assert(!Evaluate.canTransform(node));
      });

      it('should not evaluate division occuring after division', function () {
        var xml = parser.parse('1 / 2 / 3');
        var node = $(xml).findOp('/').get(1);
        assert(!Evaluate.canTransform(node));
      });
    });

    describe('addition with multiplication', function () {
      it('should evaluate the first addition: 1 + 2 + 3 * 4 -> 3 + 3 * 4', function () {
        var xml = parser.parse('1 + 2 + 3 * 4');
        var node = $(xml).findOp('+').get(0);
        Evaluate.transform(node);

        // sanitize
        $(xml).find('*').removeAttr('class').removeAttr('id');

        var expectedXml = "<mrow><mn>3</mn><mo>+</mo><mrow><mn>3</mn><mo>*</mo><mn>4</mn></mrow></mrow>";
        assert.equal(xml.innerHTML, expectedXml);
      });

      it('should not evaluate the second addition because the multiplication takes precedence: 1 + 2 + 3 * 4 -> 1 + 2 + 3 * 4', function () {
        var xml = parser.parse('1 + 2 + 3 * 4');
        var node = $(xml).findOp('+').get(1);
        assert(!Evaluate.canTransform(node));
      });
    });
  });

});
