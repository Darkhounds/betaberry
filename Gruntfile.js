'use strict';

module.exports = function(grunt)                                                {
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    
    grunt.initConfig({
        concat: {
            js: {
                files: {
                    'public/js/darkhounds.js': [
                        'src/net/darkhounds/core/js/module.js',
                        'src/net/darkhounds/core/js/factories/**/*.js'
                    ],
                    'public/js/application.js': [
                        'src/net/darkhounds/betaberry/cli/js/module.js',
                        'src/net/darkhounds/betaberry/cli/js/factories/**/*.js',
                        'src/net/darkhounds/betaberry/cli/js/services/**/*.js',
                        'src/net/darkhounds/betaberry/cli/js/directives/**/*.js',
                        'src/net/darkhounds/betaberry/cli/js/filters/**/*.js',
                        'src/net/darkhounds/betaberry/cli/js/controllers/**/*.js',
                        'src/net/darkhounds/betaberry/cli/js/plugins/**/*.js'
                    ]
                }
            }
        },
        copy: {
            html: {
                files: [
                    {src: 'src/net/darkhounds/betaberry/cli/html/index.html', dest: 'public/index.html'},
                    {cwd: 'src/net/darkhounds/betaberry/cli/html/templates', src: '**', dest: 'public/html/templates', expand: true},
                    {cwd: 'src/net/darkhounds/betaberry/cli/html/views', src: '**', dest: 'public/html/views', expand: true}
                ]
            }
        },
        compass: {
            css: {
                options: {
                    config:             'config/compass.rb',
                    environment:        'production',
                    outputStyle:        'nested',
                    noLineComments:     true
                }
            }
        },
        uglify: {
            dist:   {
                options:    {
                    beautify:   false,
                    compress:   { drop_console: true }
                },
                files:  [
                    {'public/js/darkhounds.js': 'public/js/darkhounds.js'},
                    {'public/js/application.js': 'public/js/application.js'}
                ]
                
            }
        },
        htmlmin:    {
          dist:         {
            options:        {
              removeComments:       true,
              collapseWhitespace:   true
            },
            files:          [{
                expand: true,
                cwd:    'public/html',
                src:    '**/*.html',
                dest:   'public/html'
            }]
          }
        }        
    });
    
    grunt.registerTask('default', ['concat:js', 'copy:html', 'compass:css']);
    grunt.registerTask('compress', ['uglify:dist', 'htmlmin:dist']);
};
