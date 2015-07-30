define({
    ready: function(fn) {
        if (document.readyState === "complete") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    },
    toArray: function(a) {
        var tmp = [];
        for (var i = 0; i < a.length; i++) {
            tmp.push(a[i]);
        }
        return tmp;
    }
});
