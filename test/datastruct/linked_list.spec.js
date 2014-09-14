/**
 * Created by kevin on 2014-09-14.
 */

define(function (require) {

  var LinkedList = require('datastruct/linked_list');

  describe('LinkedList', function () {
    var list;

    beforeEach(function () {
      list = new LinkedList();
    });

    it('should convert an empty linked list to an empty array', function () {
      assert.deepEqual(list.toArray(), []);
    });

    it('should convert an non-empty linked list ot an non-empty array', function () {
      list.push(1);
      list.push(2);
      list.push(3);
      assert.deepEqual(list.toArray(), [1,2,3]);
    });

    it('should prepend values correctly', function () {
      list.prepend(1);
      list.prepend(2);
      list.prepend(3);
      assert.deepEqual(list.toArray(), [3,2,1]);
    });

    it('should pop values correctly', function () {
      list = new LinkedList(1,2,3);
      var value = list.pop();
      assert.equal(value, 3);
      assert.deepEqual(list.toArray(), [1,2]);
    });

    it('should shift values correctly', function () {
      list = new LinkedList(1,2,3);
      var value = list.shift();
      assert.equal(value, 1);
      assert.deepEqual(list.toArray(), [2,3]);
    });

    it('should set .first correctly', function () {
      assert.equal(list.first, null);
      list.push(1);
      assert.equal(list.first.value, 1);
      list.push(2);
      list.push(3);
      assert.equal(list.first.value, 1);
      list.prepend(4);
      assert.equal(list.first.value, 4);
    });

    it('should set .last correctly', function () {
      assert.equal(list.last, null);
      list.push(1);
      assert.equal(list.last.value, 1);
      list.push(2);
      list.push(3);
      assert.equal(list.last.value, 3);
      list.prepend(4);
      assert.equal(list.last.value, 3);
    });

    it('should return the correct length', function () {
      assert.equal(list.length(), 0);
      list.push(1);
      assert.equal(list.length(), 1);
      list.prepend(2);
      assert.equal(list.length(), 2);
    });

    it('should implement forEach() correctly', function () {
      list.push(1);
      list.push(2);
      list.push(3);
      var array = [];
      list.forEach(function (value) {
        array.push(value);
      });
      assert.deepEqual(array, [1,2,3]);
    });

    it('should implement reduce() correctly', function () {
      list.push(1);
      list.push(2);
      list.push(3);
      var sum = list.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue;
      }, 0);
      assert.equal(sum, 6);
    });
  });
});
