/**
 * Created by kevin on 2014-09-11.
 */

define(function (require) {

  var Commute = require('model/transform/commute');
  var Parser = require('model/parser');
  var $ = require('jquery');
  require('jquery_extensions');

  describe('Commute', function () {
    var parser;

    beforeEach(function () {
      parser = new Parser();
    });

    it('should commute simple addition: a + b -> b + a', function () {
      var xml = parser.parse('a + b');
      var node = $(xml).findOp('+').get(0);
      Commute.transform(node);

      $(xml).find('*').removeAttr('class').removeAttr('id');

      var expecteXml = '<mrow><mi>b</mi><mo>+</mo><mi>a</mi></mrow>';
      assert.equal(xml.innerHTML, expecteXml);
    });

    it('should commute addition before subtraction: a + b - c -> b + a - c', function () {
      var xml = parser.parse('a + b - c');
      var node = $(xml).findOp('+').get(0);
      Commute.transform(node);

      $(xml).find('*').removeAttr('class').removeAttr('id');

      var expecteXml = '<mrow><mi>b</mi><mo>+</mo><mi>a</mi><mo>-</mo><mi>c</mi></mrow>';
      assert.equal(xml.innerHTML, expecteXml);
    });

    it('should not commute addition after subtraction', function () {
      var xml = parser.parse('1 - 2 + 3');
      var node = $(xml).findOp('+').get(0);

      assert(!Commute.canTransform(node));
    });

    it('should not commute subtraction', function () {
      var xml = parser.parse('1 - 2');
      var node = $(xml).findOp('-').get(0);

      assert(!Commute.canTransform(node));
    });

    // TODO: we need other tests like this that check a sequence of operations, much like the manual testing I do right now
    it('should commute the resulting addition of a commute', function () {
      var node, xml;

      xml = parser.parse('a + b + c');
      node = $(xml).findOp('+').get(0);
      Commute.transform(node);       // a + b + c -> b + a + c
      node = $(xml).findOp('+').get(1);
      Commute.transform(node);       // b + a + c -> b + c + a
      node = $(xml).findOp('+').get(0);
      Commute.transform(node);       // b + c + a -> c + b + a

      $(xml).find('*').removeAttr('class').removeAttr('id');

      var expecteXml = '<mrow><mi>c</mi><mo>+</mo><mi>b</mi><mo>+</mo><mi>a</mi></mrow>';
      assert.equal(xml.innerHTML, expecteXml);
    });

    it('should commute simple multiplication: a * b -> b * a', function () {
      var xml = parser.parse('a * b');
      var node = $(xml).findOp('*').get(0);
      Commute.transform(node);

      $(xml).find('*').removeAttr('class').removeAttr('id');

      var expecteXml = '<mrow><mi>b</mi><mo>*</mo><mi>a</mi></mrow>';
      assert.equal(xml.innerHTML, expecteXml);
    });

    it('should commute multiplication before division: a * b / c -> b * a / c', function () {
      var xml = parser.parse('a * b / c');
      var node = $(xml).findOp('*').get(0);
      Commute.transform(node);

      $(xml).find('*').removeAttr('class').removeAttr('id');

      var expecteXml = '<mrow><mi>b</mi><mo>*</mo><mi>a</mi><mo>/</mo><mi>c</mi></mrow>';
      assert.equal(xml.innerHTML, expecteXml);
    });

    it('should not commute multiplication after division', function () {
      var xml = parser.parse('1 / 2 * 3');
      var node = $(xml).findOp('*').get(0);

      assert(!Commute.canTransform(node));
    });

    it('should not commute division', function () {
      var xml = parser.parse('1 / 2');
      var node = $(xml).findOp('/').get(0);

      assert(!Commute.canTransform(node));
    });

    it('should commute the resulting multiplication of a commute', function () {
      var node, xml;

      xml = parser.parse('a * b * c');
      node = $(xml).findOp('*').get(0);
      Commute.transform(node);       // a * b * c -> b * a * c
      node = $(xml).findOp('*').get(1);
      Commute.transform(node);       // b * a * c -> b * c * a
      node = $(xml).findOp('*').get(0);
      Commute.transform(node);       // b * c * a -> c * b * a

      $(xml).find('*').removeAttr('class').removeAttr('id');

      var expecteXml = '<mrow><mi>c</mi><mo>*</mo><mi>b</mi><mo>*</mo><mi>a</mi></mrow>';
      assert.equal(xml.innerHTML, expecteXml);
    });
  });

});
