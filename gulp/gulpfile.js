var gulp         = require('gulp');
var rename       = require('gulp-rename');
var browserSync  = require('browser-sync');
var notify       = require('gulp-notify');
var sass         = require('gulp-sass');
var minifycss    = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "../"
        }
    });
});

gulp.task('styles', function() {
  return gulp.src('../scss/styles.scss')
    //Parse
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 4 versions'))
    .pipe(gulp.dest('../css'))
    //Minify
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('../css'))
    //Reload
    // .pipe(notify({ message: 'Styles task complete' }));
});

// Default task to be run with gulp
gulp.task('default', ['styles', 'browser-sync'], function () {
    gulp.watch("../scss/*.scss", ['styles', browserSync.reload]);

});