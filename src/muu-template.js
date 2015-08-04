define([], function() {
    "use strict";

    var openTag = '{{';
    var closeTag = '}}';

    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;'
    };

    var isString = function(s) {
        return s.trim !== void 0;
    };

    var isArray = function(a) {
        return a.push !== void 0;
    };

    var isFunction = function(f) {
        return f.call !== void 0;
    };

    var escapeHtml = function(string) {
        return String(string).replace(/[&<>"'\/]/g, function(s) {
            return entityMap[s];
        });
    };

    var parseVariableTemplate = function(template) {
        var content = template.slice(2, -2);

        if (template.indexOf(':') === -1) {
            return function(data) {
                return escapeHtml(data[content] || '');
            };
        } else {
            var pairs = content.split(',').map(function(pair) {
                var v = pair.split(':');
                var key = v[0].trim();
                var value = v.slice(1).join(':').trim();
                return [key, value];
            });

            return function(data) {
                var results = [];

                for (var i = 0; i < pairs.length; i++) {
                    var key = pairs[i][0];
                    var value = pairs[i][1];

                    if (data[value]) {
                        results.push(key);
                    }
                }

                return escapeHtml(results.join(' '));
            };
        }
    };

    var parseLoopTemplate = function(tag, afterTag) {
        var tagName = tag.slice(3, -2);

        var v = parseTemplate(afterTag, tagName);
        var inner = v[0];
        var afterLoop = v[1];

        var render = function(data) {
            if (isArray(data[tagName])) {
                var result = '';
                for (var i = 0; i < data[tagName].length; i++) {
                    result += inner(data[tagName][i]);
                }
                return result;
            } else if (data[tagName]) {
                return inner(data);
            } else {
                return '';
            }
        };

        return [render, afterLoop];
    };

    var concat = function(a) {
        var last = a.pop();

        if (isArray(last)) {
            a.push(last[0]);
            return [concat(a), last[1]];
        } else {
            a.push(last);

            return function(data) {
                return a.map(function(item) {
                    if (isString(item)) {
                        return item;
                    } else if (isFunction(item)) {
                        return item(data);
                    } else if (isArray(item)) {
                        return concat(item)(data);
                    } else {
                        throw new Error('unexpected item in concat: ' + item);
                    }
                }).join('');
            };
        }
    };

    var parseTemplate = function(template, loopName) {
        var openIndex = template.indexOf(openTag);
        if (openIndex === -1) {
            if (loopName === void 0) {
                return function() {
                    return template;
                };
            } else {
                throw new Error('unclosed loop: ' + loopName);
            }
        } else {
            var beforeTag = template.slice(0, openIndex);
            var tmp = template.slice(openIndex);

            var closeIndex = tmp.indexOf(closeTag) + 2;
            if (closeIndex === -1) {
                throw new Error('unclosed tag: ' + tmp);
            }
            var tag = tmp.slice(0, closeIndex);
            var afterTag = tmp.slice(closeIndex);

            if (tag.startsWith('{{#')) {
                var v = parseLoopTemplate(tag, afterTag);
                var loop = v[0];
                var after = parseTemplate(v[1], loopName);
                return concat([beforeTag, loop, after]);
            } else if (tag.startsWith('{{!')) {
                var after = parseTemplate(afterTag, loopName);
                return concat([beforeTag, after]);
            } else if (tag.startsWith('{{/')) {
                if (tag.slice(3, -2) === loopName) {
                    var render = function() {
                        return beforeTag;
                    };
                    return [render, afterTag];
                } else {
                    throw new Error('unexpected closing loop: ' + tag);
                }
            } else {
                var render = parseVariableTemplate(tag);
                var after = parseTemplate(afterTag, loopName);
                return concat([beforeTag, render, after]);
            }
        }
    };

    return function(template, data) {
        return parseTemplate(template)(data);
    };
});