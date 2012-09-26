/*global module:false*/
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    less: {
      main: {
      files: {
        'assets/stylesheets/main.css': 'assets/less/*.less'
      },
      options: {
          paths: [
            'assets/less/components',
            'assets/vendor/bootstrap/less'
          ],
          yuicompress: true
        }
      }
    },
    concat: {
      main: {
        src: [
          'assets/vendor/bootstrap/docs/assets/js/jquery.js',
          'assets/vendor/bootstrap/js/bootstrap-carousel.js'
        ],
        dest: 'assets/js/main.js'
      }
    },
    min: {
      main: {
        src: '<config:concat.main.dest>',
        dest: 'assets/js/main.min.js'
      }
    },
    watch: {
      files: [
        'assets/less/**'
      ],
      tasks: [ 'less' ]
    }
  });

  // Default task.
  grunt.registerTask('default', 'less concat min');

};
