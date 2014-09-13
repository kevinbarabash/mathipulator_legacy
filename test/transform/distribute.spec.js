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
      it.skip('needs to be written', function () {

      });
    });

    describe('backwards', function () {
      it.skip('needs to be written', function () {

      });
    });

  });
});
