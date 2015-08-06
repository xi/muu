define(['muu-js-helpers'], function(_) {
    "use strict";

    var updateAttributes = function(target, source) {
        var targetAttrNames = _.map(target.attributes, function(item) {
            return item.name;
        });
        var sourceAttrNames = _.map(source.attributes, function(item) {
            return item.name;
        });

        _.forEach(targetAttrNames, function(name) {
            if (!source.hasAttribute(name)) {
                target.removeAttribute(name);
            }
        });
        _.forEach(sourceAttrNames, function(name) {
            target.setAttribute(name, source.getAttribute(name));
        });
    };

    /**
     * Recreate DOM `source` in `target` by making only small adjustments.
     */
    var updateDOM = function(target, source) {
        var nt = target.childNodes.length;
        var ns = source.childNodes.length;

        if (target.nodeType === source.nodeType && target.nodeName === source.nodeName) {
            if (target.nodeType === 1) {
                var muuClasses = _.filter(target.classList, function(cls) {
                    return cls.lastIndexOf('muu-', 0) === 0;
                });
                updateAttributes(target, source);
                _.forEach(muuClasses, function(cls) {
                    target.classList.add(cls);
                });
            } else if (target.nodeType === 3) {
                target.nodeValue = source.nodeValue;
            }

            if (target.nodeType !== 1 || !target.classList.contains('muu-isolate')) {
                for (var i = ns; i < nt; i++) {
                    target.removeChild(target.childNodes[ns]);
                }
                for (i = nt; i < ns; i++) {
                    target.appendChild(source.childNodes[nt]);
                }
                for (i = 0; i < nt && i < ns; i++) {
                    updateDOM(target.childNodes[i], source.childNodes[i]);
                }
            }
        } else {
            target.parentNode.replaceChild(source, target);
        }
    };

    return updateDOM;
});
