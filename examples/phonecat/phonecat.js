requirejs.config({
    baseUrl: '..',
    paths: {
        mustache: '../../bower_components/mustache/mustache',
        xhr: '../../bower_components/promise-xhr/promise-xhr'
    }
});

require(['xhr', 'muu', 'muu-dom-helpers'], function(xhr, Muu, $) {
    "use strict";

    Promise.all([
        xhr.get('phonecat.html'),
        xhr.getJSON('phones.json')
    ]).then(function(args) {
        var template = args[0];
        var phones = args[1];

        var muu = new Muu()
            .registerDirective('phonecat', template, function(self) {
                self.on('filter', function() {
                    var query = self.getModel('query', '').toLowerCase();
                    var orderProp = self.getModel('orderProp');

                    self.update({
                        phones: phones
                            .filter(function(phone) {
                                return phone.name.toLowerCase().match(query);
                            })
                            .sort(function(a, b) {
                                return a[orderProp] > b[orderProp];
                            })
                    });
                });

                self.update({phones: phones});
                self.setModel('query', '');
                self.setModel('orderProp', 'age');
            });

        $.ready(function() {
            muu.linkAll(document);
        });
    });
});
