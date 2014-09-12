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
  var id = 0;
  // TODO: assign IDs to things at the end, it'll clean the code up quite a bit

  function SimpleMathMLParser () {}

  // TODO: switch from 'match' to 'exec' so that an invalid input raises an error
  SimpleMathMLParser.prototype.parse = function (input) {
    this.i = 0;
    this.tokens = input.match(/([a-z])|([\(\)\+\-\/\*\^])|(\d*\.\d+|\d+\.\d*|\d+)/g);

    // if you don't use display="block" then all parentheses need stretchy="false"
    var math = $('<math>').attr('xmlns', namespace).attr('display', 'block');
    math.append(this.expression());

    $(math).find('mrow,msup,mfrac,mn,mi,mo').each(function () {
      $(this).attr('id', '_' + id);
      id++;
    });

    // this is really a view concern
    $(math).find('mn').addClass('num');
    $(math).find('mo').addClass('op');

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
          throw "expected ')'";
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

    // TODO: handle parentheses here
    // e.g.
    // check for '('
    // call this.expression();
    // check for ')'
    // then check
    // TODO: write test cases first including a failing test case for (x+1)^2 and 1/(x-1)^2

    if (isAlpha(token) || isNumber(token)) {
      if (tokens[this.i++] === '^') {
        if (sign) {
          // handle unary op case
          throw "we don't handle unary operators in this case yet";
        } else {
          var msup = $('<msup>');
          if (isAlpha(token)) {
            msup.append($('<mi>').text(token));
          } else if (isNumber(token)) {
            msup.append($('<mn>').text(token));
          }
          token = tokens[this.i++];
          if (token === '(') {
            msup.append(this.expression());
            token = tokens[this.i++];
            if (token !== ')') {
              throw "expected ')'";
            }
          } else {
            if (isAlpha(token)) {
              msup.append($('<mi>').text(token));
            } else if (isNumber(token)) {
              msup.append($('<mn>').text(token));
            }
          }
          return msup;
        }
      } else {
        this.i--;
        var result = '';
        if (isAlpha(token)) {
          result = $('<mi>').text(sign + token);
        } else if (isNumber(token)) {
          result = $('<mn>').text(sign + token);
        }
        return result;
      }
    } else if (token === '(') {
      var mrow = this.expression();
      $(mrow).attr('parens', 'true');  // use the 'parens' attribute to indicate that a mrow should have parenthesis around it

      token = tokens[this.i++];
      if (token === ')') {
        return mrow;
      } else {
        throw "expected ')'";
      }
    } else {
      throw "unexpected input";
    }
  };

  return SimpleMathMLParser;
});
