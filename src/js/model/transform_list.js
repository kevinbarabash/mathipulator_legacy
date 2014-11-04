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
    require('transform/commute'),
    require('transform/evaluate'),
    require('transform/distribute_forwards'),
    require('transform/distribute_backwards'),
    require('transform/rewrite_subtraction'),
    require('transform/rewrite_division'),
    require('transform/write_as_subtraction'),
    require('transform/remove_zero'),
    require('transform/collect_like_terms'),
    require('transform/replace_mult_0'),
    require('transform/reduce_coeffs'),
    require('transform/simplify_mult_one')
  ];
});
