define({
    ready: function(fn) {
        if (document.readyState === "complete") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }
});
