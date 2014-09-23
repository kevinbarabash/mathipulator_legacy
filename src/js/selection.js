/**
 * Created by kevin on 2014-09-06.
 */

define(function () {


  function Selection () {
    // A Selection is valid for a single math model
    this.id = null;
  }

  Selection.prototype.isEmpty = function () {
    return this.id === null;
  };

  Selection.prototype.set = function (id) {
    this.id = id;
  };

  Selection.prototype.clear = function () {
    this.id = null;
  };

  Selection.prototype.grow = function () {
    // start by selecting siblings
    // then start working up the hierarchy
  };

  return Selection;
});
