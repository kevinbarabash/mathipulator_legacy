/**
 * Created by kevin on 2014-08-16.
 */

function isAlpha(token) {
  return (token >= 'a' && token <= 'z');
}

function isNumber(token) {
  return /\d*\.\d+|\d+\.\d*|\d+/.test(token);
}

var namespace = 'http://www.w3.org/1998/Math/MathML';
var id = 0;

function SimpleMathMLParser () {}

// TODO: switch from 'match' to 'exec' so that an invalid input raises an error
SimpleMathMLParser.prototype.parse = function (input) {
  this.i = 0;
  this.tokens = input.match(/([a-z])|([\(\)\+\-\/\*\^])|(\d*\.\d+|\d+\.\d*|\d+)/g);

  // if you don't use display="block" then all parentheses need stretchy="false"
  var math = $('<math>').attr('xmlns', namespace).attr('display', 'block');
  math.append(this.expression());

  return math.get(0);
};

SimpleMathMLParser.prototype.expression = function() {
  var tokens = this.tokens;
  var mrow = $('<mrow>').attr('id', '_' + id);
  id++;

  mrow.append(this.term(tokens));

  var token = tokens[this.i++];
  while (token === '+' || token === '-') {
    mrow.append($('<mo>').addClass('op').text(token).attr('id', '_' + id));
    id++;
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
  var mrow = $('<mrow>').attr('id', '_' + id);
  id++;
  var mo, mi;

  mrow.append(this.factor(tokens));

  var token = tokens[this.i++];

  while (token === '*' || token === '/' || token === '(' || isAlpha(token)) {
    if (token === '(') {
      mrow.append($('<mo>').text('&InvisibleTimes;').attr('id', '_' + id));
      id++;
      mrow.append($('<mo>').text('(').attr('id', '_' + id));
      id++;
      mrow.append(this.expression());
      token = tokens[this.i++];
      if (token !== ')') {
        throw "expected ')'";
      }
      mrow.append($('<mo>').text(')'));
    } else if (isAlpha(token)) {  // TODO: figure out why we can't let factor() handle this
      mrow.append($('<mo>').text('&InvisibleTimes;').attr('id', '_' + id));
      id++;
      mrow.append($('<mi>').text(token).attr('id', '_' + id));
      id++;
      token = tokens[this.i++];
    } else {
      mrow.append($('<mo>').addClass('op').text(token).attr('id', '_' + id));
      id++;
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
  var mi, mn, mo;

  // TODO: think about multiple unary minuses
  if (token === '+' || token === '-') {
    sign = token;
    token = tokens[this.i++];
  }

  if (isAlpha(token) || isNumber(token)) {
    if (tokens[this.i++] === '^') {
      if (sign) {
        // handle unary op case
      } else {
        var msup = $('<msup>').attr('id', '_' + id);
        id++;
        if (isAlpha(token)) {
          msup.append($('<mi>').text(token).attr('id', '_' + id));
          id++;
        } else if (isNumber(token)) {
          msup.append($('<mn>').addClass('num').text(token).attr('id', '_' + id));
          id++;
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
            msup.append($('<mi>').text(token).attr('id', '_' + id));
            id++;
          } else if (isNumber(token)) {
            msup.append($('<mn>').addClass('num').text(token).attr('id', '_' + id));
            id++;
          }
        }
        return msup;
      }
    } else {
      this.i--;
      var result = '';
      if (isAlpha(token)) {
        result = $('<mi>').text(sign + token).attr('id', '_' + id);
      } else if (isNumber(token)) {
        result = $('<mn>').addClass('num').text(sign + token).attr('id', '_' + id);
      }
      id++;
      return result;
    }
  } else if (token === '(') {
    var mrow = $('<mrow>').attr('id', '_' + id);
    id++;
    mrow.append($('<mo>').text('('));
    mrow.append(this.expression());
    token = tokens[this.i++];
    if (token === ')') {
      mrow.append($('<mo>').text(')'));
      return mrow;
    } else {
      throw "expected ')'";
    }
  } else {
    throw "unexpected input";
  }
};
