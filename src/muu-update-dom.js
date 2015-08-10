/**
 * Recreate DOM `source` in `target` by making only small adjustments.
 *
 * *The following section explains details about the current implementation.
 * These are likely to change in the future.*
 *
 * The algorithms is relatively simple. It just iterates through all top level
 * nodes. If a node has a different `nodeType` (e.g. text or element) or a
 * different `nodeName` (e.g. div or ul) it is replaced completely and the
 * algorithm proceeds with the node's children recursively.  Otherwise, only
 * the nodes's attributes are updated.
 *
 * Note that non-attribute properties (e.g. value) are lost in the first case
 * and preserved in the second.
 *
 * If the algorithm encounters an element with the class `muu-isolate` it does
 * not recurse into its children. This way, you can protect dynamically
 * generated content from being overwritten.
 *
 * @module muu-update-dom
 * @param {DOMElement} target
 * @param {DOMElement} source
 */
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
