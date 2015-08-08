/**
 * Exports the {@link Registry} class.
 * @module muu
 */
define(['muu-template', 'muu-directive', 'muu-js-helpers'], function(muuTemplate, Directive, _) {
    "use strict";

    /**
     * @constructs Registry
     * @param {{?debug: boolean, ?renderer: function}} config
     */
    var Registry = function(config) {
        var self = this;
        var directives = {};

        this.config = config || {};
        this.renderer = self.config.renderer || muuTemplate;

        /**
         * @param {string} type
         * @param {string} template
         * @param {Function(DOMElement, string): Directive} link
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
         * @param {Function(Registry)} module
         * @return {Registry} this
         */
        this.registerModule = function(module) {
            module(self);
            return self;
        };

        /**
         * @param {DOMElement} element
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
                var destroy = function() {
                    unlink();
                    element.removeEventListener('DOMNodeRemovedFromDocument', destroy, false);
                };
                element.addEventListener('DOMNodeRemovedFromDocument', destroy, false);
            }

            return directive;
        };

        /**
         * @param {DOMElement} root
         * @return {Directive[]}
         */
        this.linkAll = function(root) {
            // NOTE: root may be a DOM Node or a directive
            var elements = root.querySelectorAll('muu:not(.muu-initialised)');
            return _.map(elements, function(element) {
                return self.link(element);
            });
        };
    };

    return Registry;
});
