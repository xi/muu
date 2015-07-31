define(['mustache', 'dom-helpers', 'evmgr', 'updateDOM'], function(Mustache, $, EvMgr, updateDOM) {
    "use strict";

    return function(root, template, registry) {
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

            updateDOM(root, tmp);

            for (let eventType of ['keydown', 'click']) {
                var selector = '[data-on' + eventType + ']';
                this.querySelectorAll(selector).forEach(function(element) {
                    element.addEventListener(eventType, eventCallback);
                });
            }

            registry.linkAll(this);
        };

        this.querySelectorAll = function(selector) {
            var hits = $.toArray(root.querySelectorAll(selector));

            // NOTE: querySelectorAll returns all elements in the tree that
            // match the given selector.  findAll does the same with *relative
            // selectors* but does not seem to be available yet.
            var isolated = [];
            var isolations = $.toArray(root.querySelectorAll('.muu-isolate'));
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
                for (element of this.querySelectorAll('[name]')) {
                    model[element.name] = this.getModel(element.name);
                }
                return model;
            } else {
                var element = this.querySelector('[name=' + name + ']');
                if (element.type === 'checkbox') {
                    return element.checked;
                } else if (element.type === 'radio') {
                    var options = this.querySelectorAll('[name=' + name + ']');
                    return $.getRadio(options);
                } else {
                    return element.value;
                }
            }
        };

        this.setModel = function(name, value) {
            var element = this.querySelector('[name=' + name + ']');
            if (element.type === 'checkbox') {
                element.checked = value;
            } else if (element.type === 'radio') {
                var options = this.querySelectorAll('[name=' + name + ']');
                $.setRadio(options, value);
            } else {
                element.value = value;
            }
        };

        this.on = function(eventName, callback) {
            return evmgr.on(eventName, callback);
        };
    };
});
