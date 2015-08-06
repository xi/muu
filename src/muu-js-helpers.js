/**
 * Minimal implementation of an underscore/lodash subset.
 */
define(function() {
    "use strict";

    var _ = {};

    _.isString = function(s) {
        return s !== void 0 && s.trim !== void 0;
    };

    _.isArray = function(a) {
        return a !== void 0 && a.push !== void 0;
    };

    _.isFunction = function(f) {
        return f !== void 0 && f.call !== void 0;
    };

    _.once = function(fn) {
        var result;
        var called = false;

        return function() {
            if (!called) {
                result = fn.apply(this, arguments);
                called = true;
            }
            return result;
        };
    };

    _.indexOf = function(array, value) {
        if ('indexOf' in array) {
            return array.indexOf(value);
        }

        for (var i = 0; i < array.length; i++) {
            if (array[i] === value) {
                return i;
            }
        }
        return -1;
    };

    _.forEach = function(array, fn) {
        if ('forEach' in array) {
            return array.forEach(fn);
        }

        for (var i = 0; i < array.length; i++) {
            fn(array[i]);
        }
    };

    _.map = function(array, fn) {
        if ('map' in array) {
            return array.map(fn);
        }

        var results = [];
        for (var i = 0; i < array.length; i++) {
            results.push(fn(array[i]));
        }
        return results;
    };

    _.filter = function(array, fn) {
        if ('filter' in array) {
            return array.filter(fn);
        }

        var results = [];
        for (var i = 0; i < array.length; i++) {
            if (fn(array[i])) {
                results.push(array[i]);
            }
        }
        return results;
    };

    _.union = function(arrays) {
        var results = [];
        for (var i = 0; i < arrays.length; i++) {
            for (var j = 0; j < arrays[i].length; j++) {
                if (_.indexOf(results, arrays[i][j]) === -1) {
                    results.push(arrays[i][j]);
                }
            }
        }
        return results;
    };

    _.difference = function(a, b) {
        var results = [];
        for (var i = 0; i < a.length; i++) {
            if (_.indexOf(b, a[i]) === -1) {
                results.push(a[i]);
            }
        }
        return results;
    };

    return _;
});
