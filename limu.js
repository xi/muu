define(['mustache', 'jqlite'], function(Mustache, $) {
    "use strict";

    var updateAttributes = function(target, source) {
        var targetAttrNames = $.toArray(target.attributes).map(function(item) {
            return item.name;
        });
        var sourceAttrNames = $.toArray(source.attributes).map(function(item) {
            return item.name;
        });

        for (name of targetAttrNames) {
            if (!source.hasAttribute(name)) {
                target.removeAttribute(name);
            }
        }
        for (name of sourceAttrNames) {
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
                updateAttributes(target, source);
            } else if (target.nodeType === 3) {
                target.nodeValue = source.nodeValue;
            }

            if (target.nodeType !== 1 || !target.classList.contains('muu-isolate')) {
                for (var i = 0; i < nt && i < ns; i++) {
                    updateDOM(target.childNodes[i], source.childNodes[i]);
                }
                for (var i = ns; i < nt; i++) {
                    target.removeChild(target.childNodes[ns]);
                }
                for (var i = nt; i < ns; i++) {
                    target.appendChild(source.childNodes[nt]);
                }
            }
        } else {
            target.parentNode.replaceChild(source, target);
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

        this.getModel = function(name) {
            if (name === void 0) {
                var model = {};
                for (el of this.querySelectorAll('[name]')) {
                    model[el.name] = this.getModel(el.name);
                }
                return model;
            } else {
                var el = this.querySelector('[name=' + name + ']');
                if (el.type === 'checkbox') {
                    return el.checked;
                } else if (el.type === 'radio') {
                    var options = this.querySelectorAll('[name=' + name + ']');
                    for (var i = 0; i < options.length; i++) {
                        if (options[i].checked) {
                            return options[i].value;
                        }
                    }
                } else {
                    return el.value;
                }
            }
        };

        this.setModel = function(name, value) {
            var el = this.querySelector('[name=' + name + ']');
            if (el.type === 'checkbox') {
                el.checked = value;
            } else if (el.type === 'radio') {
                var options = this.querySelectorAll('[name=' + name + ']');
                for (var i = 0; i < options.length; i++) {
                    if (options[i].value === value) {
                        options[i].checked = true;
                        return;
                    } else {
                        options[i].checked = false;
                    }
                }
            } else {
                el.value = value;
            }
        };
    };
});
