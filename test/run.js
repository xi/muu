mocha.setup('bdd');

if (location.search.indexOf('coverage=no') === -1) {
    blanket.options('filter', 'muu');
} else {
    blanket.options('filter', 'nonexistent');
}

require({
    baseUrl: '../src/'
}, [
    'muu-dom-helpers',
    '../test/test-dom-helpers',
    '../test/test-js-helpers.js',
    '../test/test-template.js',
    '../test/test-update-dom',
    '../test/test-search',
    '../test/test-directive',
    '../test/test-registry'
], function ($) {
    $.DELAY = 5;

    mocha.checkLeaks();
    mocha.globals(['mochaResulsts']);
    var runner = mocha.run();

    // generate output for saucelabs
    var flattenTitles = function(test) {
        var titles = [];
        while (test.parent.title) {
            titles.push(test.parent.title);
            test = test.parent;
        }
        return titles.reverse();
    };

    var failedTests = [];
    var logFailure = function(test, err) {
        failedTests.push({
            name: test.title,
            result: false,
            message: err.message,
            stack: err.stack,
            titles: flattenTitles(test)
        });
    };

    runner.on('fail', logFailure);
    runner.on('end', function(){
        window.mochaResults = runner.stats;
        window.mochaResults.reports = failedTests;
    });
});
