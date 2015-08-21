/**
 * angular inspired location service.
 * @module muu-location
 */
define(['search'], function(q) {
    "use strict";

    /** @lends module:muu-location */
    var loc = {};

    /**
     * @return {string}
     */
    loc.absUrl = function() {
        return location.href;
    };

    /**
     * @return {string}
     *//**
     * @param {string} value
     * @param {boolean} [replace]
     * @return {muu-location}
     */
    loc.url = function(value, replace) {
        if (value === void 0) {
            return location.pathname + location.search + location.hash;
        } else if (replace) {
            history.replaceState(null, null, value);
        } else {
            history.pushState(null, null, value);
        }
        return loc;
    };

    /**
     * @return {string}
     */
    loc.protocol = function() {
        return location.protocol;
    };

    /**
     * @return {string}
     */
    loc.host = function() {
        return location.host;
    };

    /**
     * @return {string}
     */
    loc.port = function() {
        return location.port;
    };

    /**
     * @return {string}
     *//**
     * @param {string} value
     * @param {boolean} [replace]
     * @return {muu-location}
     */
    loc.path = function(value, replace) {
        if (value === void 0) {
            return location.pathname;
        } else {
            var url = value + location.search + location.hash;
            loc.url(url, replace);
            return loc;
        }
    };

    var _search = function(value, replace) {
        if (value === void 0) {
            return location.search;
        } else {
            if (value && value[0] !== '?') {
                value = '?' + value;
            }
            if (value.length === 1) {
                value = '';
            }

            var url = location.pathname + value + location.hash;
            loc.url(url, replace);
            return loc;
        }
    };

    /**
     * @return {object}
     *//**
     * @param {string|object} value
     * @return {muu-location}
     *//**
     * @param {string} key
     * @param {*} value
     * @param {boolean} [replace]
     * @return {muu-location}
     */
    loc.search = function(key, value, replace) {
        if (key !== void 0) {
            if (value !== void 0) {
                var search = q.parse(_search());
                search[key] = value;
                return _search(q.unparse(search), replace);
            } else {
                return _search(q.unparse(key), replace);
            }
        } else {
            return q.parse(_search());
        }
    };

    /**
     * @return {string}
     *//**
     * @param {string} value
     * @param {boolean} [replace]
     * @return {muu-location}
     */
    loc.hash = function(value, replace) {
        if (value === void 0) {
            if (location.hash) {
                return location.hash.slice(1);
            } else {
                return '';
            }
        } else {
            var url = location.pathname + location.search + '#' + value;
            loc.url(url, replace);
            return loc;
        }
    };

    /**
     * @param {string} eventName
     * @param {function} fn
     * @return {muu-location}
     */
    loc.addEventListener = function(eventName, fn) {
        if (eventName === 'change') {
            window.addEventListener('popstate', fn, false);
        }
        return loc;
    };

    /**
     * @param {string} eventName
     * @param {function} fn
     * @return {muu-location}
     */
    loc.removeEventListener = function(eventName, fn) {
        if (eventName === 'change') {
            window.removeEventListener('popstate', fn);
        }
        return loc;
    };

    return loc;
});
