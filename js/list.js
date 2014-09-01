/**
 * Created by kevin on 2014-08-16.
 */

function Node(value) {
  this.value = value;
  this.prev = null;
  this.next = null;
}

function List() {
  this.first = null;
  this.last = null;
  for (var i = 0; i < arguments.length; i++) {
    this.push(arguments[i]);
  }
}

List.prototype.push = function (value) {
  var node = new Node(value);
  if (this.first === null && this.last === null) {
    this.first = node;
    this.last = node;
  } else {
    node.prev = this.last;
    this.last.next = node;
    this.last = node;
  }
};

List.prototype.prepend = function (value) {
  var node = new Node(value);
  if (this.first === null && this.last === null) {
    this.first = node;
    this.last = node;
  } else {
    node.next = this.first;
    this.first.prev = node;
    this.first = node;
  }
};

List.prototype.toArray = function () {
  var result = [];

  var node = this.first;
  while (node !== null) {
    if (node.value instanceof List) {
      result.push(node.value.toArray());
    } else {
      result.push(node.value);
    }
    node = node.next;
  }

  return result;
};

List.prototype.length = function () {
  var count = 0;

  var node = this.first;
  while (node !== null) {
    count++;
    node = node.next;
  }

  return count;
};


List.prototype.toASCII = function () {
  var result = '';

  var node = this.first;
  while (node !== null) {
    if (node.value instanceof List) {
      // TODO: run this as a post process step using regexes
      if (node.prev && (node.prev.value === '*' || node.prev.value === '^' || node.prev.value === '/')) {
        result += '(';
      }
      if (node.next && (node.next.value === '*' || node.next.value === '^' || node.next.value === '/')) {
        result += '(';
      }
      result += node.value.toASCII();
      if (node.prev && (node.prev.value === '*' || node.prev.value === '^' || node.prev.value === '/')) {
        result += ')';
      }
      if (node.next && (node.next.value === '*' || node.next.value === '^' || node.next.value === '/')) {
        result += ')';
      }
    } else {
      // TODO: run this as a post process step using regexes
      if (node.value === '*' && node.prev && !isNaN(node.prev.value) && node.next && isNaN(node.next.value)) {

      } else {
        result += node.value
      }
    }
    node = node.next;
  }

  return result;
};

List.prototype.toTeX = function () {
  var result = '';

  var node = this.first;
  while (node !== null) {
    // TODO: figure out how to deal with fractions
    if (node.next && node.next.value === '/') {
      result += '\\frac{';
      if (node.value instanceof List) {
        result += node.value.toTeX();
      } else {
        result += node.value;
      }
      result += '}{';
      node = node.next.next;
      if (node.value instanceof List) {
        result += node.value.toTeX();
      } else {
        result += node.value;
      }
      result += '}';
    } else if (node.value instanceof List) {
      // TODO: I need to know what kind of list this is
      // TODO: if we have a have a polynomial term ahead of a multi-term expression then we can drop the parenthesis

      // TODO: run this as a post process step using regexes
      if (node.prev && (node.prev.value === '*' || node.prev.value === '^' || node.prev.value === '/')) {
        result += '\\left(';
      }
      if (node.next && (node.next.value === '*' || node.next.value === '^' || node.next.value === '/')) {
        result += '\\left(';
      }

      result += node.value.toTeX();

      if (node.prev && (node.prev.value === '*' || node.prev.value === '^' || node.prev.value === '/')) {
        result += '\\right)';
      }
      if (node.next && (node.next.value === '*' || node.next.value === '^' || node.next.value === '/')) {
        result += '\\right)';
      }
    } else {
      // TODO: run this as a post process step using regexes
      if (node.value === '*' && node.prev && !isNaN(node.prev.value) && node.next && isNaN(node.next.value)) {

      } else if (node.value === '*' && node.prev && isNaN(node.prev.value) && node.next && isNaN(node.next.value)) {

      } else {
        if (node.value === '*') {
          result += '\\times';
        } else if (node.value === '/') {
          result += '\\div';  // TODO: use \\frac instead
        } else {
          result += node.value;
        }
      }
    }
    node = node.next;
  }

  return result;
};
