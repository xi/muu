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
    };
});
