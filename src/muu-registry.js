/**
 * Exports the {@link Registry} class.
 * @module muu-registry
 * @ignore
 */
define('muu-registry', ['muu-template', 'muu-directive', 'muu-js-helpers', 'muu-dom-helpers'], function(muuTemplate, Directive, _, $) {
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
         * define('foobar', [], function() {
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
            if (type === void 0) {
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

            if (unlink !== void 0) {
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
