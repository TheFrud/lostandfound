var gulp = require("gulp");
var gulpBrowser = require("gulp-browser");
livereload = require('gulp-livereload');

gulp.task('browserify-index', function() {
    var stream = gulp.src('app/assets/javascripts/index.js')
        .pipe(gulpBrowser.browserify())
        .pipe(gulp.dest("app/assets/javascripts/browserified/"));
    return stream;
});

gulp.task('browserify-lagg-till-annons', function() {
    var stream = gulp.src('app/assets/javascripts/lagg_till_annons.js')
        .pipe(gulpBrowser.browserify())
        .pipe(gulp.dest("app/assets/javascripts/browserified/"));
    return stream;
});

gulp.task('browserify-annons', function() {
    var stream = gulp.src('app/assets/javascripts/annons.js')
        .pipe(gulpBrowser.browserify())
        .pipe(gulp.dest("app/assets/javascripts/browserified/"));
    return stream;
});


gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('app/assets/javascripts/*.js', ['browserify-index', 'browserify-lagg-till-annons', 'browserify-annons']);
});