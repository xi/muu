define(['limu'], function(Limu) {
    return function() {
        var directives = {};

        this.registerDirective = function(name, template, link) {
            directives[name] = {
                template: template,
                link: link
            };
        };

        this.linkDirective = function(name, element) {
            var template = directives[name].template;
            var link = directives[name].link;

            element.innerHTML = '<div></div>';

            var limu = new Limu(element.children[0], template, this);
            link(limu);

            element.classList.add('muu-isolate');
        };
    };
});
