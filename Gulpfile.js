var gulp = require('gulp');
var watch = require('gulp-watch');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');

const CSS_SOURCE_FOLDER = './css';
const STATIC_FOLDER = './static';

function buildCss() {
  return gulp.src(CSS_SOURCE_FOLDER + '/site.styl')
    .pipe(stylus())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 5%'],
      cascade: false
    }))
    .pipe(gulp.dest(STATIC_FOLDER));
}

gulp.task('build:css', buildCss);

gulp.task('watch:css', function () {
  return watch(CSS_SOURCE_FOLDER + '/**/*.styl', buildCss);
});
