var gulp = require("gulp");
var path = require('path');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var browserify = require("browserify");
var tools = require('browserify-transform-tools');
//var deamdify = require('deamdify');
var uglify = require('gulp-uglify');
var stringify = require('stringify');
var babelify = require("babelify");

var production = process.env.NODE_ENV === 'production';

var templateOptions = 
  { appliesTo: { includeExtensions: [".html"] }, minify: true };
var extractTemplate = makeExtractTemplate(templateOptions);
var stringifyTemplate = stringify(templateOptions); 

var config = 
{
  basedir: "./src",
  target: "./dist/",
  
  bundles:
  {
    app: 
    {
      hasExports: true,
      entries: "./main.js",
      //require: [[{file: "./templates", expose: false}]],
      external: "angular",
      transform: [extractTemplate, stringifyTemplate, babelify/*, deamdify*/]
    },
    angular: 
    {
      hasExports: true, // this is to force to assign to global require.
      require:
      [
        [
          {
            file: production ? "angular/angular.min" : "angular/angular",
            expose: "./angular"
          }
        ]
      ],
      minify: false
    }
  },
  
  //[ { basedir: "...", module: "...", files: ["..."], target: "..." } , ...]
  resources: "index.html"
};


gulp.task("default", ["resources", "bundles"]);
gulp.task("resources", () => resources(config));
gulp.task("bundles", () => bundles(config));

function resources(config)
{
  return Promise.all(array(config.resources).map(resource =>
  {
    if (typeof resource === "string")
    {
      resource = { files: resource };
    }

    if (!resource.files)
    {
      return;
    }
    
    var src = path.resolve(
      resource.basedir || config.basedir || "",
      resource.module ?
        path.resolve(require.resolve(resource.module), "..") : "");
    
    var target = path.resolve(resource.target || config.target || "");
    
    var stream = gulp.src(resource.files, { cwd: src }).
      pipe(gulp.dest(target));

    return streamPromise(stream);  
  }));
}

function bundles(config)
{
  var bundles = {};
  var names = Object.keys(config.bundles || {});
  
  names.forEach(name =>
  {
    var options = Object.assign({ debug: true }, config.bundles[name]);

    options.basedir = path.resolve(options.basedir || config.basedir || "");
    options.b = browserify(options);
    bundles[name] = options;
  });
  
  names.forEach(name =>
    array(bundles[name].external).forEach(external =>
      bundles[name].b.external(
        bundles[external] ? bundles[external].b : external)));
  
  return Promise.all(names.map(name =>
  {
    var options = bundles[name];
    var minify = options.minify;
    var target = path.resolve(options.target || config.target || "");
    
    var stream = options.b.bundle().
      pipe(source(name + ".js")).
      pipe(buffer()).
      pipe(sourcemaps.init({loadMaps: true}));
  
    if (minify !== undefined ? minify : production)
    {
      stream = stream.pipe(uglify());
    }
  
    stream = stream.pipe(sourcemaps.write(".")).pipe(gulp.dest(target));

    return streamPromise(stream); 
  }));
}

function makeExtractTemplate(options)
{
  return tools.makeStringTransform(
    "extractTemplate", 
    options,
    (contents, transformOptions, done) =>
    {
      var result = /<body[^>]*>([^]*)<\/body>/i.exec(contents);
      
      done(null, result ? result[1] : contents); 
    });
}

function streamPromise(stream)
{
  return new Promise(resolve => stream.on("end", resolve));
}

function array(value)
{
  return Array.isArray(value) ? value : !value ? [] : [value]; 
}
