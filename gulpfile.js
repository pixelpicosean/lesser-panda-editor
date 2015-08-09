var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var del = require('del');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('vendor', function() {
  return gulp.src('./src/vendor/**/*.js')
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('script', function(next) {
  return gulp.src('./src/app/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({ modules: 'system' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream())
    .on('error', function(err) {
      gutil.log(err);
      next();
    });
});

gulp.task('style', function(next) {
  return gulp.src('./src/app/app.scss')
    .pipe(sourcemaps.init())
      .pipe(sass('./src/app/app.scss').on('error', function(err) {
        sass.logError(err);
        next();
      }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('html', function() {
  return gulp.src('./src/app/index.html')
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('build', ['vendor', 'script', 'style', 'html']);

gulp.task('clean', function (done) {
  del(['dist'], done);
});

gulp.task('watch', function() {
  gulp.watch('./src/app/*.html', ['html']);
  gulp.watch('./src/app/**/*.js', ['script']);
  gulp.watch('./src/app/style/**/*.scss', ['style']);
});

gulp.task('server', function() {
  browserSync.init({
    port: 4200,
    server: {
      baseDir: ['dist', 'public']
    },
    ghostMode: false,
    notify: false
  });
});

gulp.task('default', ['build', 'watch', 'server']);
