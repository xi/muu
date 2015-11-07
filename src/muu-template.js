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
 * ## Special variable `this`
 *
 * `this` always refers to the current context. So the following expressions
 * are equivalent:
 *
 * ```
 * muuTemplate('{{#items}}{{content}}{{/items}}', {
 *   item: [{
 *     content: 1
 *   }, {
 *     content: 2
 *   }]
 * });
 *
 * muuTemplate('{{#this}}{{this}}{{/this}}', [1, 2]);
 * ```
 *
 * @module muu-template
 * @param {string} template
 * @param {Object} data
 * @return {string}
 * @nosideeffects
 */
define('muu-template', ['muu-js-helpers', 'muu-dom-helpers'], function(_, $) {
    "use strict";

    var openTag = '{{';
    var closeTag = '}}';

    /**
     * @param {string} key
     * @param {Object} data
     * @return {*}
     * @nosideeffects
     */
    var getValue = function(key, data) {
        return key === 'this' ? data : data[key];
    };

    /**
     * @param {string} tag
     * @return {function(*): string}
     * @nosideeffects
     */
    var parseVariable = function(tag) {
        if (tag.indexOf(':') === -1) {
            return function(data) {
                var v = getValue(tag, data);
                if (!v && v !== 0) {
                    v = '';
                }
                return $.escapeHtml(v);
            };
        } else {
            var pairs = _.map(tag.split(','), function(pair) {
                var v = pair.split(':');
                var key = v[0].trim();
                var value = v.slice(1).join(':').trim();
                return [key, value];
            });

            return function(data) {
                var results = _.map(_.filter(pairs, function(pair) {
                    return getValue(pair[1], data);
                }), function(pair) {
                    return pair[0];
                });

                return $.escapeHtml(results.join(' '));
            };
        }
    };

    /**
     * @param {string} tag
     * @param {string} afterTag
     * @param {boolean} [inverted]
     * @return {{render: function(*): string, afterBlock: string}}
     * @nosideeffects
     */
    var parseLoop = function(tag, afterTag, inverted) {
        var inner = parseTemplate(afterTag, tag);

        return {
            render: function(data) {
                var value = getValue(tag, data);
                var result = '';

                if (inverted) {
                    if (!value) {
                        result += inner.render(data);
                    }
                } else {
                    if (_.isArray(value)) {
                        _.forEach(value, function(item) {
                            result += inner.render(item);
                        });
                    } else if (value) {
                        result += inner.render(data);
                    }
                }

                return result;
            },
            afterBlock: inner.afterBlock
        };
    };

    /**
     * @param {string} template
     * @param {string} [loopName]
     * @return {{render: function(*): string, afterBlock: string}}
     * @nosideeffects
     */
    var parseTemplate = function(template, loopName) {
        var openIndex = template.indexOf(openTag);
        if (openIndex === -1) {
            if (loopName === undefined) {
                return {
                    render: function() { return template; },
                    afterBlock: ''
                };
            } else {
                throw new Error('unclosed loop: ' + loopName);
            }
        } else {
            var beforeTag = template.slice(0, openIndex);
            var tmp = template.slice(openIndex);

            var closeIndex = tmp.indexOf(closeTag);
            if (closeIndex === -1) {
                throw new Error('unclosed tag: ' + tmp);
            }
            var tag = tmp.slice(openTag.length, closeIndex);
            var afterTag = tmp.slice(closeIndex + closeTag.length);

            var loadNext = true;
            var current = {
                render: function() { return ''; },
                afterBlock: afterTag
            };

            if (tag.lastIndexOf('#', 0) === 0) {
                current = parseLoop(tag.substr(1), afterTag);
            } else if (tag.lastIndexOf('^', 0) === 0) {
                current = parseLoop(tag.substr(1), afterTag, true);
            } else if (tag.lastIndexOf('/', 0) === 0) {
                loadNext = false;
                if (tag.substr(1) !== loopName) {
                    throw new Error('unexpected closing loop: ' + tag);
                }
            } else if (tag.lastIndexOf('!', 0) !== 0) {
                current.render = parseVariable(tag);
            }

            if (loadNext) {
                var next = parseTemplate(current.afterBlock, loopName);
                return {
                    render: function(data) {
                        return beforeTag + current.render(data) + next.render(data);
                    },
                    afterBlock: next.afterBlock
                };
            } else {
                return {
                    render: function(data) {
                        return beforeTag + current.render(data);
                    },
                    afterBlock: current.afterBlock
                };
            }
        }
    };

    var cache = {};

    return function(template, data) {
        if (cache[template] === undefined) {
            cache[template] = parseTemplate(template);
        }
        return cache[template].render(data);
    };
});
