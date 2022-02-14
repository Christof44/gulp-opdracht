const { src, series, parallel, dest, watch } = require("gulp");

const sass = require("gulp-dart-sass");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const htmlmin = require('gulp-htmlmin');

function scssTask() {
    return src("src/scss/style.scss", { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([cssnano()]))
        .pipe(dest("dist", { sourcemaps: "." }));
}


function jsTask() {
    return src("src/js/script.js", { sourcemaps: true })
        .pipe(terser())
        .pipe(dest("dist", { sourcemaps: "." }))
}

function minify() {
    return gulp.src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
};

function browsersyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: ".",
        }
    });
    cb();
}

function images() {
    return src("src/img/*").pipe(imagemin()).pipe(dest("dist/img"));
}

function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}



function watchTask() {
    watch("*.html", browsersyncReload)
    watch(
        ["src/scss/**/*.scss", "src/js/**/*.js"], series(scssTask, jsTask, browsersyncReload)
    );
}


exports.default = series(scssTask, jsTask, browsersyncServe, images, watchTask);