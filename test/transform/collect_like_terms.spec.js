/**
 * Created by kevin on 2014-11-03.
 */

define(function (require) {

  var CollectLikeTerms = require('transform/collect_like_terms');
  var Parser = require('math/parser');
  var $ = require('jquery');
  require('jquery_extensions');

  describe('Collect Like Terms', function () {
    var parser;

    beforeEach(function () {
      parser = new Parser();
    });

    it('should work on addition: 2x + 3x -> 5x', function () {
      var xml = parser.parse('2x + 3x');
      var node = $(xml).findOp('+').get(0);
      CollectLikeTerms.transform(node);

      $(xml).find('*').removeAttr('class').removeAttr('id');

      var expecteXml = '<mrow><mn>5</mn><mo>*</mo><mi>x</mi></mrow>';
      assert.equal(xml.innerHTML, expecteXml);
    });

    it('should work in expressions with other add-ops: 1 + 2x + 3x -> 1 + 5x', function () {
      var xml = parser.parse('1 + 2x + 3x');
      var node = $(xml).findOp('+').get(1);
      CollectLikeTerms.transform(node);

      $(xml).find('*').removeAttr('class').removeAttr('id');

      var expecteXml = '<mrow><mn>1</mn><mo>+</mo><mrow><mn>5</mn><mo>*</mo><mi>x</mi></mrow></mrow>';
      assert.equal(xml.innerHTML, expecteXml);
    });

    it('should work on subtraction: 2x - 3x -> -x', function () {
      var xml = parser.parse('2x - 3x');
      var node = $(xml).findOp('-').get(0);
      CollectLikeTerms.transform(node);

      $(xml).find('*').removeAttr('class').removeAttr('id');

      var expecteXml = '<mrow><mn>-1</mn><mo>*</mo><mi>x</mi></mrow>';
      assert.equal(xml.innerHTML, expecteXml);
    });

    it("should work on variables without coefficients: y + y -> 2y", function () {
      var xml = parser.parse('y + y');
      var node = $(xml).findOp('+').get(0);
      CollectLikeTerms.transform(node);

      $(xml).find('*').removeAttr('class').removeAttr('id');

      var expecteXml = '<mrow><mn>2</mn><mo>*</mo><mi>y</mi></mrow>';
      assert.equal(xml.innerHTML, expecteXml);
    });

    it("should work with terms that have multiple variable factors: 2xy + 3xy -> 5xy", function () {
      var xml = parser.parse('2xy + 3xy');
      var node = $(xml).findOp('+').get(0);
      CollectLikeTerms.transform(node);

      $(xml).find('*').removeAttr('class').removeAttr('id');

      var expecteXml = '<mrow><mn>5</mn><mo>*</mo><mi>x</mi><mo>*</mo><mi>y</mi></mrow>';
      assert.equal(xml.innerHTML, expecteXml);
    });

    it.skip("should work with terms who's coefficients match but aren't in the same order", function () {
      // TODO: write this test
    });
  });
});
