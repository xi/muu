define(['mustache', 'dom-helpers', 'js-helpers', 'evmgr', 'updateDOM'], function(Mustache, $, _, EvMgr, updateDOM) {  // jshint ignore:line
    "use strict";

    return function(root, template, registry) {
        var self = this;
        var evmgr = new EvMgr();

        var eventCallback = function(event) {
            var attrName = 'data-on' + event.type;
            if (event.target.hasAttribute(attrName)) {
                var eventName = event.target.getAttribute(attrName);
                evmgr.trigger(eventName, event);
            }
        };

        self.update = function(data) {
            var tmp = document.createElement('div');
            tmp.innerHTML = Mustache.render(template, data);

            updateDOM(root, tmp);

            _.forEach(['keydown', 'keyup', 'click', 'change', 'search'], function(eventType) {
                var selector = '[data-on' + eventType + ']';
                _.forEach(self.querySelectorAll(selector), function(element) {
                    element.addEventListener(eventType, eventCallback);
                });
            });

            registry.linkAll(self);
        };

        self.querySelectorAll = function(selector) {
            var hits = root.querySelectorAll(selector);

            // NOTE: querySelectorAll returns all elements in the tree that
            // match the given selector.  findAll does the same with *relative
            // selectors* but does not seem to be available yet.
            var isolations = root.querySelectorAll('.muu-isolate');
            var isolated = _.union(_.map(isolations, function(isolation) {
                return isolation.querySelectorAll(selector);
            }));

            return _.difference(hits, isolated);
        };

        self.querySelector = function(selector) {
            var all = self.querySelectorAll(selector);
            if (all.length > 0) {
                return all[0];
            }
        };

        self.getModel = function(name, _default) {
            if (name === void 0) {
                var model = {};
                _.forEach(self.querySelectorAll('[name]'), function(element) {
                    model[element.name] = self.getModel(element.name);
                });
                return model;
            } else {
                var element = self.querySelector('[name=' + name + ']');
                if (element.type === 'checkbox') {
                    return element.checked;
                } else if (element.type === 'radio') {
                    var options = self.querySelectorAll('[name=' + name + ']');
                    return $.getRadio(options) || _default;
                } else {
                    return element.value || _default;
                }
            }
        };

        self.setModel = function(name, value) {
            var element = self.querySelector('[name=' + name + ']');
            if (element.type === 'checkbox') {
                element.checked = value;
            } else if (element.type === 'radio') {
                var options = self.querySelectorAll('[name=' + name + ']');
                $.setRadio(options, value);
            } else {
                element.value = value;
            }
        };

        self.on = function(eventName, callback) {
            return evmgr.on(eventName, callback);
        };
    };
});
