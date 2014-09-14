/**
 * Created by kevin on 2014-09-14.
 */

define(function () {

  function Node(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }

  // TODO: add a .dispose() method to Node.prototype so that there aren't any dangling references

  function LinkedList() {
    this.first = null;
    this.last = null;
    for (var i = 0; i < arguments.length; i++) {
      this.push(arguments[i]);
    }
  }

  LinkedList.prototype.push = function (value) {
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

  // TODO: rename to 'unshift' and alias 'prepend' to 'unshift'
  LinkedList.prototype.prepend = function (value) {
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

  LinkedList.prototype.pop = function () {
    var value = null;
    if (this.last !== null) {
      value = this.last.value;
      if (this.last.prev !== null) {
        this.last = this.last.prev;
        this.last.next = null;
      } else {
        this.last = null;
        this.prev = null;
      }
    }
    return value;
  };

  LinkedList.prototype.shift = function () {
    var value = null;
    if (this.first !== null) {
      value = this.first.value;
      if (this.first.next !== null) {
        this.first = this.first.next;
        this.first.prev = null;
      } else {
        this.last = null;
        this.prev = null;
      }
    }
    return value;
  };

  LinkedList.prototype.toArray = function () {
    var result = [];

    var node = this.first;
    while (node !== null) {
      if (node.value instanceof LinkedList) {
        result.push(node.value.toArray());
      } else {
        result.push(node.value);
      }
      node = node.next;
    }

    return result;
  };

  LinkedList.prototype.length = function () {
    var count = 0;

    var node = this.first;
    while (node !== null) {
      count++;
      node = node.next;
    }

    return count;
  };

  LinkedList.prototype.forEach = function (callback) {
    var node = this.first;
    while (node !== null) {
      callback(node.value);
      node = node.next;
    }
  };

  LinkedList.prototype.reduce = function (callback, initialValue) {
    var node = this.first;
    var previousValue = initialValue;
    while (node !== null) {
      previousValue = callback(previousValue, node.value);
      node = node.next;
    }
    return previousValue;
  };

  return LinkedList;
});
