/**
 * minimal mustache insipred templating
 *
 * ## Variables
 *
 * Variables are created with a `{{name}}` tag. These are always escaped.
 *
 * ## Loops
 *
 * Loops render blocks of text a number of times, depending on the value of
 * the key in the current context.
 *
 * A loop begins with a pound and ends with a slash. That is, `{{#person}}`
 * begins a "person" section while `{{/person}}` ends it.
 *
 * If the value is an array, the block is repeated for each item in that array.
 * In any other case, the block is rendered with the outer scope, but only if
 * the value is truthy.
 *
 * ## Inverted loops
 *
 * Inverted loops render blocks of test if the value of the key is falsy. They
 * begin with a caret.
 *
 * ## Comments
 *
 * Comments begin with a bang and are ignored.
 *
 * ## Pairs
 *
 * Pairs look like JSON objects. The result is a space separated list of all
 * keys with truthy values.
 *
 * ```
 * muuTemplate('{{foo: var1, bar: var2, baz: var3}}', {
 *   var1: true,
 *   var2: false,
 *   var3: true
 * });  // 'foo baz'
 * ```
 *
 * @module muu-template
 * @param {string} template
 * @param {object} data
 * @return {string}
 */
define(['muu-js-helpers', 'muu-dom-helpers'], function(_, $) {
    "use strict";

    var openTag = '{{';
    var closeTag = '}}';

    var parseVariableTemplate = function(template) {
        var content = template.slice(2, -2);

        if (template.indexOf(':') === -1) {
            return function(data) {
                return $.escapeHtml(data[content] || '');
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

                return $.escapeHtml(results.join(' '));
            };
        }
    };

    var parseLoopTemplate = function(tag, afterTag, inverted) {
        var tagName = tag.slice(3, -2);

        var v = parseTemplate(afterTag, tagName);
        var inner = v[0];
        var afterLoop = v[1];

        var render = function(data) {
            if (inverted) {
                if (data[tagName]) {
                    return '';
                } else {
                    return inner(data);
                }
            } else {
                if (_.isArray(data[tagName])) {
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
            }
        };

        return [render, afterLoop];
    };

    var concat = function(a) {
        var last = a.pop();

        if (_.isArray(last)) {
            a.push(last[0]);
            return [concat(a), last[1]];
        } else {
            a.push(last);

            return function(data) {
                return a.map(function(item) {
                    if (_.isString(item)) {
                        return item;
                    } else if (_.isFunction(item)) {
                        return item(data);
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
            if (closeIndex === 1) {
                throw new Error('unclosed tag: ' + tmp);
            }
            var tag = tmp.slice(0, closeIndex);
            var afterTag = tmp.slice(closeIndex);

            if (tag.lastIndexOf('{{#', 0) === 0) {
                var v = parseLoopTemplate(tag, afterTag);
                var loop = v[0];
                var after = parseTemplate(v[1], loopName);
                return concat([beforeTag, loop, after]);
            } else if (tag.lastIndexOf('{{^', 0) === 0) {
                var v = parseLoopTemplate(tag, afterTag, true);
                var loop = v[0];
                var after = parseTemplate(v[1], loopName);
                return concat([beforeTag, loop, after]);
            } else if (tag.lastIndexOf('{{!', 0) === 0) {
                var after = parseTemplate(afterTag, loopName);
                return concat([beforeTag, after]);
            } else if (tag.lastIndexOf('{{/', 0) === 0) {
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
