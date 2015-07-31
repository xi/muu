define(['jqlite'], function($) {
    "use strict";

    var updateAttributes = function(target, source) {
        var targetAttrNames = $.toArray(target.attributes).map(function(item) {
            return item.name;
        });
        var sourceAttrNames = $.toArray(source.attributes).map(function(item) {
            return item.name;
        });

        for (let name of targetAttrNames) {
            if (!source.hasAttribute(name)) {
                target.removeAttribute(name);
            }
        }
        for (let name of sourceAttrNames) {
            target.setAttribute(name, source.getAttribute(name));
        }
    };

    /**
     * Recreate DOM `source` in `target` by making only small adjustments.
     */
    var updateDOM = function(target, source) {
        var nt = target.childNodes.length;
        var ns = source.childNodes.length;

        if (target.nodeType === source.nodeType && target.nodeName === source.nodeName) {
            if (target.nodeType === 1) {
                var muuClasses = $.toArray(target.classList).filter(function(cls) {
                    return cls.startsWith('muu-');
                });
                updateAttributes(target, source);
                for (let cls of muuClasses) {
                    target.classList.add(cls);
                }
            } else if (target.nodeType === 3) {
                target.nodeValue = source.nodeValue;
            }

            if (target.nodeType !== 1 || !target.classList.contains('muu-isolate')) {
                for (let i = 0; i < nt && i < ns; i++) {
                    updateDOM(target.childNodes[i], source.childNodes[i]);
                }
                for (let i = ns; i < nt; i++) {
                    target.removeChild(target.childNodes[ns]);
                }
                for (let i = nt; i < ns; i++) {
                    target.appendChild(source.childNodes[nt]);
                }
            }
        } else {
            target.parentNode.replaceChild(source, target);
        }
    };

    return updateDOM;
});
