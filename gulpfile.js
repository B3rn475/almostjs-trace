/*jslint node: true, nomen: true */
"use strict";

var gulp = require('gulp'),
    rimraf = require('gulp-rimraf'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    extractor = require('gulp-extract-sourcemap'),
    minifyjs = require('gulp-uglify');

gulp.task('clean', function () {
    return gulp.src('./dist/*', {read: false, dot: true}).pipe(rimraf({ force: true }));
});

var expose = {
    'window': 'window',
    'almost': 'almost'
};

gulp.task('almost-trace.js', function () {
    return browserify({
        entries: './global.js',
        debug: true,
    })
        .transform('exposify', {
            expose: expose
        })
        .transform('stringify', {
            extensions: ['.svg', '.html']
        })
        .bundle()
        .pipe(source('almost-trace.js'))
        .pipe(buffer())
        .pipe(extractor({
            basedir: __dirname,
            fakeFix: true
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('almost-trace.min.js', function () {
    return browserify({
        entries: './global.js',
        debug: false,
    })
        .transform('exposify', {
            expose: expose
        })
        .transform('stringify', {
            extensions: ['.svg', '.html'],
            minify: true,
            minifyOptions: {
                removeComments: false
            }
        })
        .bundle()
        .pipe(source('almost-trace.min.js'))
        .pipe(buffer())
        .pipe(minifyjs())
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['almost-trace.js', 'almost-trace.min.js']);

gulp.task('default', ['clean'], function () {
    return gulp.start('build');
});
