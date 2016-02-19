/* global define, describe, it, expect */
define(['search'], function(q) {
    "use strict";

    describe('search', function() {
        describe('parse', function() {
            it('converts a search string to an object', function() {
                expect(q.parse('?foo=bar&x=1')).to.eql({foo: 'bar', x: '1'});
            });
            it('parses value-less items to true', function() {
                expect(q.parse('?foo')).to.eql({foo: true});
            });
            it('parses multi-items to arrays', function() {
                expect(q.parse('?foo=1&foo=2&foo=3')).to.eql({foo: [1,2,3]});
            });
            it('parses empty values to empty strings', function() {
                expect(q.parse('?foo=')).to.eql({foo: ''});
            });
            it('parses empty string to empty object', function() {
                expect(q.parse('')).to.eql({});
            });
        });

        describe('unparse', function() {
            it('converts an object to a search string', function() {
                expect(q.unparse({foo: 'bar', x: 1})).to.equal('?foo=bar&x=1');
            });
            it('unparses true to value-less items', function() {
                expect(q.unparse({foo: true})).to.equal('?foo');
            });
            it('unparses arrays to multi-items', function() {
                expect(q.unparse({foo: [1,2,3]})).to.equal('?foo=1&foo=2&foo=3');
            });
            it('skips entries with value undefined, null, or false', function() {
                expect(q.unparse({foo: undefined})).to.equal('');
                expect(q.unparse({foo: null})).to.equal('');
                expect(q.unparse({foo: false})).to.equal('');
            });
            it('skips unparsing if input already is a string', function() {
                expect(q.unparse('==?asd')).to.equal('==?asd');
            });
        });
    });
});
