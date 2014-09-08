/**
 * Created by kevin on 2014-09-06.
 */

define(function (require) {

  var ExpressionModel = require('expression_model');
  var $ = require('jquery');

  require('jquery_extensions');

  describe('ExpressionModel', function () {
    describe('fromASCII', function () {
      it.skip('needs to be written', function () {

      });
    });

    describe('evaluateNode', function () {
      var model;

      describe('addition/subtraction: 1 + 2 - 3 - 4', function () {
        beforeEach(function () {
          model = ExpressionModel.fromASCII('1 + 2 - 3 - 4');
        });

        it('should evaluate addition', function () {
          var id = $(model.xml).findOp('+').attr('id');
          var result = model.evaluateNode(id);
          var mrow = result.xml.firstElementChild;

          assert($(mrow).is('mrow'));
          assert.equal($(mrow).children().length, 5);

          var children = $(mrow).children();

          assert($(children[0]).is('mn'));
          assert.equal($(children[0]).text(), '3');

          assert($(children[1]).is('mo'));
          assert.equal($(children[1]).text(), '-');

          assert($(children[2]).is('mn'));
          assert.equal($(children[2]).text(), '3');
        });

        it('should evaluate subtraction', function () {
          var id = $(model.xml).findOp('-').attr('id');
          var result = model.evaluateNode(id);
          var mrow = result.xml.firstElementChild;

          assert($(mrow).is('mrow'));
          assert.equal($(mrow).children().length, 5);

          var children = $(mrow).children();

          assert($(children[0]).is('mn'));
          assert.equal($(children[0]).text(), '1');

          assert($(children[1]).is('mo'));
          assert.equal($(children[1]).text(), '+');

          assert($(children[2]).is('mn'));
          assert.equal($(children[2]).text(), '-1');
        });

        // TODO: should also test the case where 1 - 2 + 3 and the user tries to evaluate '+'
        // TODO: figure out how to handle tests which throw
        it.skip('should not evaluate subtraction when respecting order-of-operations', function () {
          var secondSub = $(model.xml).findOp('-').get(1);
          var id = $(secondSub).attr('id');

          var mrow = model.xml.firstElementChild;

          assert($(mrow).is('mrow'));
          assert.equal($(mrow).children().length, 7, 'the are 7 tokens in the expression');

          var result = model.evaluateNode(id);
          mrow = result.xml.firstElementChild;

          assert($(mrow).is('mrow'));
          assert.equal($(mrow).children().length, 7, 'expression should be unchanged with 7 tokens');
        });
      });

      describe('multiplication/division: 1 * 2 / 3 / 4', function () {
        beforeEach(function () {
          model = ExpressionModel.fromASCII('1 * 2 / 3 / 4');
        });

        it('should evaluate multiplication', function () {
          var id = $(model.xml).findOp('*').attr('id');
          var result = model.evaluateNode(id);
          var mrow = result.xml.firstElementChild;

          assert($(mrow).is('mrow'));
          assert.equal($(mrow).children().length, 5);

          var children = $(mrow).children();

          assert($(children[0]).is('mn'));
          assert.equal($(children[0]).text(), '2');

          assert($(children[1]).is('mo'));
          assert.equal($(children[1]).text(), '/');

          assert($(children[2]).is('mn'));
          assert.equal($(children[2]).text(), '3');
        });

        it('should evaluate division', function () {
          var id = $(model.xml).findOp('/').attr('id');
          var result = model.evaluateNode(id);
          var mrow = result.xml.firstElementChild;

          assert($(mrow).is('mrow'));
          assert.equal($(mrow).children().length, 5);

          var children = $(mrow).children();

          assert($(children[0]).is('mn'));
          assert.equal($(children[0]).text(), 1);

          assert($(children[1]).is('mo'));
          assert.equal($(children[1]).text(), '*');

          assert($(children[2]).is('mn'));
          assert.equal($(children[2]).text(), 2/3);
        });

        // TODO: should also test the case where 1 / 2 * 3 and the user tries to evaluate '*'
        // TODO: fix when I figure out how to deal with testing code that throws exceptions
        it.skip('should not evaluate division when respecting order-of-operations', function () {
          var secondDiv = $(model.xml).findOp('/').get(1);
          var id = $(secondDiv).attr('id');

          var mrow = model.xml.firstElementChild;

          assert($(mrow).is('mrow'));
          assert.equal($(mrow).children().length, 7, 'the are 7 tokens in the expression');

          var result = model.evaluateNode(id);
          mrow = result.xml.firstElementChild;

          assert($(mrow).is('mrow'));
          assert.equal($(mrow).children().length, 7, 'expression should be unchanged with 7 tokens');
        });
      });

      describe('addition with multiplication: 1 + 2 + 3 * 4', function () {
        beforeEach(function () {
          model = ExpressionModel.fromASCII('1 + 2 + 3 * 4');
        });

        it('should evaluate the first addition', function () {
          var firstAddition = $(model.xml).findOp('+').get(0);
          var id = $(firstAddition).attr('id');

          var result = model.evaluateNode(id);
          var mrow = result.xml.firstElementChild;

          assert($(mrow).is('mrow'));
          assert.equal($(mrow).children().length, 3);

          var children = $(mrow).children();

          assert($(children[0]).is('mn'));
          assert.equal($(children[0]).text(), '3');

          assert($(children[1]).is('mo'));
          assert.equal($(children[1]).text(), '+');

          assert($(children[2]).is('mrow'));  // <mrow><mn>3</mn><mo>*</mo><mn>4</mn></mrow>
        });

        // TODO: fix when I know what to do with test that throw exceptions
        it.skip('should not evaluate the second addition because the multiplication takes precedence', function () {
          var secondAddition = $(model.xml).findOp('+').get(1);
          var id = $(secondAddition).attr('id');

          var result = model.evaluateNode(id);
          var mrow = result.xml.firstElementChild;

          assert($(mrow).is('mrow'));
          assert.equal($(mrow).children().length, 7);

          var children = $(mrow).children();

          assert($(children[0]).is('mn'));
          assert.equal($(children[0]).text(), '1');

          assert($(children[1]).is('mo'));
          assert.equal($(children[1]).text(), '+');

          assert($(children[2]).is('mn'));
          assert.equal($(children[2]).text(), '2');
        });
      });
    });

    describe('clone', function () {
      it.skip('needs to be written', function () {
        assert.equal(true, false);
      });
    });

    describe('distribute', function () {
      it.skip('needs to be written', function () {
        assert.equal(true, false);
      });
    });

    describe('multiply', function () {
      it.skip('needs to be written', function () {
        assert.equal(true, false);
      });
    });

    describe('divide', function () {
      it.skip('needs to be written', function () {
        assert.equal(true, false);
      });
    });

    describe('simplifyMultiplication', function () {
      it.skip('needs to be written', function () {
        assert.equal(true, false);
      });
    });
  });
});