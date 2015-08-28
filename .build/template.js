(function(window, document, undefined) {
    var name = 'muu';

    (function(factory) {
        if (typeof define === 'function' && define.amd) {
            define(name, ['lodash'], factory);
        } else {
            window[name] = factory(window._);
        }
    })(function(lodash) {
        var modules = {};

        modules['muu-js-helpers'] = {
            instance: lodash
        };

        var map = function(a, fn) {
            var b = [];
            for (var i = 0; i < a.length; i++) {
                b.push(fn(a[i]));
            }
            return b;
        };

        var _define = function(name, deps, factory) {
            modules[name] = {
                deps: deps,
                factory: factory
            };
        };

        var _require = function(name) {
            if (!modules[name]) {
                return undefined;
            }

            if (!modules[name].instance) {
                var deps = modules[name].deps;
                var factory = modules[name].factory;

                modules[name].instance = factory.apply(undefined, map(deps, _require));
            }

            return modules[name].instance;
        };

        return _require(name);
    });
})(window, document, void 0);
