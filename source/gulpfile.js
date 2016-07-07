var $    = require('gulp-load-plugins')();
var gulp = require('gulp');

var sassPaths = [
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src'
];
var jsPaths = [
  'bower_components/angular/angular.min.js',
  'bower_components/angular-route/angular-route.min.js',
  'js/app.js'
];

gulp.task('sass', function() {
  return gulp.src('scss/app.scss')
    .pipe($.sass({
      includePaths: sassPaths
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe($.minifyCss())
    .pipe(gulp.dest('../assets/css'));
});

gulp.task('javascript', function() {
  return gulp.src(jsPaths)
    .pipe($.babel())
    .pipe($.concat('app.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('../assets/js'));
});

gulp.task('image', function() {
  return gulp.src('img/*')
    .pipe($.imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('../assets/img'));
});

gulp.task('default', ['sass','javascript','image'], function() {
  gulp.watch(['scss/**/*.scss'], ['sass']);
  gulp.watch(['js/**/*.js'], ['javascript']);
});
