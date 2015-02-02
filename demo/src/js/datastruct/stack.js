/**
 * Created by kevin on 2014-09-14.
 */

define(function (require) {

  var LinkedList = require('datastruct/linked_list');

  function Stack () {
    this.list = new LinkedList();
  }

  Stack.prototype.push = function (value) {
    this.list.push(value);
  };

  Stack.prototype.pop = function () {
    return this.list.pop();
  };

  Stack.prototype.peek = function () {
    if (this.list.last !== null) {
      return this.list.last.value;
    }
    return null;
  };

  return Stack;
});
