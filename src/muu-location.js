/**
 * angular inspired location service.
 * @module muu-location
 */
define('muu-location', ['muu-search'], function(q) {
    "use strict";

    /** @lends module:muu-location */
    var loc = {};

    /**
     * @return {string}
     * @nosideeffects
     */
    loc.absUrl = function() {
        return location.href;
    };

    /**
     * @return {string}
     * @nosideeffects
     *//**
     * @param {string} value
     * @param {boolean} [replace]
     * @return {muu-location}
     */
    loc.url = function(value, replace) {
        if (value === undefined) {
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
     * @nosideeffects
     */
    loc.protocol = function() {
        return location.protocol;
    };

    /**
     * @return {string}
     * @nosideeffects
     */
    loc.host = function() {
        return location.host;
    };

    /**
     * @return {string}
     * @nosideeffects
     */
    loc.port = function() {
        return location.port;
    };

    /**
     * @return {string}
     * @nosideeffects
     *//**
     * @param {string} value
     * @param {boolean} [replace]
     * @return {muu-location}
     */
    loc.path = function(value, replace) {
        if (value === undefined) {
            return location.pathname;
        } else {
            var url = value + location.search + location.hash;
            loc.url(url, replace);
            return loc;
        }
    };

    var _search = function(value, replace) {
        if (value === undefined) {
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
     * @return {Object}
     * @nosideeffects
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
        if (key !== undefined) {
            if (value !== undefined) {
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
     * @nosideeffects
     *//**
     * @param {string} value
     * @param {boolean} [replace]
     * @return {muu-location}
     */
    loc.hash = function(value, replace) {
        if (value === undefined) {
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
     * @param {Function} fn
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
     * @param {Function} fn
     * @return {muu-location}
     */
    loc.removeEventListener = function(eventName, fn) {
        if (eventName === 'change') {
            window.removeEventListener('popstate', fn, false);
        }
        return loc;
    };

    return loc;
});
