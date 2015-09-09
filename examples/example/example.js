requirejs.config({
    paths: {
        muu: '../../dist/muu.min',
        xhr: '../../lib/promise-xhr/promise-xhr',
        moment: '../../lib/moment/moment',
        'muu-moment': './muu-moment'
    }
});

require(['xhr', 'muu', 'muu-moment'], function(xhr, muu, muuMoment) {
    "use strict";

    var registry = new muu.Registry({debug: true})
        .registerModule(muuMoment)
        .registerDirective(
            'test',
            '<ul>{{#elements}}<li>{{name}}</li><muu type="moment"></muu>{{/elements}}</ul>' +
                '<input name="input" data-onkeydown="push" />',
            function(self) {
                var data = {
                    elements: [{
                        name: 'hugo'
                    }]
                };

                self.on('push', function(event) {
                    if (event.detail.keyCode === 13) {
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
                    if (event.detail.keyCode === 13) {
                        var input = self.getModel('input');
                        data.result = eval(input);
                        self.update(data);
                    }
                });

                self.update(data);
            });

    muu.$.ready(function() {
        registry.linkAll(document);
    });
});
