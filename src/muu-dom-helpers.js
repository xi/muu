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

    return {
        escapeHtml: function(string) {
            return String(string).replace(/[&<>"'\/]/g, function(s) {
                return entityMap[s];
            });
        },
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
                } else {
                    options[i].checked = false;
                }
            }
        }
    };
});
