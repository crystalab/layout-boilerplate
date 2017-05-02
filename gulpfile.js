'use strict';

const gulp = require('gulp');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const order = require('gulp-order');
const twig = require('gulp-twig');
const compass = require('gulp-compass');
const browserSync = require('browser-sync').create();

const config = require('./config.json');

gulp.task('clean', () => {
  return gulp.src('./public/*')
    .pipe(clean());
});

gulp.task('sass', () => {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(compass({
      sass: './src/sass',
      css: './public/css'
    }))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', () => {
  return gulp.src('./src/scripts/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(order(config.jsOrder))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./public/scripts'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('templates', () => {
  return gulp.src('./src/templates/*.twig')
    .pipe(twig({
      data: config.data
    }))
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['serve'], function() {
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/scripts/**/*.js', ['js']);
  gulp.watch('src/templates/**/*.twig', ['templates']);
});

gulp.task('serve', ['clean', 'templates', 'sass', 'js'], function() {
  browserSync.init({
    server: {
      baseDir: './public'
    }
  });
});

gulp.task('default', ['watch']);