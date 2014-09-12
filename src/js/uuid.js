/**
 * Created by kevin on 2014-09-10.
 */

define(function () {

  // TODO: replace this later with a proper UUID generator
  return function () {
    return '_' + parseInt(1000000 * Math.random());
  };

});
