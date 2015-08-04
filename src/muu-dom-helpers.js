define(['muu-js-helpers'], function(_) {
    "use strict";

    return {
        on: function(element, eventName, callback) {
            element.addEventListener(eventName, callback);
            return function() {
                element.removeEventListener(eventName, callback);
            };
        },
        ready: function(fn) {
            var _fn = _.once(fn);
            if (document.readyState === "complete") {
                _fn();
            } else {
                document.addEventListener("DOMContentLoaded", _fn);
                window.addEventListener("load", _fn);
            }
        },
        getRadio: function(options) {
            for (var i = 0; i < options.length; i++) {
                if (options[i].checked) {
                    return options[i].value;
                }
            }
        },
        setRadio: function(options, value) {
            for (var i = 0; i < options.length; i++) {
                if (options[i].value === value) {
                    options[i].checked = true;
                    return;
                } else {
                    options[i].checked = false;
                }
            }
        }
    };
});
