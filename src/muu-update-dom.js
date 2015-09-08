/**
 * Recreate `html` in `target` by making only small adjustments.
 *
 * *The following section explains details about the current implementation.
 * These are likely to change in the future.*
 *
 * The algorithms is relatively simple. It just iterates through all top level
 * nodes. If a node has a different `nodeType` (e.g. text or element) or a
 * different `nodeName` (e.g. div or ul) it is replaced completely. Otherwise,
 * only the nodes's attributes are updated and the algorithm proceeds with the
 * node's children recursively.
 *
 * Note that non-attribute properties (e.g. `value`) are lost in the first case
 * and preserved in the second.
 *
 * If the algorithm encounters an element with the class `muu-isolate` it does
 * not recurse into its children. This way, you can protect dynamically
 * generated content from being overwritten.
 *
 * All classes prefixed with `muu-` will be preserved.
 *
 * @module muu-update-dom
 * @param {Node} target
 * @param {string} html
 */
define('muu-update-dom', ['muu-js-helpers'], function(_) {
    "use strict";

    var updateAttributes = function(target, source) {
        var targetAttrNames = _.map(target.attributes, function(item) {
            return item.name;
        });
        var sourceAttrNames = _.map(source.attributes, function(item) {
            return item.name;
        });

        _.forEach(targetAttrNames, function(name) {
            // NOTE: ie8.js creates some attribute
            if (!source.hasAttribute(name) && name.substr(0, 7) !== '__IE8__') {
                target.removeAttribute(name);
            }
        });
        _.forEach(sourceAttrNames, function(name) {
            if (target.getAttribute(name) !== source.getAttribute(name)) {
                target.setAttribute(name, source.getAttribute(name));
            }
        });
    };

    var updateDOM = function(target, source) {
        var nt = target.childNodes.length;
        var ns = source.childNodes.length;
        var offset = 0;

        for (var i = ns; i < nt; i++) {
            target.removeChild(target.childNodes[ns]);
        }
        for (i = nt; i < ns; i++) {
            target.appendChild(source.childNodes[nt]);
        }
        for (i = 0; i < nt && i < ns; i++) {
            var tchild = target.childNodes[i];
            var schild = source.childNodes[i - offset];

            if (tchild.nodeType === schild.nodeType && tchild.nodeName === schild.nodeName && tchild.type === schild.type) {
                if (tchild.nodeType === 1) {
                    var muuClasses = _.filter(tchild.classList, function(cls) {
                        return cls.lastIndexOf('muu-', 0) === 0;
                    });
                    updateAttributes(tchild, schild);
                    _.forEach(muuClasses, function(cls) {
                        tchild.classList.add(cls);
                    });
                } else if (tchild.nodeType === 3) {
                    tchild.nodeValue = schild.nodeValue;
                }
                if (tchild.nodeType !== 3 && !tchild.classList.contains('muu-isolate')) {
                    updateDOM(tchild, schild);
                }
            } else {
                tchild.parentNode.replaceChild(schild, tchild);
                offset += 1;
            }
        }
    };

    return function(target, html) {
        var tmp = document.createElement('div');
        tmp.innerHTML = html;

        updateDOM(target, tmp);
    }
});
