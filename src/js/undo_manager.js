/**
 * Created by kevin on 2014-09-25.
 */

define(function (require) {
  var LinkedList = require('datastruct/linked_list');
  var $ = require('jquery');

  function UndoManager() {
    this.list = new LinkedList();
    this.position = this.list.last;
  }

  UndoManager.prototype.push = function (value) {
    // clear everything after the current location
    if (this.position !== this.list.last) {
      this.position.next.prev = null;
      this.position.next = null;
      this.list.last = this.position;
    }

    var canUndo = this.canUndo;
    this.list.push(value);
    this.position = this.list.last;
    if (!canUndo) {
      $(this).trigger('canUndoChanged');
    }
  };

  Object.defineProperty(UndoManager.prototype, 'canUndo', {
    get: function () {
      return this.position !== this.list.first;
    }
  });

  Object.defineProperty(UndoManager.prototype, 'canRedo', {
    get: function () {
      return this.position !== this.list.last;
    }
  });

  UndoManager.prototype.undo = function () {
    if (this.canUndo) {
      this.position = this.position.prev;
      if (!this.canUndo) {
        $(this).trigger('canUndoChanged');
      }
      return this.position.value;
    }
    return null;
  };

  UndoManager.prototype.redo = function () {
    if (this.canRedo) {
      this.position = this.position.next;
      return this.position.value;
    }
  };

  return UndoManager;
});
