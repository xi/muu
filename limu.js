define(['mustache', 'jqlite', 'evmgr'], function(Mustache, $, EvMgr) {
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
                updateAttributes(target, source);
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

    return function(element, template) {
        var evmgr = new EvMgr();

        var eventCallback = function(event) {
            var attrName = 'data-on' + event.type;
            if (event.target.hasAttribute(attrName)) {
                var eventName = event.target.getAttribute(attrName);
                evmgr.trigger(eventName, event);
            }
        };

        this.update = function(data) {
            var tmp = document.createElement('div');
            tmp.innerHTML = Mustache.render(template, data);

            updateDOM(element, tmp);

            for (let eventType of ['keydown', 'click']) {
                var selector = '[data-on' + eventType + ']';
                this.querySelectorAll(selector).forEach(function(el) {
                    el.addEventListener(eventType, eventCallback);
                });
            }
        };

        this.querySelectorAll = function(selector) {
            var hits = $.toArray(element.querySelectorAll(selector));

            // NOTE: querySelectorAll returns all elements in the tree that
            // match the given selector.  findAll does the same with *relative
            // selectors* but does not seem to be available yet.
            var isolated = [];
            var isolations = $.toArray(element.querySelectorAll('.muu-isolate'));
            for (let isolation of isolations) {
                isolated = isolated.concat($.toArray(isolation.querySelectorAll(selector)));
            }

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
                    for (let i = 0; i < options.length; i++) {
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
                for (let i = 0; i < options.length; i++) {
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

        this.on = function(eventName, callback) {
            return evmgr.on(eventName, callback);
        };
    };
});
