/**
 * Created by kevin on 2014-09-06.
 */

define(function (require) {

  var Parser = require('parser');
  var $ = require('jquery');

  describe('Array', function(){
    describe('#indexOf()', function(){
      it('should return -1 when the value is not present', function(){
        assert.equal(-1, [1,2,3].indexOf(5));
        assert.equal(-1, [1,2,3].indexOf(0));
      });
    });
  });

  describe('Parser', function () {

    var parser;

    beforeEach(function () {
      parser = new Parser();
    });

    it('should parse simple expressions', function () {
      var result = parser.parse('1 + 2');
      assert($(result).is('math'), 'returns a <math> element');
      assert($(result).children().length === 1, 'contains a single child');
      assert($(result.firstElementChild).is('mrow'), 'only child is an <mrow> element');
    });

  });

});
