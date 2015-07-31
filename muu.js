requirejs.config({
    baseUrl: '',
    paths: {
        mustache: 'bower_components/mustache/mustache',
        xhr: 'bower_components/promise-xhr/promise-xhr'
    }
});

require(['xhr', 'registry', 'jqlite'], function(xhr, Registry, $) {
    "use strict";

    var registry = new Registry();
    var template = '<ul>{{#elements}}<li>{{name}}</li>{{/elements}}</ul>' +
        '<input name="input" data-onkeydown="push" />';

    registry.registerDirective('test', template, function(self) {
        var data = {
            elements: [{
                name: 'hugo'
            }]
        };

        self.on('push', function(event) {
            if (event.keyCode === 13) {
                data.elements.push({
                    name: self.getModel('input') || ''
                });
                self.update(data);
                self.setModel('input', '');
            }
        });

        $.ready(function() {
            self.update(data);
        });
    });

    registry.linkDirective('test', document.body.children[0]);
});
