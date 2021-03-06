/**
 * Exports the {@link Directive} class.
 * @module directive
 * @ignore
 */
define('directive', ['dom-helpers', 'js-helpers'], function($, _) {
    "use strict";

    /**
     * A directive is linked to a Element and manages the DOM tree below
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
     *   that element, a `custom` event will be triggered on the directive. See
     *   {@link Directive#on}.
     *
     * Directives are typically not created directly but via {@link
     * Registry#link}.
     *
     * @constructs Directive
     * @param {Element} root
     * @param {string} template
     * @param {Registry} registry
     */
    var Directive = function(root, template, registry) {
        var self = this;

        root.innerHTML = '';

        var eventCallback = function(originalEvent) {
            var element = originalEvent.currentTarget;
            var attrName = 'data-on' + originalEvent.type;
            var selector = '[' + attrName + ']';
            if (_.indexOf(self.querySelectorAll(selector), element) !== -1) {
                var eventName = element.getAttribute(attrName);
                var event = $.createEvent(
                    'muu-' + eventName, undefined, undefined, originalEvent);
                root.dispatchEvent(event);
            }
        };

        /**
         * Rerender `template` with `data` and push the changes to the DOM.
         *
         * @param {Object.<string, *>} data
         * @see {@link module:update-dom} for details.
         * @see The templating system can be defined in the {@link Registry}.
         */
        this.update = function(data) {
            registry.updateDOM(root, registry.renderer(template, data));

            _.forEach(registry.events, function(eventType) {
                var selector = '[data-on' + eventType + ']';
                _.forEach(self.querySelectorAll(selector), function(element) {
                    element.addEventListener(eventType, eventCallback, false);
                });
            });

            var updateEvent = $.createEvent('muu-parent-update');
            var subDirectives = self.querySelectorAll('muu.muu-initialised');
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
         * @return {Array.<Element>} All child elements that match the given
         *     selector and are not isolated.
         * @nosideeffects
         */
        this.querySelectorAll = function(selector) {
            var hits = root.querySelectorAll(selector);

            // NOTE: querySelectorAll returns all elements in the tree that
            // match the given selector.  findAll does the same with *relative
            // selectors* but does not seem to be available yet.
            var isolations = root.querySelectorAll('.muu-isolate');
            var isolated = _.union.apply(_, _.map(isolations, function(isolation) {
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
         * @return {Element} First child element that matches the given
         *     selector and is not isolated.
         * @nosideeffects
         * @suppress {missingReturn}
         */
        this.querySelector = function(selector) {
            var all = self.querySelectorAll(selector);
            if (all.length > 0) {
                return all[0];
            }
        };

        /**
         * @param {string} eventName
         * @param {Function} callback
         * @return {function()} An unregister function
         */
        this.on = function(eventName, fn) {
            return $.on(root, 'muu-' + eventName, function(event) {
                return fn(event.detail);
            });
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
         * @nosideeffects
         */
        this.getModel = function(name, _default) {
            if (name === undefined) {
                var model = {};
                _.forEach(self.querySelectorAll('[name]'), function(element) {
                    model[element.name] = self.getModel(element.name);
                });
                return model;
            } else {
                var element = self.querySelector('[name=' + name + ']');
                if (element === undefined) {
                    return _default;
                } else if (element.getAttribute('type') === 'number') {
                    return parseFloat(element.value);
                } else if (element.getAttribute('type') === 'checkbox') {
                    return element.checked;
                } else if (element.getAttribute('type') === 'radio') {
                    var options = self.querySelectorAll('[name=' + name + ']');
                    return $.getRadio(options) || _default;
                } else {
                    return element.value;
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
            if (self.getModel(name) === value) {
                return;
            }

            var element = self.querySelector('[name=' + name + ']');
            if (element.getAttribute('type') === 'checkbox') {
                element.checked = value;
            } else if (element.getAttribute('type') === 'radio') {
                var options = self.querySelectorAll('[name=' + name + ']');
                $.setRadio(options, value);
            } else {
                element.value = value;
            }
        };
    };

    return Directive;
});
