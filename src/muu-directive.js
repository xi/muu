/**
 * Exports the {@link Directive} class.
 * @module muu-directive
 */
define(['muu-dom-helpers', 'muu-js-helpers', 'muu-update-dom'], function($, _, updateDOM) {
    "use strict";

    /**
     * @constructs Directive
     * @param {DOMElement} root
     * @param {string} template
     * @param {Muu} registry
     */
    var Directive = function (root, template, registry) {
        var self = this;

        root.innerHTML = '<div></div>';

        var eventCallback = function(originalEvent) {
            var attrName = 'data-on' + originalEvent.type;
            if (originalEvent.target.hasAttribute(attrName)) {
                var eventName = originalEvent.target.getAttribute(attrName);
                var event = new CustomEvent('muu-' + eventName, {
                    detail: originalEvent
                });
                root.dispatchEvent(event);
            }
        };

        /**
         * @param {Object.<string, *>} data
         */
        this.update = function(data) {
            var tmp = document.createElement('div');
            tmp.innerHTML = registry.renderer(template, data);

            updateDOM(root.children[0], tmp);

            _.forEach(['keydown', 'keyup', 'click', 'change', 'search'], function(eventType) {
                var selector = '[data-on' + eventType + ']';
                _.forEach(self.querySelectorAll(selector), function(element) {
                    element.addEventListener(eventType, eventCallback, false);
                });
            });

            var updateEvent = new Event('muu-parent-update');
            var subDirectives = this.querySelectorAll('muu.muu-initialised');
            _.forEach(subDirectives, function(element) {
                element.dispatchEvent(updateEvent);
            });

            registry.linkAll(self);
        };

        /**
         * querySelectorAll
         *
         * @param {string} selector
         * @return {DOMElement[]} All child elements that match the given
         *     selector and are not isolated.
         */
        this.querySelectorAll = function(selector) {
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

        /**
         * @param {String} selector
         * @return {DOMElement}
         */
        this.querySelector = function(selector) {
            var all = self.querySelectorAll(selector);
            if (all.length > 0) {
                return all[0];
            }
        };

        /**
         * @return {Object.<string, string|number|boolean>}
         *//**
         * @param {string} name
         * @param {*} [_default]
         * @return {string|number|boolean|*}
         */
        this.getModel = function(name, _default) {
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

        /**
         * @param {string} name
         * @param {string|number|boolean} value
         */
        this.setModel = function(name, value) {
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
    };

    return Directive;
});
