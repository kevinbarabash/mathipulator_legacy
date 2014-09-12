/**
 * Created by kevin on 2014-09-06.
 */

var gulp = require('gulp');
var watch = require('gulp-watch');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var sloc = require('gulp-sloc');
var eslint = require('gulp-eslint');

gulp.task('watch', function () {
  watch(['src/**/*.js', 'test/**/*.js'], function() {
    return gulp
      .src('test/runner.html')
      .pipe(mochaPhantomJS({reporter: 'dot'}));
  });
});

gulp.task('test', function () {
  gulp.src('test/runner.html')
    .pipe(mochaPhantomJS({reporter: 'dot'}));
});

gulp.task('sloc', function () {
  gulp.src(['src/**/*.js'])
    .pipe(sloc());
});

gulp.task('lint', function () {
  gulp.src(['src/**/*.js'])
    .pipe(eslint({
      globals: {
        'define':false,
        'document':false,
        'MathJax':false,  // TODO: figure out how to make these globals file specific
        'location':false
      },
      rules: {
        'quotes':0,
        'new-cap':0 // TODO: figure out how to turn off rules for particular files
      }
    }))
    .pipe(eslint.format());
});
