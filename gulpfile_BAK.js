gulp.task('build', function(){

  for (var i = 0; i < scenes.length; i++) {
    const inputTextureDir = "./dev/3D/"+scenes[i]+"/textures";
    const outputTextureDir = "./dist/3D/"+scenes[i]+"/textures";

    const inputModelDir = "./dev/3D/"+scenes[i]+"/models";
    const outputModelDir = "./dist/3D/"+scenes[i]+"/models";

    const inputHdrisDir = "./dev/3D/"+scenes[i]+"/hdris";
    const outputHdrisDir = "./dist/3D/"+scenes[i]+"/hdris";

    //optimize and resize textures
    let textures = listTextures(scenes[[]]);
    textures.forEach(file =>{
      if (file.match("4k")) {

        gulp.src(inputTextureDir+"/"+file)
          .pipe(imageResize({
            height : 2048,
            width : 2048,
            format: "jpeg",
            crop : false,
            upscale : true
          }))
          .pipe(imagemin([
             imagemin.jpegtran({
               progressive: true
             })
          ]))
          .pipe(rename(function (path) {
            path.basename = path.basename.replace("4k", "2k")
          }))
          .pipe(gulp.dest(outputTextureDir))


      }else if(file.match("2k")){

        gulp.src(inputTextureDir+"/"+file)
          .pipe(imageResize({
            width : 1024,
            format: "jpeg",
            height : 1024,
            crop : false,
            upscale : true
          }))
          .pipe(imagemin([
             imagemin.jpegtran({progressive: true})
          ]))
          .pipe(rename(function (path) {
            path.basename = path.basename.replace("2k", "1k")
          }))
          .pipe(gulp.dest(outputTextureDir))


      }else if(file.match("1k")){

        gulp.src(inputTextureDir+"/"+file)
          .pipe(imageResize({
            width : 512,
            format: "jpeg",
            height : 512,
            crop : false,
            upscale : true
          }))
          .pipe(imagemin([
             imagemin.jpegtran({progressive: true})
          ]))
          .pipe(rename(function (path) {
            path.basename = path.basename.replace("1k", "512")
          }))
          .pipe(gulp.dest(outputTextureDir))


      }
    })

    //optimize hdris
    let hdris = listTextures(inputHdrisDir)
    hdris.forEach(file => {
      gulp.src(inputHdrisDir+"/"+file)
      .pipe(imageResize({
        width : 2048,
        format: "jpeg",
        height : 1024,
        crop : false,
        upscale : true
      }))
      .pipe(imagemin([
         imagemin.jpegtran({progressive: true})
      ]))
      .pipe(gulp.dest(outputHdrisDir))
    })

    //Copy scene.json
    gulp.src("./dev/3D/"+scenes[i]+"/"+scenes[i]+".json")
      .pipe(jsonminify())
      .pipe(gulp.dest("./dist/3D/"+scenes[i]+"/"))

    //Copy Models
    let models = listModels(inputModelDir);
    models.forEach(file => {
      gulp.src(inputModelDir+"/"+file)
        .pipe(jsonminify())
        .pipe(gulp.dest(outputModelDir))
    })

  }

  //Webpack
  gulp.src("./dev/src/index.js")
    .pipe(webpack(require('./dev/config/webpack-minify.config.js')))
    .pipe(gulp.dest("./dist"))

});