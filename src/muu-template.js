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
     * @param {string} afterTag
     * @param {string} loopName
     * @return {{render: function(*): string, afterBlock: string}}
     * @nosideeffects
     */
    var parseVariable = function(tag, afterTag, loopName) {
        var next = parseTemplate(afterTag, loopName);
        var render;

        if (tag.indexOf(':') === -1) {
            render = function(data) {
                return $.escapeHtml(getValue(tag, data) || '');
            };
        } else {
            var pairs = _.map(tag.split(','), function(pair) {
                var v = pair.split(':');
                var key = v[0].trim();
                var value = v.slice(1).join(':').trim();
                return [key, value];
            });

            render = function(data) {
                var results = [];

                for (var i = 0; i < pairs.length; i++) {
                    var key = pairs[i][0];
                    var value = pairs[i][1];

                    if (getValue(value, data)) {
                        results.push(key);
                    }
                }

                return $.escapeHtml(results.join(' '));
            };
        }

        return {
            render: function(data) {
                return render(data) + next.render(data, loopName);
            },
            afterBlock: next.afterBlock
        };
    };

    /**
     * @param {string} tag
     * @param {string} afterTag
     * @param {string} loopName
     * @param {boolean} [inverted]
     * @return {{render: function(*): string, afterBlock: string}}
     * @nosideeffects
     */
    var parseLoop = function(tag, afterTag, loopName, inverted) {
        var inner = parseTemplate(afterTag, tag);
        var next = parseTemplate(inner.afterBlock, loopName);

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
                        for (var i = 0; i < value.length; i++) {
                            result += inner.render(value[i]);
                        }
                    } else if (value) {
                        result += inner.render(data);
                    }
                }

                return result + next.render(data);
            },
            afterBlock: next.afterBlock
        };
    };

    /**
     * @param {string} tag
     * @param {string} afterTag
     * @param {string} loopName
     * @return {{render: function(*): string, afterBlock: string}}
     * @nosideeffects
     */
    var parseClose = function(tag, afterTag, loopName) {
        if (tag === loopName) {
            return {
                render: function(data) {
                    return '';
                },
                afterBlock: afterTag
            };
        } else {
            throw new Error('unexpected closing loop: ' + tag);
        }
    };

    /**
     * @param {string} tag
     * @param {string} afterTag
     * @param {string} loopName
     * @return {{render: function(*): string, afterBlock: string}}
     * @nosideeffects
     */
    var parseComment = function(tag, afterTag, loopName) {
        return parseTemplate(afterTag, loopName);
    };

    /**
     * @param {string} template
     * @param {string} loopName
     * @return {{render: function(*): string, afterBlock: string}}
     * @nosideeffects
     */
    var parseTemplate = function(template, loopName) {
        var openIndex = template.indexOf(openTag);
        if (openIndex === -1) {
            if (loopName === undefined) {
                return {
                    render: function(data) {
                        return template;
                    },
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

            var next;
            if (tag.lastIndexOf('#', 0) === 0) {
                next = parseLoop(tag.substr(1), afterTag, loopName);
            } else if (tag.lastIndexOf('^', 0) === 0) {
                next = parseLoop(tag.substr(1), afterTag, loopName, true);
            } else if (tag.lastIndexOf('!', 0) === 0) {
                next = parseComment(tag.substr(1), afterTag, loopName);
            } else if (tag.lastIndexOf('/', 0) === 0) {
                next = parseClose(tag.substr(1), afterTag, loopName);
            } else {
                next = parseVariable(tag, afterTag, loopName);
            }

            return {
                render: function(data) {
                    return beforeTag + next.render(data);
                },
                afterBlock: next.afterBlock
            };
        }
    };

    return function(template, data) {
        var parsed = parseTemplate(template);
        if (parsed.afterBlock) {
            throw new Error('non-empty afterBlock');
        }
        return parsed.render(data);
    };
});
