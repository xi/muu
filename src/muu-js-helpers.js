/**
 * Minimal implementation of an underscore/lodash subset.
 * @module muu-js-helpers
 */
define('muu-js-helpers', [], function() {
    "use strict";

    /** @lends module:muu-js-helpers */
    var _ = {};

    /**
     * @param {Object} value
     * @return {string}
     * @nosideeffects
     */
    var objToString = function(value) {
        return Object.prototype.toString.call(value);
    };

    /**
     * @param {*} value
     * @return {boolean}
     * @nosideeffects
     */
    _.isString = function(value) {
        return typeof value === 'string' || objToString(value) === '[object String]';
    };

    /**
     * @function
     * @param {*} value
     * @return {boolean}
     * @nosideeffects
     */
    _.isArray = Array.isArray;

    /**
     * @param {*} value
     * @return {boolean}
     * @nosideeffects
     */
    _.isFunction = function(value) {
        return typeof value === 'function';
    };

    /**
     * @param {Function} fn
     * @return {Function}
     * @nosideeffects
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
     * @param {Array} array
     * @param {*} value
     * @return {number}
     * @nosideeffects
     */
    _.indexOf = function(array, value) {
        if ('indexOf' in array) {
            return array.indexOf(value);
        }

        var l = array.length;
        for (var i = 0; i < l; i++) {
            if (array[i] === value) {
                return i;
            }
        }
        return -1;
    };

    /**
     * @param {Array} array
     * @param {Function} fn
     */
    _.forEach = function(array, fn) {
        if ('forEach' in array) {
            return array.forEach(fn);
        }

        var l = array.length;
        for (var i = 0; i < l; i++) {
            fn(array[i]);
        }
    };

    /**
     * @param {Array} array
     * @param {Function} fn
     * @return {Array}
     * @nosideeffects
     */
    _.map = function(array, fn) {
        if ('map' in array) {
            return array.map(fn);
        }

        var results = [];
        _.forEach(array, function(item) {
            results.push(fn(item));
        });
        return results;
    };

    /**
     * @param {Array} array
     * @param {Function} fn
     * @return {Array}
     * @nosideeffects
     */
    _.filter = function(array, fn) {
        if ('filter' in array) {
            return array.filter(fn);
        }

        var results = [];
        _.forEach(array, function(item) {
            if (fn(item)) {
                results.push(item);
            }
        });
        return results;
    };

    /**
     * @param {Array.<Array>} arrays
     * @return {Array}
     * @nosideeffects
     */
    _.union = function(arrays) {
        var results = [];
        _.forEach(arrays, function(array) {
            _.forEach(array, function(item) {
                if (_.indexOf(results, item) === -1) {
                    results.push(item);
                }
            });
        });
        return results;
    };

    /**
     * @param {Array} a
     * @param {Array} b
     * @return {Array}
     * @nosideeffects
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
     * @param {Array} a
     * @return {Array}
     * @nosideeffects
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
