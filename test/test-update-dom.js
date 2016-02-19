/* global define, describe, it, beforeEach, expect */
define(['update-dom'], function(updateDOM) {
    "use strict";

    var n = function(s) {
        return s
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .replace(/=([^"][^> ]*)/g, '="$1"');
    };

    describe('muuUpdateDom', function() {
        var target;

        beforeEach(function() {
            target = document.createElement('div');
        });

        it('adds new text nodes', function() {
            updateDOM(target, 'Hallo');
            expect(target.innerHTML).to.equal('Hallo');
        });
        it('adds new elements', function() {
            target.innerHTML = '<span>hallo</span>';
            updateDOM(target, '<span>hallo</span> <span>world</span>');
            expect(n(target.innerHTML)).to.equal('<span>hallo</span> <span>world</span>');
        });
        it('removes existing elements', function() {
            target.innerHTML = '<span>hallo</span> <span>world</span>';
            updateDOM(target, '<span>hallo</span>');
            expect(n(target.innerHTML)).to.equal('<span>hallo</span>');
        });
        it('replaces elements by text nodes', function() {
            target.innerHTML = '<span>hallo</span>';
            updateDOM(target, 'hallo');
            expect(n(target.innerHTML)).to.equal('hallo');
        });
        it('replaces elements by other elements', function() {
            target.innerHTML = '<span class="muu-test">hallo</span>';
            updateDOM(target, '<div>hallo</div>');
            expect(n(target.innerHTML)).to.equal('<div>hallo</div>');
        });
        it('can replace and add elements in the same parent', function() {
            target.innerHTML = '<span>1</span>';
            updateDOM(target, '<div>1</div> <div>2</div>');
            expect(n(target.innerHTML)).to.equal('<div>1</div> <div>2</div>');
        });
        it('can replace more than one element in the same parent', function() {
            target.innerHTML = '<span>1</span> <span>2</span>';
            updateDOM(target, '<div>1</div> <div>2</div>');
            expect(n(target.innerHTML)).to.equal('<div>1</div> <div>2</div>');
        });
        it('can replace and remove elements in the same parent', function() {
            target.innerHTML = '<span>1</span> <div>2</div>';
            updateDOM(target, '<div>1</div>');
            expect(n(target.innerHTML)).to.equal('<div>1</div>');
        });
        it('adds new attributes', function() {
            target.innerHTML = '<span>hallo</span>';
            updateDOM(target, '<span class="test">hallo</span>');
            expect(n(target.innerHTML)).to.equal('<span class="test">hallo</span>');
        });
        it('removes existing attributes', function() {
            target.innerHTML = '<span class="test">hallo</span>';
            updateDOM(target, '<span>hallo</span>');
            expect(n(target.innerHTML)).to.equal('<span>hallo</span>');
        });
        it('preserves all classes prefixed with "muu-"', function() {
            target.innerHTML = '<span class="muu-test">hallo</span>';
            updateDOM(target, '<span class="test">hallo</span>');
            expect(n(target.innerHTML)).to.equal('<span class="test muu-test">hallo</span>');
        });
        it('preserves input value', function() {
            target.innerHTML = '<input>';
            target.querySelector('input').value = '1';
            updateDOM(target, '<input class="test">');
            expect(n(target.innerHTML)).to.contain('class="test"');
            expect(target.querySelector('input').value).to.equal('1');
        });
        it('preserves input checked on checkbox', function() {
            target.innerHTML = '<input type="checkbox">';
            target.querySelector('input').checked = true;
            updateDOM(target, '<input type="checkbox" class="test">');
            expect(n(target.innerHTML)).to.contain('class="test"');
            expect(target.querySelector('input').checked).to.be.ok();
        });
        it('does not change children of .muu-isolate', function() {
            target.innerHTML = '<div class="muu-isolate"><div>haha</div></div>';
            updateDOM(target, '<div class="muu-isolate"><span>huhu</span></div>');
            expect(n(target.innerHTML)).to.contain('<div>haha</div>');
        });
        it('does change attributes of .muu-isolate', function() {
            target.innerHTML = '<div class="muu-isolate" data-name="bar"></div>';
            updateDOM(target, '<div class="muu-isolate" data-name="foo"></div>');
            expect(n(target.innerHTML)).to.be('<div class="muu-isolate" data-name="foo"></div>');
        });
    });
});
