/* global define, describe, it, beforeEach, expect */
define(['muu-update-dom'], function(updateDOM) {
    "use strict";

    var n = function(s) {
        return s
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .replace(/=([^"][^> ]*)/g, '="$1"');
    };

    describe('muuUpdateDom', function() {
        var target;
        var source;

        beforeEach(function() {
            target = document.createElement('div');
            source = document.createElement('div');
        });

        it('adds new text nodes', function() {
            source.innerHTML = 'Hallo';
            updateDOM(target, source);
            expect(target.innerHTML).to.equal('Hallo');
        });
        it('adds new elements', function() {
            source.innerHTML = '<span>hallo</span> <span>world</span>';
            target.innerHTML = '<span>hallo</span>';
            updateDOM(target, source);
            expect(n(target.innerHTML)).to.equal('<span>hallo</span> <span>world</span>');
        });
        it('removes existing elements', function() {
            source.innerHTML = '<span>hallo</span>';
            target.innerHTML = '<span>hallo</span> <span>world</span>';
            updateDOM(target, source);
            expect(n(target.innerHTML)).to.equal('<span>hallo</span>');
        });
        it('replaces elements by text nodes', function() {
            source.innerHTML = 'hallo';
            target.innerHTML = '<span>hallo</span>';
            updateDOM(target, source);
            expect(n(target.innerHTML)).to.equal('hallo');
        });
        it('replaces elements by other elements', function() {
            source.innerHTML = '<div>hallo</div>';
            target.innerHTML = '<span class="muu-test">hallo</span>';
            updateDOM(target, source);
            expect(n(target.innerHTML)).to.equal('<div>hallo</div>');
        });
        it('can replace and add elements in the same parent', function() {
            source.innerHTML = '<div>1</div> <div>2</div>';
            target.innerHTML = '<span>1</span>';
            updateDOM(target, source);
            expect(n(target.innerHTML)).to.equal('<div>1</div> <div>2</div>');
        });
        it('can replace more than one element in the same parent', function() {
            source.innerHTML = '<div>1</div> <div>2</div>';
            target.innerHTML = '<span>1</span> <span>2</span>';
            updateDOM(target, source);
            expect(n(target.innerHTML)).to.equal('<div>1</div> <div>2</div>');
        });
        it('can replace and remove elements in the same parent', function() {
            source.innerHTML = '<div>1</div>';
            target.innerHTML = '<span>1</span> <div>2</div>';
            updateDOM(target, source);
            expect(n(target.innerHTML)).to.equal('<div>1</div>');
        });
        it('adds new attributes', function() {
            source.innerHTML = '<span class="test">hallo</span>';
            target.innerHTML = '<span>hallo</span>';
            updateDOM(target, source);
            expect(n(target.innerHTML)).to.equal('<span class="test">hallo</span>');
        });
        it('removes existing attributes', function() {
            source.innerHTML = '<span>hallo</span>';
            target.innerHTML = '<span class="test">hallo</span>';
            updateDOM(target, source);
            expect(n(target.innerHTML)).to.equal('<span>hallo</span>');
        });
        it('preserves all classes prefixed with "muu-"', function() {
            source.innerHTML = '<span class="test">hallo</span>';
            target.innerHTML = '<span class="muu-test">hallo</span>';
            updateDOM(target, source);
            expect(n(target.innerHTML)).to.equal('<span class="test muu-test">hallo</span>');
        });
        it('preserves input value', function() {
            source.innerHTML = '<input class="test">';
            target.innerHTML = '<input>';
            target.querySelector('input').value = '1';
            updateDOM(target, source);
            expect(n(target.innerHTML)).to.contain('class="test"');
            expect(target.querySelector('input').value).to.equal('1');
        });
        it('preserves input checked on checkbox', function() {
            source.innerHTML = '<input type="checkbox" class="test">';
            target.innerHTML = '<input type="checkbox">';
            target.querySelector('input').checked = true;
            updateDOM(target, source);
            expect(n(target.innerHTML)).to.contain('class="test"');
            expect(target.querySelector('input').checked).to.be.ok();
        });
        it('does not change children of .muu-isolate', function() {
            source.innerHTML = '<div class="muu-isolate"><span>huhu</span></div>';
            target.innerHTML = '<div class="muu-isolate"><div>haha</div></div>';
            updateDOM(target, source);
            expect(n(target.innerHTML)).to.be('<div class="muu-isolate"><div>haha</div></div>');
        });
        it('does change attributes of .muu-isolate', function() {
            source.innerHTML = '<div class="muu-isolate" data-name="foo"></div>';
            target.innerHTML = '<div class="muu-isolate" data-name="bar"></div>';
            updateDOM(target, source);
            expect(n(target.innerHTML)).to.be('<div class="muu-isolate" data-name="foo"></div>');
        });
    });
});
