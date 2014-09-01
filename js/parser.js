/**
 * Created by kevin on 2014-08-16.
 */

function isAlpha(token) {
  return (token >= 'a' && token <= 'z');
}

function isNumber(token) {
  return /\d*\.\d+|\d+\.\d*|\d+/.test(token);
}

function Parser () {}

// TODO: switch from 'match' to 'exec' so that an invalid input raises an error
Parser.prototype.parse = function (input) {
  this.i = 0;
  this.tokens = input.match(/([a-z])|([\(\)\+\-\/\*\^])|(\d*\.\d+|\d+\.\d*|\d+)/g);

  var result = this.expression();
  if (result instanceof List) {
    return result;
  } else {
    return new List(result);
  }
};

Parser.prototype.expression = function() {
  var tokens = this.tokens;
  var result = new List();

  result.push(this.term(tokens));

  var token = tokens[this.i++];
  while (token === '+' || token === '-') {
    result.push(token);
    result.push(this.term());
    token = tokens[this.i++];
  }
  this.i--;

  if (result.length() === 1) {
    return result.first.value;
  }
  return result;
};

Parser.prototype.term = function() {
  var tokens = this.tokens;
  var result = new List();

  result.push(this.factor(tokens));

  var token = tokens[this.i++];

  while (token === '*' || token === '/' || token === '(' || isAlpha(token)) {
    if (token === '(') {
      result.push('*');
      result.push(this.expression());
      token = tokens[this.i++];
      if (token !== ')') {
        throw "expected ')'";
      }
    } else if (isAlpha(token)) {
      result.push('*');
      result.push(token);
      token = tokens[this.i++];
    } else {
      result.push(token);
      result.push(this.factor());
      token = tokens[this.i++];
    }

    if (this.i > tokens.length) {
      break;
    }
  }
  this.i--;

  if (result.length() === 1) {
    return result.first.value;
  }
  return result;
};

Parser.prototype.factor = function() {
  var tokens = this.tokens;
  var token = tokens[this.i++];
  var sign = '';

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
        var power = new List();
        power.push(token);
        power.push('^');
        token = tokens[this.i++];
        if (token === '(') {
          power.push(this.expression());
          token = tokens[this.i++];
          if (token !== ')') {
            throw "expected ')'";
          }
        } else {
          power.push(token);
        }
        return power;
      }
    } else {
      this.i--;
      return sign + token;
    }
  } else if (token === '(') {
    var expr = this.expression();
    token = tokens[this.i++];
    if (token === ')') {
      return expr;
    } else {
      throw "expected ')'";
    }
  } else {
    throw "unexpected input";
  }
};
