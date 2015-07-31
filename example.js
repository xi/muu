requirejs.config({
    baseUrl: '',
    paths: {
        mustache: 'bower_components/mustache/mustache',
        xhr: 'bower_components/promise-xhr/promise-xhr'
    }
});

require(['xhr', 'muu', 'dom-helpers'], function(xhr, Muu, $) {
    "use strict";

    var muu = new Muu({debug: true});
    var template = '<ul>{{#elements}}<li><muu type="calc" data-name="{{name}}"></muu></li>{{/elements}}</ul>' +
        '<input name="input" data-onkeydown="push" />';

    muu.registerDirective('test', template, function(self) {
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

    muu.registerDirective('calc', '<input name="input" data-onkeydown="update"/><span>{{result}}</span>', function(self, element) {
        var data = {
            name: element.getAttribute('data-name')
        };

        self.on('update', function(event) {
            if (event.keyCode === 13) {
                var input = self.getModel('input');
                data.result = eval(input);
                self.update(data);
            }
        });

        $.ready(function() {
            self.update(data);
        });
    });

    muu.linkAll(document);
});
