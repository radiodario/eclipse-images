module.exports = function(grunt) {

  var distFolder = 'public'

  grunt.initConfig({

    clean: [distFolder],

    browserify: {
      all: {
        src: 'src/**/*.js',
        dest: distFolder+'/js/app.js'
      },
      options: {
        // transform: []
      }
    },

    less: {
      all: {
        src: 'styles/style.less',
        dest: distFolder+'/style.css'
      }
    },

    copy: {
      all: {
        src: ['*.css', '*.html', 'images/**/*', 'img/**/*', '!Gruntfile.js'],
        dest: distFolder + '/'
      }
    },

    watch: {
      options: {
        livereload: true
      },

      // html: {
      //   files: '<%= ejs.all.src %>',
      //   tasks: ['ejs'],
      // },

      js: {
        files: '<%= browserify.all.src %>',
        tasks: ['browserify'],
      },

      less: {
        files: '<%= less.all.src %>',
        tasks: ['less']
      },

      assets: {
        files: ['assets/**/*', '*.css', 'images/**/*', 'img/**/*', '!Gruntfile.js'],
        tasks: ['copy'],
      }
    },

  })

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['clean', 'less', 'browserify', 'copy']);

  grunt.registerTask('server', ['default', 'watch']);

};