/**
 * Created by kevin on 2014-09-14.
 */

define(function (require) {

  var Stack = require('datastruct/stack');

  describe('Stack', function () {
    var stack;
    beforeEach(function () {
      stack = new Stack();
    });

    describe('peek', function () {
      it('should return null on an empty stack', function () {
        assert.equal(stack.peek(), null);
      });

      it('should return the value on top of the stack', function () {
        stack.push(1);
        stack.push(2);
        stack.push(3);
        assert.equal(stack.peek(), 3);
      });

      it('shouldn\'t change the value on top of the stack', function () {
        stack.push(1);
        stack.push(2);
        stack.push(3);
        stack.peek();
        assert.equal(stack.peek(), 3);
      });
    });

    describe('pop', function () {
      it('should return null on an empty stack', function () {
        assert.equal(stack.pop(), null);
      });

      it('should return the value on top of the stack', function () {
        stack.push(1);
        stack.push(2);
        stack.push(3);
        assert.equal(stack.pop(), 3);
      });

      it('should change the value on top of the stack', function () {
        stack.push(1);
        stack.push(2);
        stack.push(3);
        stack.pop();
        assert.equal(stack.pop(), 2);
      });

      it('should remove values in reverse order', function () {
        stack.push(1);
        stack.push(2);
        stack.push(3);
        assert.equal(stack.pop(), 3);
        assert.equal(stack.pop(), 2);
        assert.equal(stack.pop(), 1);
      });
    });

    describe('push', function () {
      it('should add values an empty stack', function () {
        stack.push(1);
        assert.equal(stack.peek(), 1);
      });

      it('should add values to non-empty stack', function () {
        stack.push(1);
        stack.push(2);
        stack.push(3);
        assert.equal(stack.peek(), 3);
      });
    });
  });
});
