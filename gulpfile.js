var gulp = require('gulp'),
  gutil = require('gulp-util'),
  bower = require('bower'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  sh = require('shelljs'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps');

var scriptsFolder = "./scripts/",
  paths = {
    scripts: [
      scriptsFolder + 'config.js',
      scriptsFolder + 'module-*.js',
      scriptsFolder + 'app.js',
      scriptsFolder + 'controllers.js',
      scriptsFolder + 'controller-*.js'
    ],
    sass: ['./scss/**/*.scss']
  };

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
  .pipe(sass())
  .on('error', sass.logError)
  .pipe(gulp.dest('./www/css/'))
  .pipe(cleanCss({
    keepSpecialComments: 0
  }))
  .pipe(rename({ extname: '.min.css' }))
  .pipe(gulp.dest('./www/css/'))
  .on('end', done);
});

gulp.task('lint-scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('compile-scripts', ['lint-scripts'], function(){
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(concat('digilib.js'))
        .pipe(uglify())
        .on('error', function(err) {
        console.log(err.toString());
          this.emit('end');
        })
        .pipe(rename('digilib.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./www/js/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['compile-scripts']);
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
  .on('log', function(data) {
    gutil.log('bower', gutil.colors.cyan(data.id), data.message);
  });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
      );
    process.exit(1);
  }
  done();
});
