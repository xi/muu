/* global define, describe, it, expect */
define(['template'], function(muuTemplate) {
    "use strict";

    describe('muuTemplate', function() {
        it('does variable replacement', function() {
            var template = '{{asd}}';
            var result = muuTemplate(template, {asd: 'huhu'});
            expect(result).to.equal('huhu');
        });
        it('replaces falsy values by empty string', function() {
            var template = '{{asd}}';
            var result = muuTemplate(template, {asd: false});
            expect(result).to.equal('');
            result = muuTemplate(template, {asd: NaN});
            expect(result).to.equal('');
            result = muuTemplate(template, {asd: null});
            expect(result).to.equal('');
            result = muuTemplate(template, {asd: undefined});
            expect(result).to.equal('');
        });
        it('does not replace 0 by empty string', function() {
            var template = '{{asd}}';
            var result = muuTemplate(template, {asd: 0});
            expect(result).to.equal('0');
        });
        it('does loops', function() {
            var template = '{{#loop}}test{{/loop}}';
            var result = muuTemplate(template, {loop: [1,2,3]});
            expect(result).to.equal('testtesttest');
        });
        it('does loops with content', function() {
            var template = '{{#loop}}{{name}} {{/loop}}';
            var result = muuTemplate(template, {loop: [{name: 'tony'}, {name: 'barbara'}]});
            expect(result).to.equal('tony barbara ');
        });
        it('does if', function() {
            var template = '{{#truthy}}test1{{/truthy}} {{#falsy}}test2{{/falsy}}';
            var result = muuTemplate(template, {truthy: true, falsy: false});
            expect(result).to.equal('test1 ');
        });
        it('does inverted if', function() {
            var template = '{{^truthy}}test1{{/truthy}} {{^falsy}}test2{{/falsy}}';
            var result = muuTemplate(template, {truthy: true, falsy: false});
            expect(result).to.equal(' test2');
        });
        it('does pairs', function() {
            var template = '{{str1: key1, str2: key2, str3: key3}}';
            var result = muuTemplate(template, {key1: true, key2: false, key3: true});
            expect(result).to.equal('str1 str3');
        });
        it('does comments', function() {
            var template = 'foo {{!comment}} bar';
            var result = muuTemplate(template, {});
            expect(result).to.equal('foo  bar');
        });
        it('allows to refer to the full context as `this`', function() {
            expect(muuTemplate('{{#this}}{{this}}{{/this}}', [1, 2])).to.equal('12');
        });
        it('escapes HTML in variables', function() {
            var template = '{{asd}}';
            var result = muuTemplate(template, {asd: '<"&>'});
            expect(result).to.equal('&lt;&quot;&amp;&gt;');
        });
        it('escapes HTML in pairs', function() {
            var template = '{{<"&>: key1, str2: key2, str3: key3}}';
            var result = muuTemplate(template, {key1: true, key2: false, key3: true});
            expect(result).to.equal('&lt;&quot;&amp;&gt; str3');
        });
        it('fails on unclosed loop', function() {
            var template = '{{#loop}}test{{loop}}';
            var fn = function() {
                return muuTemplate(template, {loop: [1,2,3]});
            };
            expect(fn).to.throwError('unclosed loop: loop');
        });
        it('fails on unexpected closing loop', function() {
            var template = 'test{{/loop}}';
            var fn = function() {
                return muuTemplate(template, {loop: [1,2,3]});
            };
            expect(fn).to.throwError('unexpected closing loop: {{/loop}}');
        });
        it('fails on unclosed tag', function() {
            var template = '{{asd}';
            var fn = function() {
                return muuTemplate(template, {asd: 'huhu'});
            };
            expect(fn).to.throwError('unclosed tag: {{asd}');
        });
    });
});
