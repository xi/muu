/**
 * Exports the {@link Directive} class.
 * @module muu-directive
 */
define(['muu-dom-helpers', 'muu-js-helpers', 'muu-update-dom'], function($, _, updateDOM) {
    "use strict";

    /**
     * A directive is linked to a DOMElement and manages the DOM tree below
     * that element (excluding any isolated subtrees, e.g. those managed by
     * subdirectives).
     *
     * It provides a set of methods to interact with the managed part of the
     * DOM. This is separated into three distinct parts:
     *
     * - You can push data to the DOM using the {@link Directive#update}
     *   method. The DOM will than be updated using the template that was
     *   provided at construction.
     * - You can get data from the DOM using the {@link Directive#getModel}
     *   method. This is however restricted to form field by design.
     * - You can react to DOM events by specifying an alias for them. In the
     *   template, you might for example add the attribute
     *   `data-onclick="custom"` to an element. When there is `click` event on
     *   that element, a `muu-custom` event will be triggered on the
     *   directive's root element.
     *
     * Directives are typically not created directly but via {@link
     * Registry#link}.
     *
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
                var event = $.createEvent('muu-' + eventName, originalEvent);
                root.dispatchEvent(event);
            }
        };

        /**
         * Rerender `template` with `data` and push the changes to the DOM.
         *
         * See {@link module:muu-update-dom} for details. The templating system
         * can be defined in the {@link Registry}.
         *
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

            var updateEvent = $.createEvent('muu-parent-update');
            var subDirectives = this.querySelectorAll('muu.muu-initialised');
            _.forEach(subDirectives, function(element) {
                element.dispatchEvent(updateEvent);
            });

            registry.linkAll(self);
        };

        /**
         * A variant of `querySelectorAll` that returns only elements from
         * the managed part of the DOM.
         *
         * @private
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
         * A variant of `querySelector` that returns only elements from the
         * managed part of the DOM.
         *
         * @private
         * @param {String} selector
         * @return {DOMElement} First child element that matches the given
         *     selector and is not isolated.
         */
        this.querySelector = function(selector) {
            var all = self.querySelectorAll(selector);
            if (all.length > 0) {
                return all[0];
            }
        };

        /**
         * Get all model data as a flat object.
         *
         * @return {Object.<string, string|number|boolean>}
         *//**
         * Get the value of a form input by name.
         *
         * In case of a checkbox, returns `boolean`.
         * In case of radioboxes, returns the value of the selected box.
         *
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
         * Set the value of a form input by name.
         *
         * In case of a checkbox, sets `element.checked`.
         * In case of radioboxes, selects the box with matching value.
         *
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
