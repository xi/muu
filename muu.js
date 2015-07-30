requirejs.config({
    baseUrl: '',
    paths: {
        mustache: 'bower_components/mustache/mustache',
        xhr: 'bower_components/promise-xhr/promise-xhr'
    }
});

require(['xhr', 'limu', 'jqlite'], function(xhr, Limu, $) {
    "use strict";

    var template = '<ul>{{#elements}}<li>{{name}}</li>{{/elements}}</ul><input/>';
    var data = {
        elements: [{
            name: 'hugo'
        }]
    };

    var limu = new Limu(document.body.children[0], template);

    $.ready(function() {
        limu.update(data);
    });
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 13 && e.target.nodeName === 'INPUT') {
            data.elements.push({
                name: e.target.value
            });
            limu.update(data);
        }
    });
});
