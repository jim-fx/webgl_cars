/*jshint esversion: 6 */

const chokidar = require("chokidar");
const gulp = require('gulp');
const rename = require("gulp-rename");
const copy = require('gulp-copy');
const fs = require('fs');

//Optimize images
const imageResize = require('gulp-image-resize');
const imagemin = require('gulp-imagemin');
const imageminJpegtran = require('imagemin-jpegtran');

//Webpack
const webpack = require('webpack-stream');
const jsonminify = require('gulp-jsonminify');


gulp.task('watch', function(){
  const watcher = gulp.watch(["dev/js/*", "dev/3D/**"]);

  watcher.on('change', function(path, stats){

    let pathString = path.path;

    if(pathString.indexOf("/dev/js/") !== -1){
      console.log(".js File changed");
    }else if(pathString.indexOf("/textures/") !== -1){
      console.log("Texture changed");
    }else if(pathString.indexOf("/models/") !== -1){
      console.log("model file changed");
    }else if(pathString.indexOf(".json") !== -1){
      console.log("Scene File changed");
    }else{
      console.log("Unknown File changed");
    }

  });
});
