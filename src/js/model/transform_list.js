/**
 * Created by kevin on 2014-09-13.
 */

define(function (require) {

  /**
   * TODO: transforms to add:
   * - add/sub on like terms
   * - simplify exponents in mul/div ops
   */

  return [
    require('model/transform/commute'),
    require('model/transform/evaluate'),
    require('model/transform/distribute_forwards'),
    require('model/transform/distribute_backwards'),
    require('model/transform/rewrite_subtraction'),
    require('model/transform/rewrite_division'),
    require('model/transform/write_as_subtraction'),
    require('model/transform/remove_zero'),
    require('model/transform/collect_like_terms'),
    require('model/transform/replace_mult_0'),
    require('model/transform/reduce_coeffs'),
    require('model/transform/simplify_mult_one')
  ];
});
