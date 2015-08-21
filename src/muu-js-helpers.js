/**
 * Minimal implementation of an underscore/lodash subset.
 * @module muu-js-helpers
 */
define(function() {
    "use strict";

    /** @lends module:muu-js-helpers */
    var _ = {};

    /**
     * @param {object} value
     * @return {string}
     */
    var objToString = function(value) {
        return Object.prototype.toString.call(value);
    };

    /**
     * @param {*} value
     * @return {boolean}
     */
    _.isString = function(value) {
        return typeof value === 'string' || objToString(value) === '[object String]';
    };

    /**
     * @function
     * @param {*} value
     * @return {boolean}
     */
    _.isArray = Array.isArray;

    /**
     * @param {*} value
     * @return {boolean}
     */
    _.isFunction = function(value) {
        return typeof value === 'function';
    };

    /**
     * @param {function} fn
     * @return {function}
     */
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

    /**
     * @param {array} array
     * @param {*} value
     * @return {number}
     */
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

    /**
     * @param {array} array
     * @param {function} fn
     */
    _.forEach = function(array, fn) {
        if ('forEach' in array) {
            return array.forEach(fn);
        }

        for (var i = 0; i < array.length; i++) {
            fn(array[i]);
        }
    };

    /**
     * @param {array} array
     * @param {function} fn
     * @return {array}
     */
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

    /**
     * @param {array} array
     * @param {function} fn
     * @return {array}
     */
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

    /**
     * @param {array[]} arrays
     * @return {array}
     */
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

    /**
     * @param {array} a
     * @param {array} b
     * @return {array}
     */
    _.difference = function(a, b) {
        var results = [];
        for (var i = 0; i < a.length; i++) {
            if (_.indexOf(b, a[i]) === -1) {
                results.push(a[i]);
            }
        }
        return results;
    };

    /**
     * @param {array} a
     * @return {array}
     */
    _.flatten = function(a) {
        var o = [];
        _.forEach(a, function(item) {
            if (_.isArray(item)) {
                o = o.concat(_.flatten(item));
            } else {
                o.push(item);
            }
        });
        return o;
    };

    return _;
});
