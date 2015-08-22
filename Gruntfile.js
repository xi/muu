var util = require( "util" );

module.exports = function (grunt) {
    var colored = function(s, color) {
        return grunt.log.wordlist([s], {color: color});
    };

    function reportError(error, trace) {
        var title = error.titles.join(' ');
        var name = colored(error.name, 'grey');
        grunt.log.writeln(title, name);
        grunt.log.error(error.message);
    };

    function reportProgress(notification) {
        switch (notification.type) {
        case 'jobCompleted':
            grunt.log.subhead(notification.platform);
            grunt.log.writeln(notification.jobUrl);

            var result = notification.result;
            if (typeof result === 'string') {
                grunt.log.error(result);
            } else {
                grunt.log.ok(util.format('%d tests completed (%dms)', result.tests, result.duration));

                if (result.failures > 0) {
                    var s = util.format('%d tests failing', result.failures);
                    grunt.log.writeln(colored(s, 'red'));
                }
                if (result.pending > 0) {
                    var s = util.format('%d tests pending', result.pending);
                    grunt.log.writeln(colored(s, 'yellow'));
                }

                if (result.reports.length) {
                    grunt.log.writeln('');
                    result.reports.forEach(reportError);
                }
            }

            break;
        }
    }

    var browsers = [{
        browserName: 'firefox',
        platform: 'XP',
        version: '31'
    }, {
        browserName: 'firefox',
        platform: 'linux'
    }, {
        browserName: 'safari',
        platform: 'OS X 10.11'
    }, {
        browserName: 'googlechrome'
    }, {
        browserName: 'internet explorer',
        platform: 'XP',
        version: '8'
    }, {
        browserName: 'internet explorer',
        version: '9'
    }, {
        browserName: 'internet explorer',
        version: '10'
    }, {
        browserName: 'internet explorer',
        version: '11'
    }, {
        browserName: 'iphone'
    }, {
        browserName: 'android',
        version: '4.3'
    }];

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    base: '',
                    port: 9999
                }
            }
        },

        'saucelabs-mocha': {
            all: {
                options: {
                    urls: [
                        'http://127.0.0.1:9999/test/'
                    ],
                    browsers: browsers,
                    build: process.env.TRAVIS_JOB_ID,
                    testname: process.env.TRAVIS_REPO_SLUG + '/' + process.env.TRAVIS_JOB_NUMBER,
                    throttled: 3,
                    sauceConfig: {
                        'max-duration': 25,
                        'video-upload-on-pass': false
                    },
                    onProgress: reportProgress
                }
            }
        },
        watch: {}
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-saucelabs');

    grunt.registerTask('default', ['connect', 'saucelabs-mocha']);
};
