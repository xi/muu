define(['limu', 'jqlite'], function(Limu, $) {
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

            var limu = new Limu(element.children[0], template, self);
            link(limu, element);

            element.classList.add('muu-isolate');
            element.classList.add('muu-initialised');

            if (self.config.debug) {
                element.limu = limu;
            }

            return limu;
        };

        self.linkAll = function(root) {
            // NOTE: root may be a DOM Node or a limu instance
            var elements = $.toArray(root.querySelectorAll('muu:not(.muu-initialised)'));
            return elements.map(function(element) {
                return self.link(element);
            });
        };
    };
});
