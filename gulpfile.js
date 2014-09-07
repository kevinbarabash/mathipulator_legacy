/**
 * Created by kevin on 2014-09-06.
 */

var gulp = require('gulp');
var watch = require('gulp-watch');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var sloc = require('gulp-sloc');


gulp.task('default', function () {
  watch(['src/**/*.js', 'test/**/*.js'], function() {
    return gulp
      .src('test/runner.html')
      .pipe(mochaPhantomJS({reporter: 'dot'}));
  });
});

gulp.task('sloc', function () {
  gulp.src(['src/**/*.js'])
    .pipe(sloc());
});
