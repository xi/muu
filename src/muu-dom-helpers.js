/**
 * DOM related helper functions
 * @module muu-dom-helpers
 */
define("muu-dom-helpers", ['muu-js-helpers'], function(_) {
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

    $.DELAY = 1000;

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
     * *Note*: IE does not seem to like it when you use existing event names
     * with this.
     *
     * @param {string} type
     * @param {*} detail
     * @return {Event}
     * @see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
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
     * @param {EventTarget} element
     * @param {string} eventName
     * @param {Function} callback
     * @return {function()} An unregister function
     */
    $.on = function(element, eventName, callback) {
        element.addEventListener(eventName, callback, false);
        return function() {
            element.removeEventListener(eventName, callback, false);
        };
    };

    /**
     * @param {Function} fn
     * @return {function()} An unregister function
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

    /**
     * @param {Node} desc
     * @param {Node} root
     * @return {boolean}
     */
    $.isDescendant = function(desc, root) {
         return !!desc && (desc === root || $.isDescendant(desc.parentNode, root));
    };

    /**
     * Execute a function when `element` is removed from the DOM.
     *
     * *Note*: The callback is not executed directly when (or even before) the
     * element is removed but with a slight delay. So the only way to test this
     * is to use a timeout in the test.
     *
     * @param {Element} element
     * @param {Function} fn
     * @return {function()} An unregister function
     */
    $.destroy = function(element, fn) {
        var unregister;

        if (!!window.MutationObserver) {
            var observer = new MutationObserver(function() {
                if (!$.isDescendant(element, document)) {
                    fn();
                    unregister();
                }
            });

            observer.observe(document, {
                 childList: true,
                 subtree: true
            });

            unregister = _.once(function() {
                observer.disconnect();
                observer = undefined;
            });
        } else {
            var intervalID = setInterval(function() {
                if (!$.isDescendant(element, document)) {
                    fn();
                    unregister();
                }
            }, $.DELAY);

            unregister = function() {
                clearInterval(intervalID);
            };
        }

        return unregister;
    };

    /**
     * @param {Array.<Element>} options
     * @return {string}
     * @suppress {missingReturn}
     */
    $.getRadio = function(options) {
        for (var i = 0; i < options.length; i++) {
            if (options[i].checked) {
                return options[i].value;
            }
        }
    };

    /**
     * @param {Array.<Element>} options
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
