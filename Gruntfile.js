module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      audio5: {
        src: './<%= pkg.name %>.js',
        dest: './<%= pkg.name %>.min.js'
      },
      playlist5: {
        src: './playlist5.js',
        dest: './playlist5.min.js'
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        files: {
          './<%= pkg.name %>.js': ['./src/<%= pkg.name %>.js'],
          './playlist5.js': ['./src/playlist5.js']
        }
      }
    },
    jshint: {
      files: ["./src/<%= pkg.name %>.js", './src/playlist5.js'],
      options: {
        "curly": true,
        "eqeqeq": true,
        "forin": true,
        "indent": 2,
        "latedef": true,
        "newcap": true,
        "regexp": true,
        "unused": true,
        "undef": true,
        "strict": true,
        "asi": false,
        "boss": false,
        "debug": false,
        "devel": false,
        "evil": false,
        "eqnull": false,
        "white": false,
        "sub": true,
        "shadow": false,
        "node": true,
        "browser": true,
        "wsh": true
      }
    },
    bump: {
      options: {},
      files: [ 'package.json', 'bower/component.json' ]
    },
    exec: {
      copy_bower: {
        cmd: 'cp ./*.js ./bower/; cp ./swf/*.swf ./bower/'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-bumpx');
  grunt.loadNpmTasks('grunt-exec');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat', 'uglify:audio5', 'uglify:playlist5']);
  grunt.registerTask('bower', ['jshint', 'concat', 'uglify', 'exec:copy_bower']);
  grunt.registerTask('release', ['jshint', 'concat', 'uglify', 'exec:copy_bower', 'bump::patch']);

};