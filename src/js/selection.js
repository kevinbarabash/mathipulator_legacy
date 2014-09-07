/**
 * Created by kevin on 2014-09-06.
 */

define(function () {

  function Selection () {
    // A Selection is valid for a single math model
    this.root = null;
    this.nodes = [];
  }

  Selection.prototype.isEmpty = function () {
    return this.root === null;
  };

  Selection.prototype.set = function (node) {
    this.root = node;
    this.nodes = [node];
  };

  Selection.prototype.clear = function () {
    this.root = null;
    this.nodes = [];
  };

  Selection.prototype.grow = function () {
    // start by selecting siblings
    // then start working up the hierarchy
  };

  return Selection;
});
