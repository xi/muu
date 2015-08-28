(function(window, document, undefined) {
    var name = 'muu';

    (function(factory) {
        if (typeof define === 'function' && define.amd) {
            define(name, ['lodash'], factory);
        } else {
            window[name] = factory(window._);
        }
    })(function(lodash) {
        var modules = {};

        modules['muu-js-helpers'] = {
            instance: lodash
        };

        var map = function(a, fn) {
            var b = [];
            for (var i = 0; i < a.length; i++) {
                b.push(fn(a[i]));
            }
            return b;
        };

        var _define = function(name, deps, factory) {
            modules[name] = {
                deps: deps,
                factory: factory
            };
        };

        var _require = function(name) {
            if (!modules[name]) {
                return undefined;
            }

            if (!modules[name].instance) {
                var deps = modules[name].deps;
                var factory = modules[name].factory;

                modules[name].instance = factory.apply(undefined, map(deps, _require));
            }

            return modules[name].instance;
        };

        /**
         * Exports the {@link Directive} class.
         * @module muu-directive
         * @ignore
         */
        _define('muu-directive', ['muu-dom-helpers', 'muu-js-helpers', 'muu-update-dom'], function($, _, updateDOM) {
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
             *   that element, a `muu-custom` event will be triggered on the
             *   directive's root element.
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
                 * @param {Object.<string, *>} data
                 * @see {@link module:muu-update-dom} for details.
                 * @see The templating system can be defined in the {@link Registry}.
                 */
                this.update = function(data) {
                    var tmp = document.createElement('div');
                    tmp.innerHTML = registry.renderer(template, data);

                    updateDOM(root, tmp);

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
                        } else if (element.type === 'checkbox') {
                            return element.checked;
                        } else if (element.type === 'radio') {
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
        /**
         * DOM related helper functions
         * @module muu-dom-helpers
         */
        _define("muu-dom-helpers", ['muu-js-helpers'], function(_) {
            "use strict";

            var entityMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;'
            };

            /** @lends module:muu-dom-helpers */
            var $ = {};

            $.DELAY = 1000;

            /**
             * @param {string} string
             * @return {string} - escaped HTML
             * @nosideeffects
             */
            $.escapeHtml = function(string) {
                return String(string).replace(/[&<>"'\/]/g, function(s) {
                    return entityMap[s];
                });
            };

            /**
             * Cross browser custom events.
             *
             * *Note*: IE does not seem to like it when you use existing event names
             * with this.
             *
             * @param {string} type
             * @param {*} detail
             * @return {Event}
             * @see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
             * @nosideeffects
             */
            $.createEvent = function(type, detail) {
                if (typeof CustomEvent === 'function') {
                    return new CustomEvent(type, {
                        detail: detail
                    });
                } else {
                    var event = document.createEvent('CustomEvent');
                    event.initCustomEvent(type, false, true, detail);
                    return event;
                }
            };

            /**
             * @param {EventTarget} element
             * @param {string} eventName
             * @param {Function} callback
             * @return {function()} An unregister function
             */
            $.on = function(element, eventName, callback) {
                element.addEventListener(eventName, callback, false);
                return function() {
                    element.removeEventListener(eventName, callback, false);
                };
            };

            /**
             * @param {Function} fn
             * @return {function()} An unregister function
             */
            $.ready = function(fn) {
                var _fn = _.once(fn);
                if (document.readyState === 'complete') {
                    _fn();
                    return function() {};
                } else {
                    var u1 = $.on(document, 'DOMContentLoaded', _fn);
                    var u2 = $.on(window, 'load', _fn);
                    return function() {
                        u1();
                        u2();
                    };
                }
            };

            /**
             * @param {Node} desc
             * @param {Node} root
             * @return {boolean}
             * @nosideeffects
             */
            $.isDescendant = function(desc, root) {
                 return !!desc && (desc === root || $.isDescendant(desc.parentNode, root));
            };

            /**
             * Execute a function when `element` is removed from the DOM.
             *
             * *Note*: The callback is not executed directly when (or even before) the
             * element is removed but with a slight delay. So the only way to test this
             * is to use a timeout in the test.
             *
             * @param {Element} element
             * @param {Function} fn
             * @return {function()} An unregister function
             */
            $.destroy = function(element, fn) {
                var unregister;

                if (!!window.MutationObserver) {
                    var observer = new MutationObserver(function() {
                        if (!$.isDescendant(element, document)) {
                            fn();
                            unregister();
                        }
                    });

                    observer.observe(document, {
                         childList: true,
                         subtree: true
                    });

                    unregister = _.once(function() {
                        observer.disconnect();
                        observer = undefined;
                    });
                } else {
                    var intervalID = setInterval(function() {
                        if (!$.isDescendant(element, document)) {
                            fn();
                            unregister();
                        }
                    }, $.DELAY);

                    unregister = function() {
                        clearInterval(intervalID);
                    };
                }

                return unregister;
            };

            /**
             * @param {Array.<Element>} options
             * @return {string}
             * @suppress {missingReturn}
             * @nosideeffects
             */
            $.getRadio = function(options) {
                for (var i = 0; i < options.length; i++) {
                    if (options[i].checked) {
                        return options[i].value;
                    }
                }
            };

            /**
             * @param {Array.<Element>} options
             * @param {string} value
             */
            $.setRadio = function(options, value) {
                for (var i = 0; i < options.length; i++) {
                    if (options[i].value === value) {
                        options[i].checked = true;
                    } else {
                        options[i].checked = false;
                    }
                }
            };

            return $;
        });
        /**
         * This module gives access to the following objects:
         *
         * -   `Registry` - {@link Registry}
         * -   `$` - {@link module:muu-dom-helpers}
         * -   `$location` - {@link module:muu-location}
         *
         * @module muu
         */
        _define('muu', ['muu-registry', 'muu-dom-helpers', 'muu-location'], function(Registry, $, $location) {
            "use strict";

            var module = {};

            module.Registry = Registry;
            module.$ = $;
            module.$location = $location;

            return module;
        });
        /**
         * Exports the {@link Registry} class.
         * @module muu-registry
         * @ignore
         */
        _define('muu-registry', ['muu-template', 'muu-directive', 'muu-js-helpers', 'muu-dom-helpers'], function(muuTemplate, Directive, _, $) {
            "use strict";

            /**
             * @constructs Registry
             * @param {Object} config The config object may have following properties:
             *
             * - **debug** - `{boolean}` - Enable debug mode. In debug mode,
             *   directive objects are available as properties from the DOM as
             *   `element.directive`.
             * - **renderer** - `{function(string, Object)}` - The template renderer
             *   to be used. Defaults to {@link module:muu-template}.
             */
            var Registry = function(config) {
                var self = this;
                var directives = {};

                this.config = config || {};
                this.renderer = self.config.renderer || muuTemplate;

                /**
                 * Register a new type of {@link Directive}
                 *
                 * @param {string} type
                 * @param {string} template
                 * @param {function(Directive, Element): Function} link The link
                 *   function is called with an instance of {@link Directive} and a
                 *   Element when {@link Registry#link} is executed.
                 *
                 *   It is the only place where you can access a directive and
                 *   therefore the place where you define its behavior.
                 *
                 *   This typically means to make an initial call to {@link
                 *   Directive#update} and to add some event listeners. You should also
                 *   return an *unlink* function that clears all external references in
                 *   order to avoid memory leaks.
                 * @return {Registry} this
                 */
                this.registerDirective = function(type, template, link) {
                    directives[type] = {
                        template: template,
                        link: link
                    };
                    return self;
                };

                /**
                 * Shortcut for wrapping calls to {@link Registry} in a function.
                 *
                 * This can be esepcially helpful if that function is defined in a
                 * different module.
                 *
                 * ```.js
                 * _define('foobar', [], function() {
                 *   return function(registry) {
                 *     registry
                 *        .registerDirective('foo', '...', function() {...})
                 *        .registerDirective('bar', '...', function() {...});
                 *   };
                 * });
                 *
                 * require(['foobar'], function(foobar) {
                 *   var registry = new Registry();
                 *   registry.registerModule(foobar);
                 * });
                 * ```
                 *
                 * @param {function(Registry)} module
                 * @return {Registry} this
                 */
                this.registerModule = function(module) {
                    module(self);
                    return self;
                };

                /**
                 * Create and initialise a {@link Directive} for `element`.
                 *
                 * @param {Element} element
                 * @param {string} type
                 * @return {Directive}
                 */
                this.link = function(element, type) {
                    if (type === undefined) {
                        type = element.getAttribute('type');
                    }

                    if (!directives.hasOwnProperty(type)) {
                        throw new Error('Unknown directive type: ' + type);
                    }

                    var template = directives[type].template;
                    var link = directives[type].link;

                    var directive = new Directive(element, template, self);
                    var unlink = link(directive, element);
                    element.classList.add('muu-isolate');
                    element.classList.add('muu-initialised');

                    if (self.config.debug) {
                        element.directive = directive;
                    }

                    if (unlink !== undefined) {
                        $.destroy(element, unlink);
                    }

                    return directive;
                };

                /**
                 * Link all directives that can be found inside `root`.
                 *
                 * @param {Element} root
                 * @return {Array.<Directive>}
                 */
                this.linkAll = function(root) {
                    // NOTE: root may be a DOM Node or a directive
                    var elements = _.filter(root.querySelectorAll('muu'), function(element) {
                        return !element.classList.contains('muu-initialised');
                    });
                    return _.map(elements, function(element) {
                        return self.link(element);
                    });
                };
            };

            return Registry;
        });
        /**
         * Recreate children of `source` in `target` by making only small adjustments.
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
         * @param {Element} target
         * @param {Element} source
         */
        _define('muu-update-dom', ['muu-js-helpers'], function(_) {
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

                for (var i = ns; i < nt; i++) {
                    target.removeChild(target.childNodes[ns]);
                }
                for (i = nt; i < ns; i++) {
                    target.appendChild(source.childNodes[nt]);
                }
                for (i = 0; i < nt && i < ns; i++) {
                    var tchild = target.childNodes[i];
                    var schild = source.childNodes[i];

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
                    }
                }
            };

            return updateDOM;
        });

        return _require(name);
    });
})(window, document, void 0);
