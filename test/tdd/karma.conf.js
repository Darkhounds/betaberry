// Karma configuration
// Generated on Thu Nov 20 2014 11:55:18 GMT+0000 (GMT Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'sinon-chai'],
      
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'src/**/*.html': ['ng-html2js']
    },

    // list of files / patterns to load in the browser
    files: [
      'public/libs/jquery/jquery-2.1.0.js',
      'public/libs/angular/**/angular.js',
      'public/libs/angular/**/angular-mocks.js',
      'src/**/module.js',
      'src/**/*.js',
      'src/**/*.html',
      'test/**/mocha.*.js'
    ],
    
    // list of files to exclude
    exclude: [
    ],
    
    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/net/darkhounds/betaberry/cli/',
      moduleName: 'betaberry.darkhounds.net'
    },      
      
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
