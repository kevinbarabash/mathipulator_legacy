/**
 * Created by kevin on 2014-09-25.
 */

define(function (require) {
  var LinkedList = require('datastruct/linked_list');
  var $ = require('jquery');

  function UndoManager() {
    this.list = new LinkedList();
    this.current = this.list.last;
  }

  UndoManager.prototype.push = function (value) {
    this.clear();

    var canUndo = this.canUndo;
    this.list.push(value);
    this.current = this.list.last;
    if (!canUndo) {
      $(this).trigger('canUndoChanged');
    }
  };

  UndoManager.prototype.clear = function () {
    if (this.current !== this.list.last) {
      this.current.next.prev = null;
      this.current.next = null;
      this.list.last = this.current;
    }
  };

  Object.defineProperty(UndoManager.prototype, 'canUndo', {
    get: function () {
      return this.current !== this.list.first;
    }
  });

  Object.defineProperty(UndoManager.prototype, 'canRedo', {
    get: function () {
      return this.current !== this.list.last;
    }
  });

  UndoManager.prototype.undo = function () {
    if (this.canUndo) {
      this.current = this.current.prev;
      if (!this.canUndo) {
        $(this).trigger('canUndoChanged');
      }
      return this.current.value;
    }
    return null;
  };

  UndoManager.prototype.redo = function () {
    if (this.canRedo) {
      this.current = this.current.next;
      return this.current.value;
    }
  };

  return UndoManager;
});
