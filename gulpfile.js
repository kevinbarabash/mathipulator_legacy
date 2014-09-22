/**
 * Created by kevin on 2014-09-06.
 */

var gulp = require('gulp');
var watch = require('gulp-watch');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var sloc = require('gulp-sloc');
var eslint = require('gulp-eslint');
var stylus = require('gulp-stylus');

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

gulp.task('sloc-test', function () {
  gulp.src(['test/**/*.js'])
    .pipe(sloc());
});

gulp.task('lint', function () {
  gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('stylus', function () {
  gulp.src('src/css/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('src/css'));
});
