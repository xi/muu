/**
 * DOM related helper functions
 * @module muu-dom-helpers
 */
define(['muu-js-helpers'], function(_) {
    "use strict";

    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;'
    };

    /** @lends module:muu-dom-helpers */
    var $ = {};

    /**
     * @param {string} string
     * @return {string} - escaped HTML
     */
    $.escapeHtml = function(string) {
        return String(string).replace(/[&<>"'\/]/g, function(s) {
            return entityMap[s];
        });
    };

    /**
     * @param {DOMElement} element
     * @param {string} eventName
     * @param {function} callback
     * @returns {Function()} An unregister function
     */
    $.on = function(element, eventName, callback) {
        element.addEventListener(eventName, callback, false);
        return function() {
            element.removeEventListener(eventName, callback, false);
        };
    };

    /**
     * @param {function} fn
     */
    $.ready = function(fn) {
        var _fn = _.once(fn);
        if (document.readyState === "complete") {
            _fn();
        } else {
            document.addEventListener("DOMContentLoaded", _fn, false);
            window.addEventListener("load", _fn, false);
        }
    };

    /**
     * @param {DOMElement[]} options
     * @return {string}
     */
    $.getRadio = function(options) {
        for (var i = 0; i < options.length; i++) {
            if (options[i].checked) {
                return options[i].value;
            }
        }
    };

    /**
     * @param {DOMElement[]} options
     * @param {string} value
     */
    $.setRadio = function(options, value) {
        for (var i = 0; i < options.length; i++) {
            if (options[i].value === value) {
                options[i].checked = true;
            } else {
                options[i].checked = false;
            }
        }
    };

    return $;
});
