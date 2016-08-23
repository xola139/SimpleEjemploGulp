var gulp = require('gulp');
var webServer = require('gulp-webserver');
var minifyCSS = require('gulp-minify-css');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var imageop =  require('gulp-image-optimization');
var htmlmin = require('gulp-html-minifier');

var config = {
        styles:{
          main:'./src/css/estilos.css',
          watch:'./src/css/*.css',
          output:'./build/css'
      },
      indexMain:{
        watch:'./src/*.html',
        output:'./build/'
       },
       views:{
        watch:'./src/views/*.html',
        output:'./build/views'
      },
      script:{
          main:'./src/js/index.js',
          watch:'./src/js/*.js',
          output:'./build/js'
      },
      image:{
          watch:['./src/img/*.png','./src/img/*.jpg'],
          output:'./build/img'
      }
    };

    gulp.task('server',function () {
      gulp.src('./build')
        .pipe(webServer({
          host: '0.0.0.0',
          port: 8087,
          livereload: true
        }));
    });

    gulp.task('build:css',function () {
      gulp.src(config.styles.main)
        .pipe(minifyCSS())
        .pipe(gulp.dest(config.styles.output));
    });

    gulp.task('build:js',function (){
        return browserify(config.script.main)
              .bundle()
              .pipe(source('bundle.js'))
              .pipe(gulp.dest(config.script.output));
    });

    gulp.task('views',function (){
      gulp.src(config.views.watch)
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(gulp.dest(config.views.output));
    });

    gulp.task('indexMain',function (){
    gulp.src(config.indexMain.watch)
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(gulp.dest(config.indexMain.output));
    });


    gulp.task('images',function (){
        gulp.src(config.image.watch)
                .pipe(imageop({
                    optimizationLevel : 5,
                    progressive:true,
                    interlaced: true
                }))
                .pipe(gulp.dest(config.image.output));
    });


    gulp.task('watch',function () {
      gulp.watch(config.image.watch,['images']);
      gulp.watch(config.styles.watch,['build:css']);
      gulp.watch(config.views.watch,['views']);
      gulp.watch(config.indexMain.watch,['indexMain']);
      gulp.watch(config.script.watch,['build:js']);
    });

    gulp.task('build', ['views','indexMain','build:css','build:js','images']);

    gulp.task('default',['server','watch','build']);



