requirejs.config({
    baseUrl: '../../src/',
    paths: {
        mustache: '../../bower_components/mustache/mustache',
        xhr: '../../bower_components/promise-xhr/promise-xhr',
        moment: '../../bower_components/moment/moment'
    }
});

require(['xhr', 'muu', 'muu-dom-helpers', 'muu-moment'], function(xhr, Muu, $, muuMoment) {
    "use strict";

    var muu = new Muu({debug: true})
        .registerModule(muuMoment)
        .registerDirective(
            'test',
            '<ul>{{#elements}}<li>{{name}}</li>{{/elements}}</ul>' +
                '<input name="input" data-onkeydown="push" />',
            function(self) {
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

                self.update(data);
            })
        .registerDirective(
            'calc',
            '<input name="input" data-onkeydown="update"/><span>{{result}}</span>',
            function(self, element) {
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

                self.update(data);
            });

    $.ready(function() {
        muu.linkAll(document);
    });
});
