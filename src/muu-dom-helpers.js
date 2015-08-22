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
     * Cross browser custom events.
     *
     * See https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
     *
     * *Note*: IE does not seem to like it when you use existing event names
     * with this.
     *
     * @param {string} type
     * @param {*} detail
     * @return {DOMEvent}
     */
    $.createEvent = function(type, detail) {
        if (typeof CustomEvent === 'function') {
            return new CustomEvent(type, {
                detail: detail
            });
        } else {
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent(type, false, true, detail);
            return event;
        }
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
        if (document.readyState === 'complete') {
            _fn();
            return function() {};
        } else {
            var u1 = $.on(document, 'DOMContentLoaded', _fn);
            var u2 = $.on(window, 'load', _fn);
            return function() {
                u1();
                u2();
            };
        }
    };

    $.destroy = function(element, fn) {
        return $.on(element, 'DOMNodeRemovedFromDocument', fn);
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
