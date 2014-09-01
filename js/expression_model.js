/**
 * Created by kevin on 2014-09-01.
 */

define(function (require) {
  var Parser = require('simple_mml_parser');
  var parser = new Parser();

  function ExpressionModel(asciiMath) {
    this.xml = parser.parse(asciiMath);
  }

  return ExpressionModel;
});
