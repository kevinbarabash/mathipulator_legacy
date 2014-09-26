/**
 * Created by kevin on 2014-09-13.
 */

define(function (require) {
  'use strict';

  var ExpressionModel = require('model/expression_model');
  var MathView = require('view/math_view');
  var $ = require('jquery');

  var expressions;

  // Algebra
  $('<h2>Algebra</h2>').appendTo(document.body);

  expressions = [];
  expressions.push('3x^2 + -2x + -5/4');
  expressions.push('3x^2 + -2x + -5');
  expressions.push('(x+1)*4*(x-1)');
  expressions.push('e^(-(x^2+y^2))');
  expressions.push('(x+1)*4*(x-1)');
  expressions.push('4*-(x+1)');           // TODO: figure out the valid positions of unary minuses
  expressions.push('(x+1)^2');
  expressions.push('1/(x-(2+1/x)) + 1/(x^2+1/x) + (x+1)^2');
  expressions.push('1/(x-(2+1/x))');
  expressions.push('1/(2*(x+1))');
  expressions.push('1/2+-3/4-(5/6)+(-7/8)');
  expressions.push('x^2^2');
  expressions.push('(x+1)^(-2)');
  expressions.push('(-2)^(x+1)');         // TODO: fix mssing parentheses
  expressions.push('(x+1)^(x+1)');

  // TODO: determine when to set stretch=false and when not to

  expressions.forEach(function (expr) {
    var model = ExpressionModel.fromASCII(expr);
    var options = { format: 'algebra' };

    var view = new MathView({
      model: model,
      options: options
    });

    view.render(document.body);
  });

  // Arithmetic
  $('<h2>Arithmetic</h2>').appendTo(document.body);

  expressions = [];
  expressions.push('5 - 1 + 2 * (3 - 4)');
  expressions.push('1/2');  // make TODO: how to distiguish division operator from fractions

  expressions.forEach(function (expr) {
    var model = ExpressionModel.fromASCII(expr);
    var options = { format: 'arithmetic' };

    var view = new MathView({
      model: model,
      options: options
    });

    view.render(document.body);
  });
});
