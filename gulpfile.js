var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('vendor', function() {
  return gulp.src('./src/vendor/**/*.js')
    .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(concat('vendor.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('script', function() {
  return browserify('app.js', { basedir: './src/app', debug: true })
    .transform(babelify)
    .bundle()
    .on('error', gutil.log)
    // Pass desired output filename to vinyl-source-stream
    .pipe(source('app.js'))
    .pipe(buffer())
    // Loads map from browserify file
    .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('style', function() {
  return gulp.src('./src/app/style/app.scss')
    .pipe(sourcemaps.init())
      .pipe(sass('./src/app/style/app.scss').on('error', sass.logError))
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
