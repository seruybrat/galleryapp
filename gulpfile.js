var gulp       = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync').create(),
    jade         = require('gulp-jade'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant');


gulp.task('browser-sync', ['styles', 'scripts', 'jade'], function() {
        browserSync.init({
                server: {
                        baseDir: "app"
                },
                notify: false
        });
        
});

gulp.task('styles', function () {
    return gulp.src('app/sass/**/*.sass')
    .pipe(sass({
        includePaths: require('node-bourbon').includePaths
    }).on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
});


gulp.task('jade', function() {
    return gulp.src('app/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('app'));
});

gulp.task('scripts', function() {
    return gulp.src([
        'app/js/common.js',
        ])
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/js'));
});

gulp.task('watch', ['browser-sync', 'scripts'], function() {
    gulp.watch('app/sass/*.sass', ['styles']);
    gulp.watch('app/**/*.jade', ['jade']);
    gulp.watch('app/*.html').on('change', browserSync.reload);
    gulp.watch('app/js/**/*.js').on('change', browserSync.reload);
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'img', 'styles', 'scripts'], function() {

    var buildCss = gulp.src([
        'app/css/main.css'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/common.min.js')
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

});

gulp.task('clear', function (callback) {
    return cache.clearAll();
})

gulp.task('default', ['watch']);