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

    var forOwn = function(tree, fn) {
        _.forEach(tree.keys, function(pos) {
            fn(pos, tree[pos]);
        });
    };

    var updateAttributes = function(target, source) {
        var muuClasses = _.filter(target.classList, function(cls) {
            return cls.lastIndexOf('muu-', 0) === 0;
        });
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
        _.forEach(muuClasses, function(cls) {
            target.classList.add(cls);
        });
    };

    var equivalent = function(a, b) {
        return a.nodeType === b.nodeType
            && a.nodeName === b.nodeName
            && a.type === b.type
            && a.id === b.id
            && a.name === b.name;
    };

    var buildTree = function(node, tree, position) {
        position = position || '0';
        tree = tree || {keys: []};

        _.forEach(node.childNodes, function(child, i) {
            var p = position + '.' + i;
            tree[p] = {
                node: child,
                parent: position,
                index: i
            };
            tree.keys.push(p);
            if (child.nodeType !== 3 && !child.classList.contains('muu-isolate')) {
                buildTree(child, tree, p);
            }
        });

        return tree;
    };

    var match = function(ttree, stree) {
        var ttreeKeysClone = ttree.keys.concat();
        forOwn(stree, function(spos, s) {
            var l = ttreeKeysClone.length;
            for (var i = 0; i < l; i++) {
                var t = ttree[ttreeKeysClone[i]];
                if (equivalent(t.node, s.node)) {
                    t.source = s;
                    s.target = t;
                    t.node.__index = s.index;
                    ttreeKeysClone.splice(i, 1);
                    break;
                }
            }
        });
    };

    var sortDOM = function(parent) {
        var getPosition = function(index) {
            for (var i = 0; i < parent.childNodes.length; i++) {
                var child = parent.childNodes[i];
                if (child.__index > index) {
                    return i;
                }
            }
        };

        var max = -1;
        for (var i = 0; i < parent.childNodes.length; i++) {
            var child = parent.childNodes[i];
            if (child.__index < max) {
                var j = getPosition(child.__index)
                parent.insertBefore(child, parent.childNodes[j]);
            } else {
                max = child.__index;
            }
        }

        _.forEach(parent.childNodes, function(child) {
            delete child.__index;
        });
    };

    var updateDOM = function(target, source) {
        var ttree = buildTree(target);
        var stree = buildTree(source);
        match(ttree, stree);

        var s0 = {
            node: source
        };
        var t0 = {
            node: target
        };
        s0.target = t0;
        t0.source = s0;

        var getSource = function(spos) {
            return spos === '0' ? s0 : stree[spos];
        };

        var getTarget = function(tpos) {
            return tpos === '0' ? t0 : ttree[tpos];
        };

        // delete
        forOwn(ttree, function(tpos, t) {
            if (!t.source) {
                t.node.parentNode.removeChild(t.node);
            }
        });

        // insert
        forOwn(stree, function(spos, s) {
            if (!s.target) {
                s.node.innerHTML = '';
                if (s.parent === '0') {
                    target.appendChild(s.node);
                } else {
                    // FIXME: is it guaranteed that parent is not undefined?
                    // yes if stree is iterated alphanumerically
                    var parent = getSource(s.parent).target;
                    parent.node.appendChild(s.node);
                }
                s.target = s;
                s.node.__index = s.index;
            }
        });

        // move
        forOwn(ttree, function(tpos, t) {
            if (t.source) {
                if (getTarget(t.parent).source !== getSource(t.source.parent)) {
                    var parent = getSource(t.source.parent).target;
                    parent.node.appendChild(t.node);
                }

                if (t.node.nodeType === 1) {
                    updateAttributes(t.node, t.source.node);
                } else if (t.node.nodeType === 3) {
                    t.node.nodeValue = t.source.node.nodeValue;
                }
            }
        });

        // sort
        sortDOM(target);
        forOwn(stree, function(spos, s) {
            sortDOM(s.target.node);
        });
    };

    return function(target, html) {
        var tmp = document.createElement('div');
        tmp.innerHTML = html;

        updateDOM(target, tmp);
    }
});
