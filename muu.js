define(['directive', 'lodash'], function(Directive, _) {
    "use strict";

    return function(config) {
        var self = this;
        var directives = {};

        self.config = config || {};

        self.registerDirective = function(type, template, link) {
            directives[type] = {
                template: template,
                link: link
            };
            return self;
        };

        self.registerModule = function(module) {
            module(self);
            return self;
        };

        self.link = function(element, type) {
            if (type === void 0) {
                type = element.getAttribute('type');
            }

            if (!directives.hasOwnProperty(type)) {
                throw new Error('Unknown directive type: ' + type);
            }

            var template = directives[type].template;
            var link = directives[type].link;

            element.innerHTML = '<div></div>';

            var directive = new Directive(element.children[0], template, self);
            link(directive, element);

            element.classList.add('muu-isolate');
            element.classList.add('muu-initialised');

            if (self.config.debug) {
                element.directive = directive;
            }

            return directive;
        };

        self.linkAll = function(root) {
            // NOTE: root may be a DOM Node or a directive
            var elements = root.querySelectorAll('muu:not(.muu-initialised)');
            return _.map(elements, function(element) {
                return self.link(element);
            });
        };
    };
});
