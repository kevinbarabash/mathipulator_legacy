/**
 * Created by kevin on 2014-09-10.
 */

define(function () {

  var id = 0;

  function genId() {
    return 'mid-' + (id++);
  }

  return genId;
});
