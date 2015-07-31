requirejs.config({
    baseUrl: '',
    paths: {
        mustache: 'bower_components/mustache/mustache',
        xhr: 'bower_components/promise-xhr/promise-xhr'
    }
});

require(['xhr', 'limu', 'jqlite'], function(xhr, Limu, $) {
    "use strict";

    var template = '<ul>{{#elements}}<li>{{name}}</li>{{/elements}}</ul>' +
        '<input name="input" data-onkeydown="push" />';
    var data = {
        elements: [{
            name: 'hugo'
        }]
    };

    var limu = new Limu(document.body.children[0], template);

    window.limu = limu;

    $.ready(function() {
        limu.update(data);
    });
    limu.on('push', function(event) {
        if (event.keyCode === 13) {
            data.elements.push({
                name: limu.getModel('input') || ''
            });
            limu.update(data);
            limu.setModel('input', '');
        }
    });
});
