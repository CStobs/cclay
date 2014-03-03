/*global module:false*/

/**
 * Grunt configuration for executing tasks in sonic viz framework
 */
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
		appName: 'cityclay',
		targetDir: 'build',
        uiDir: 'ui',
		srcFiles: ['<%= uiDir %>/js/**/*.js'],
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= grunt.option(\"version\") %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: '<%= srcFiles %>',
                dest: 'build/js/<%= appName %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'build/js/<%= appName %>.min.js'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            src: {
                src: '<%= uiDir %>/js',
                options: {
                    ignores: []
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Release v%VERSION%',
                push: true,
                pushTo: 'origin master',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
            }
        },
        stylus: {
            build: {
                src: ['<%= uiDir %>/stylus/main.styl'],
                dest: '<%= targetDir %>/css/style.css',
                options: {
                    compress: true,
                    'include css': true
                }
            }
        }
    });

    grunt.registerTask('update-version', 'Updates global version config', function () {
        var pkg = grunt.file.readJSON('package.json');
        grunt.option("version", pkg.version);
    });

    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-html2js');

    // Default task.
    grunt.registerTask('default', ['jshint', 'update-version', 'stylus:build', 'concat', 'uglify']);
    //Tags current version and bumps patch version.
    grunt.registerTask('release-patch', ['jshint', 'bump-only:patch', 'default', 'bump-commit']);
    //Tags current version and bumps minor version.
    grunt.registerTask('release-minor', ['jshint', 'bump-only:minor', 'default', 'bump-commit']);
    //Tags current version and bumps major version.
    grunt.registerTask('release-major', ['jshint', 'bump-only:major', 'default', 'bump-commit']);
};