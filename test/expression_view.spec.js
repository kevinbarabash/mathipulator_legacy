/**
 * Created by kevin on 2014-09-06.
 */

define(function (require) {

  var ExpressionModel = require('expression_model');
  var ExpressionView = require('expression_view');
  var $ = require('jquery');

  describe('ExpressionView', function () {
    describe('createFractions', function () {
      it('should create fractions for division of numbers', function () {
        var model = ExpressionModel.fromASCII('12/-32');
        var view = new ExpressionView(model);

        view.createFractions();
        var xml = view.xml;
        var mrow = xml.firstElementChild;
        var mfrac = mrow.firstElementChild;

        assert($(mrow).is('mrow'));
        assert($(mfrac).is('mfrac'));
        assert($(mfrac).children().length === 2);

        var numerator = mfrac.firstElementChild;
        var denominator = mfrac.lastElementChild;

        assert($(numerator).is('mn'));
        assert.equal($(numerator).text(), '12');
        assert($(denominator).is('mn'));
        assert.equal($(denominator).text(), '-32');
      });

      it('should create fractions for division of variables numbers', function () {
        var model = ExpressionModel.fromASCII('x/-y');
        var view = new ExpressionView(model);

        view.createFractions();
        var xml = view.xml;
        var mrow = xml.firstElementChild;
        var mfrac = mrow.firstElementChild;

        assert($(mrow).is('mrow'));
        assert($(mfrac).is('mfrac'));
        assert($(mfrac).children().length === 2);

        var numerator = mfrac.firstElementChild;
        var denominator = mfrac.lastElementChild;

        assert($(numerator).is('mi'));
        assert.equal($(numerator).text(), 'x');
        assert($(denominator).is('mi'));
        assert.equal($(denominator).text(), '-y');
      });

      it('should create fractions for division of expressions', function () {
        var model = ExpressionModel.fromASCII('(x+12)/(-y-32)');
        var view = new ExpressionView(model);

        view.createFractions();
        var xml = view.xml;
        var mrow = xml.firstElementChild;
        var mfrac = mrow.firstElementChild;

        assert($(mrow).is('mrow'));
        assert($(mfrac).is('mfrac'));
        assert($(mfrac).children().length === 2);

        var numerator = mfrac.firstElementChild;
        var denominator = mfrac.lastElementChild;

        assert($(numerator).is('mrow'));
        assert($(denominator).is('mrow'));
      });
    });
  });

});
