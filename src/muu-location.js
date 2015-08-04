/**
 * angular inspired location service.
 */
define(function() {
    "use strict";

    var loc = {};

    loc.absUrl = function() {
        return location.href;
    };

    loc.url = function(value, replace) {
        if (value === void 0) {
            return location.pathname + location.search + location.hash;
        } else if (replace) {
            history.replaceState(null, null, value);
        } else {
            history.pushState(null, null, value);
        }
    };

    loc.protocol = function() {
        return location.protocol;
    };

    loc.host = function() {
        return location.host;
    };

    loc.port = function() {
        return location.port;
    };

    loc.path = function(value, replace) {
        if (value === void 0) {
            return location.pathname;
        } else {
            var url = value + location.search + location.hash;
            loc.url(url, replace);
        }
    };

    // TODO: decode/encode
    // TODO: set single values
    // NOTE: no value => get true
    // NOTE: set null value => delete
    loc.search = function(value, replace) {
        if (value === void 0) {
            return location.search;
        } else {
            var url = location.pathname + value + location.hash;
            loc.url(url, replace);
        }
    };

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
        }
    };

    loc.addEventListener = function(eventName, fn) {
        if (eventName === 'change') {
            window.addEventListener('popstate', fn);
        }
    };

    loc.removeEventListener = function(eventName, fn) {
        if (eventName === 'change') {
            window.removeEventListener('popstate', fn);
        }
    };

    return loc;
});
