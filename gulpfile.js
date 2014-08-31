var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('js', function() {
    gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/smooth-scroll/dist/js/smooth-scroll.js',
        'bower_components/FitText.js/jquery.fittext.js'
    ])
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'));
});

gulp.task('default', ['js'], function() {
    // place code for your default task here
});
