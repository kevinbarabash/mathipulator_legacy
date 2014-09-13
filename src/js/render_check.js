/**
 * Created by kevin on 2014-09-13.
 */

define(function (require) {
  'use strict';

  var ExpressionModel = require('model/expression_model');
  var ExpressionView = require('view/expression_view');


  var expressions;

  // Algebra
  expressions = [];
  expressions.push('3x^2 + -2x + -5/4');  // TODO: fix formatting issues
  expressions.push('3x^2 + -2x + -5');
  expressions.push('(x+1)*4*(x-1)');
  expressions.push('e^(-(x^2+y^2))');
  expressions.push('(x+1)*4*(x-1)');
  expressions.push('4*-(x+1)');           // TODO: figure out the valid positions of unary minuses
  expressions.push('(x+1)^2');
  expressions.push('1/(x-(2+1/x)) + 1/(x^2+1/x) + (x+1)^2');

  // TODO: determine when to set stretch=false and when not to

  expressions.forEach(function (expr) {
    var model = ExpressionModel.fromASCII(expr);
    var view = new ExpressionView(model, { format: 'algebra' });
    view.render();
  });

  // Arithmetic
  expressions = [];
  expressions.push('5 - 1 + 2 * (3 - 4)');

});
