/**
 * angular inspired location service.
 * @module muu-location
 */
define(function() {
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

    // TODO: decode/encode
    // TODO: set single values
    // NOTE: no value => get true
    // NOTE: set null value => delete
    /**
     * @return {string}
     *//**
     * @param {string} value
     * @param {boolean} [replace]
     * @return {muu-location}
     */
    loc.search = function(value, replace) {
        if (value === void 0) {
            return location.search;
        } else {
            var url = location.pathname + value + location.hash;
            loc.url(url, replace);
            return loc;
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
