'use strict';

//  var options = require('./package');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var babel = require('gulp-babel');

gulp.task('build', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: 'src/main.js',
    debug: true
  }).transform('babelify', { presets: ['es2015'] });

  return b.bundle()
    .pipe(source('unrest.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(gulp.dest('./dist/'))
        .pipe(gulp.dest('./linq/js/'))
        .pipe(rename({extname: '.min.js'}))
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'))
    .pipe(gulp.dest('./linq/js/'));
});

gulp.task('node', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist/node'));
});

gulp.task('test', ['node'], function () {
  return gulp.src('test/tests.js', {read: false})
    .pipe(mocha({reporter: 'list'}));
});

gulp.task('default', function () {
  gulp.watch('src/**/*.js', ['build']);
});
