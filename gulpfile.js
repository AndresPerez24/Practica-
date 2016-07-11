
var gulp          =   require('gulp'),
    gls           =   require('gulp-live-server'),
    sass          =   require('gulp-sass'),
    rename        =   require('gulp-rename'),
    uglify        =   require('gulp-uglify'),
    concat        =   require('gulp-concat'),
    autoprefixer  =   require('gulp-autoprefixer');

// -------------------------------------
//   Options
// -------------------------------------

var options = {

  // ----- Default ----- //

  default : {
    tasks : [ 'build', 'serve', 'watch' ]
  },

  // ----- Build ----- //

  build : {
    tasks : [ 'styles', 'scripts', 'vendors' ]
  },

  // ----- Styles ----- //

  styles : {
    files       : [ 'sass/**/*.scss' ],
    destination : 'application/assets/stylesheets'
  },

  // ----- Serve ----- //

  serve : {
    dir: 'application',
    port: 3000,
    files : ['application/*.html', 'application/assets/stylesheets/main.min.css', 'application/assets/javascripts/application.js']
  },

  // ----- Scripts ----- //

  scripts : {
    files       : [ 'javascripts/scripts/*.js' ],
    fileName : 'application.js',
    destination : 'application/assets/javascripts',
    minDestination: 'application/assets/javascripts'
  },

  // ----- Concant ----- //

  vendors : {
    files       : [ 'bower_components/jquery/dist/jquery.min.js' ],
    destination : 'application/assets/javascripts/vendor',
    fileName: 'vendor.min.js'
  }
  
};


// -------------------------------------
//   Task: Default
// -------------------------------------

gulp.task( 'default', options.default.tasks );

// -------------------------------------
//   Task: Build
// -------------------------------------

gulp.task( 'build', options.build.tasks );

// -------------------------------------
//   Task: Styles
// -------------------------------------

gulp.task('styles', function () {
  return gulp.src(options.styles.files, { noCache: true })
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(options.styles.destination));   
});

// -------------------------------------
//   Task: Watch
// -------------------------------------

gulp.task('watch', function() {
  gulp.watch(options.styles.files, ['styles']);
  gulp.watch(options.scripts.files, ['scripts']);
});

// -------------------------------------
//   Task: Live Reload Server
// -------------------------------------

gulp.task('serve', function() {
  var server = gls.static(options.serve.dir, options.serve.port);
  server.start(); 
  gulp.watch(options.serve.files, function (file) {
    server.notify.apply(server, [file]);
  });
});

// -------------------------------------
//   Task: Scripts
// -------------------------------------

gulp.task('scripts', function() {
  return gulp.src(options.scripts.files)
    .pipe(concat(options.scripts. fileName))
    .pipe(gulp.dest(options.scripts.destination))
    //.pipe(uglify())
    //.pipe(rename({ suffix: '.min' }))
    //.pipe(gulp.dest(options.scripts.minDestination));
});

// -------------------------------------
//   Task: Vendors
// -------------------------------------

gulp.task('vendors', function() {
  return gulp.src(options.vendors.files)
    .pipe(concat(options.vendors.fileName))
    .pipe(gulp.dest(options.vendors.destination));
});