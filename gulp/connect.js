'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');

// Start local dev server.
gulp.task('connect', function() {
  connect.server({
    root: global.paths.src,
    port: 4200,
    livereload: true
  });
});
