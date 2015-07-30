define(['mustache'], function(Mustache) {
    "use strict";

    /**
     * Recreate DOM `source` in `target` by making only small adjustments.
     */
    var updateDOM = function(target, source) {
        var nt = target.childNodes.length;
        var ns = source.childNodes.length;

        if (target.nodeType === source.nodeType && target.nodeName === source.nodeName) {
            // FIXME
            // if (target.nodeType === 1) {
            //     target.attributes = source.attributes;
            if (target.nodeType === 3) {
                target.nodeValue = source.nodeValue;
            }
            if (target.nodeName === 'INPUT') {
                target.value = source.value;
            }

            for (var i = 0; i < nt && i < ns; i++) {
                updateDOM(target.childNodes[i], source.childNodes[i]);
            }
            for (var i = ns; i < nt; i++) {
                target.removeChild(target.childNodes[ns]);
            }
            for (var i = nt; i < ns; i++) {
                target.appendChild(source.childNodes[nt]);
            }
        } else {
            target.parentNode.replaceChild(target, source);
        }
    };

    return function(element, template) {
        this.update = function(data) {
            var tmp = document.createElement('div');
            tmp.innerHTML = Mustache.render(template, data);

            updateDOM(element, tmp);
        };

        this.querySelectorAll = function(selector) {
            var hits = $.toArray(element.querySelectorAll(selector));
            var isolated = $.toArray(element.querySelectorAll('.muu-isolate ' + selector));
            return hits.filter(function(e) {
                return isolated.indexOf(e) < 0;
            });
        };

        this.querySelector = function(selector) {
            var all = this.querySelectorAll(selector);
            if (all.length > 0) {
                return all[0]
            }
        };
    };
});
