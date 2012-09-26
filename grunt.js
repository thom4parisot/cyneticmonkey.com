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
    watch: {
      files: [
        'assets/less/**'
      ],
      tasks: [ 'less' ]
    }
  });

  // Default task.
  grunt.registerTask('default', 'less');

};
