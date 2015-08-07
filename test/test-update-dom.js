/* global define, describe, it, beforeEach, expect */
define(['muu-update-dom'], function(updateDOM) {
    "use strict";

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
            source.innerHTML = '<span>Hallo</span> <span>World</span>';
            target.innerHTML = '<span>Hallo</span>';
            updateDOM(target, source);
            expect(target.innerHTML).to.equal('<span>Hallo</span> <span>World</span>');
        });
        it('removes existing elements', function() {
            source.innerHTML = '<span>Hallo</span>';
            target.innerHTML = '<span>Hallo</span> <span>World</span>';
            updateDOM(target, source);
            expect(target.innerHTML).to.equal('<span>Hallo</span>');
        });
        it('replaces elements by text nodes', function() {
            source.innerHTML = 'Hallo';
            target.innerHTML = '<span>Hallo</span>';
            updateDOM(target, source);
            expect(target.innerHTML).to.equal('Hallo');
        });
        it('replaces elements by other elements', function() {
            source.innerHTML = '<div>Hallo</div>';
            target.innerHTML = '<span class="muu-test">Hallo</span>';
            updateDOM(target, source);
            expect(target.innerHTML).to.equal('<div>Hallo</div>');
        });
        it('can replace and add elements in the same parent', function() {
            source.innerHTML = '<div>1</div> <div>2</div>';
            target.innerHTML = '<span>1</span>';
            updateDOM(target, source);
            expect(target.innerHTML).to.equal('<div>1</div> <div>2</div>');
        });
        it('can replace and remove elements in the same parent', function() {
            source.innerHTML = '<div>1</div>';
            target.innerHTML = '<span>1</span> <div>2</div>';
            updateDOM(target, source);
            expect(target.innerHTML).to.equal('<div>1</div>');
        });
        it('adds new attributes', function() {
            source.innerHTML = '<span class="test">Hallo</span>';
            target.innerHTML = '<span>Hallo</span>';
            updateDOM(target, source);
            expect(target.innerHTML).to.equal('<span class="test">Hallo</span>');
        });
        it('removes existing attributes', function() {
            source.innerHTML = '<span>Hallo</span>';
            target.innerHTML = '<span class="test">Hallo</span>';
            updateDOM(target, source);
            expect(target.innerHTML).to.equal('<span>Hallo</span>');
        });
        it('preserves all classes prefixed with "muu-"', function() {
            source.innerHTML = '<span class="test">Hallo</span>';
            target.innerHTML = '<span class="muu-test">Hallo</span>';
            updateDOM(target, source);
            expect(target.innerHTML).to.equal('<span class="test muu-test">Hallo</span>');
        });
        it('preserves input value', function() {
            source.innerHTML = '<input class="test">';
            target.innerHTML = '<input>';
            target.querySelector('input').value = '1';
            updateDOM(target, source);
            expect(target.innerHTML).to.equal('<input class="test">');
            expect(target.querySelector('input').value).to.equal('1');
        });
        it('preserves input value', function() {
            source.innerHTML = '<input type="checkbox" class="test">';
            target.innerHTML = '<input type="checkbox">';
            target.querySelector('input').checked = true;
            updateDOM(target, source);
            expect(target.innerHTML).to.contain('class="test"');
            expect(target.querySelector('input').checked).to.be.ok();
        });
    });
});
