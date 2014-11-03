/**
 * Created by kevin on 2014-09-12.
 */

define(function (require) {

  var DistributeForwards = require('model/transform/distribute_forwards');
  var DistributeBackwards = require('model/transform/distribute_backwards');
  var Parser = require('model/parser');
  var $ = require('jquery');

  require('jquery_extensions');

  describe('Distribute', function () {
    var parser;

    beforeEach(function () {
      parser = new Parser();
    });

    describe('forwards', function () {
      it('should distribute across addition: a(b+c) -> ab + bc', function () {
        var xml = parser.parse('a(b+c)');
        var node = $(xml).findVar('a').get(0);
        DistributeForwards.transform(node);

        $(xml).find('*').removeAttr('class').removeAttr('id');

        var expecteXml = '<mrow><mrow><mi>a</mi><mo>*</mo><mi>b</mi></mrow><mo>+</mo><mrow><mi>a</mi><mo>*</mo><mi>c</mi></mrow></mrow>';
        assert.equal(xml.innerHTML, expecteXml);
      });

      it('should remove extra mrow if parent has add-ops across: 1 + a(b+c) -> 1 + ab + bc', function () {
        var xml = parser.parse('1+a(b+c)');
        var node = $(xml).findVar('a').get(0);
        DistributeForwards.transform(node);

        $(xml).find('*').removeAttr('class').removeAttr('id');

        var expecteXml = '<mrow><mn>1</mn><mo>+</mo><mrow><mi>a</mi><mo>*</mo><mi>b</mi></mrow><mo>+</mo><mrow><mi>a</mi><mo>*</mo><mi>c</mi></mrow></mrow>';
        assert.equal(xml.innerHTML, expecteXml);
      });
    });

    describe('backwards', function () {
      it('should distribute across addition: (b+c)a -> ba + ca', function () {
        var xml = parser.parse('(b+c)*a');
        var node = $(xml).findVar('a').get(0);
        DistributeBackwards.transform(node);

        $(xml).find('*').removeAttr('class').removeAttr('id');

        var expecteXml = '<mrow><mrow><mi>b</mi><mo>*</mo><mi>a</mi></mrow><mo>+</mo><mrow><mi>c</mi><mo>*</mo><mi>a</mi></mrow></mrow>';
        assert.equal(xml.innerHTML, expecteXml);
      });

      it('should remove extra mrow if parent has add-ops across: (b+c)*a + 1 -> ba + ca + 1', function () {
        var xml = parser.parse('(b+c)*a+1');
        var node = $(xml).findVar('a').get(0);
        DistributeBackwards.transform(node);

        $(xml).find('*').removeAttr('class').removeAttr('id');

        var expecteXml = '<mrow><mrow><mi>b</mi><mo>*</mo><mi>a</mi></mrow><mo>+</mo><mrow><mi>c</mi><mo>*</mo><mi>a</mi></mrow><mo>+</mo><mn>1</mn></mrow>';
        assert.equal(xml.innerHTML, expecteXml);
      });
    });
  });
});
