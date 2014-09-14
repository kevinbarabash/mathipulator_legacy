/**
 * Created by kevin on 2014-08-16.
 */

define(function (require) {

  var $ = require('jquery');

  function isAlpha(token) {
    return (token >= 'a' && token <= 'z');
  }

  function isNumber(token) {
    return /\d*\.\d+|\d+\.\d*|\d+/.test(token);
  }

  var namespace = 'http://www.w3.org/1998/Math/MathML';
  var tokenRegex = /([a-z])|([\(\)\+\-\/\*\^])|(\d*\.\d+|\d+\.\d*|\d+)/g;

  function SimpleMathMLParser () {}

  // TODO: switch from 'match' to 'exec' so that an invalid input raises an error
  SimpleMathMLParser.prototype.parse = function (input) {
    this.i = 0;
    this.tokens = input.match(tokenRegex);

    var math = $('<math>').attr('xmlns', namespace);
    math.append(this.expression());

    return math.get(0);
  };

  SimpleMathMLParser.prototype.expression = function() {
    var tokens = this.tokens;
    var mrow = $('<mrow>');

    mrow.append(this.term(tokens));

    var token = tokens[this.i++];
    while (token === '+' || token === '-') {
      mrow.append($('<mo>').text(token));
      mrow.append(this.term());
      token = tokens[this.i++];
    }
    this.i--;

    if (mrow.children().length === 1) {
      return mrow.children().first();
    }

    return mrow;
  };

  SimpleMathMLParser.prototype.term = function() {
    var tokens = this.tokens;
    var mrow = $('<mrow>');

    mrow.append(this.factor(tokens));

    var token = tokens[this.i++];

    while (token === '*' || token === '/' || token === '(' || isAlpha(token)) {
      if (token === '(') {

        mrow.append($('<mo>').text('*').attr('display', 'none'));

        var expr = this.expression();
        token = tokens[this.i++];
        if (token !== ')') {
          throw 'expected )';
        }
        expr.attr('parens', 'true');
        mrow.append(expr);

      } else if (isAlpha(token)) {  // TODO: figure out why we can't let factor() handle this
        mrow.append($('<mo>').text('*').attr('display', 'none'));
        this.i--; // put the alpha back on so factor() can deal with it
        // TODO: create a peek function to handle this more elegantly
        mrow.append(this.factor());
        token = tokens[this.i++];
      } else {
        mrow.append($('<mo>').text(token));
        mrow.append(this.factor());
        token = tokens[this.i++];
      }

      if (this.i > tokens.length) {
        break;
      }
    }
    this.i--;

    if (mrow.children().length === 1) {
      return mrow.children().first();
    }

    return mrow;
  };

  SimpleMathMLParser.prototype.factor = function() {
    var tokens = this.tokens;
    var token = tokens[this.i++];
    var sign = '';

    // TODO: think about multiple unary minuses
    if (token === '+' || token === '-') {
      sign = token;
      token = tokens[this.i++];
    }


    var base, exp;

    if (isAlpha(token)) {
      base = $('<mi>').text(token);
    } else if (isNumber(token)) {
      base = $('<mn>').text(token);
    } else if (token === '(') {
      base = this.expression();
      $(base).attr('parens', 'true');
      token = tokens[this.i++];
      if (token !== ')') {
        throw 'expected )';
      }
    }

    if (tokens[this.i++] === '^') {
      exp = this.factor();
      return $('<msup>').append(base).append(exp);
    } else {
      this.i--;

      var factor = base;

      if ($(factor).is('mrow')) {
        if (sign !== '') {
          $(factor).attr('unary', 'minus'); // TODO: need to update evaluate.js to understand this
        }
      } else {
        var text = $(factor).text();
        $(factor).text(sign + text);
      }

      return factor;
    }
  };

  return SimpleMathMLParser;
});
