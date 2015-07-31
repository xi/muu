define(function() {
    "use strict";

    return {
        ready: function(fn) {
            if (document.readyState === "complete") {
                fn();
            } else {
                document.addEventListener("DOMContentLoaded", fn);
            }
        },
        toArray: function(a) {
            var tmp = [];
            for (let i = 0; i < a.length; i++) {
                tmp.push(a[i]);
            }
            return tmp;
        },
        getRadio: function(options) {
            for (let i = 0; i < options.length; i++) {
                if (options[i].checked) {
                    return options[i].value;
                }
            }
        },
        setRadio: function(options, value) {
            for (let i = 0; i < options.length; i++) {
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
