define('muu-search', ['muu-js-helpers'], function(_) {
    "use strict";

    var q = {};

    q.parse = function(s) {
        var q = {};

        var set = function(key, value) {
            if (!q.hasOwnProperty(key)) {
                q[key] = value;
            } else if (_.isArray(q[key])) {
                q[key].push(value);
            } else {
                q[key] = [q[key], value];
            }
        };

        _.forEach(s.substring(1).split('&'), function(item) {
            var i = _.map(item.split('='), decodeURIComponent);
            if (i.length === 2) {
                set(i[0], i[1]);
            } else if (i[0]) {
                set(i[0], true);
            }
        });
        return q;
    };

    var unparseItem = function(key, value) {
        if (value === undefined || value === null || value === false) {
            return [];
        } else if (_.isArray(value)) {
            return _.flatten(_.map(value, function(v) {
                return unparseItem(key, v);
            }));
        } else if (value === true) {
            return [encodeURIComponent(key)];
        } else {
            return [encodeURIComponent(key) + '=' + encodeURIComponent(value)];
        }
    };

    q.unparse = function(q) {
        if (_.isString(q)) {
            return q;
        }

        var a = []
        for (var key in q) {
            if (q.hasOwnProperty(key)) {
                a = a.concat(unparseItem(key, q[key]));
            }
        }
        if (a.length > 0) {
            return '?' + a.join('&');
        } else {
            return '';
        }
    };

    return q;
});
