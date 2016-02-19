/* global define, describe, it, beforeEach, expect, sinon */
define(['dom-helpers'], function($) {
    "use strict";

    describe('muuDomHelpers', function() {
        var createRadioBox = function(value, checked) {
            var option = document.createElement('input');
            option.type = 'radio';
            option.value = value;
            option.checked = checked;
            return option;
        };

        describe('escapeHtml', function() {
            it('escapes all relevant HTML entities', function() {
                var source = ';/><script>alert("XSS!")</script>';
                var expected = ';&#x2F;&gt;&lt;script&gt;alert(&quot;XSS!&quot;)&lt;&#x2F;script&gt;';
                expect($.escapeHtml(source)).to.equal(expected);
            });
        });

        describe('createEvent', function() {
            it('creates an event with specified type', function() {
                var event = $.createEvent('foobar');
                expect(event.type).to.equal('foobar');
            });
            it('creates an event with specified details', function() {
                var event = $.createEvent('foobar', undefined, undefined, 37);
                expect(event.detail).to.equal(37);
            });
            it('creates an event with specified bubbles', function() {
                var event1 = $.createEvent('foobar', true);
                expect(event1.bubbles).to.be(true);
                var event2 = $.createEvent('foobar', false);
                expect(event2.bubbles).to.be(false);
            });
            it('creates an event with specified cancelable', function() {
                var event1 = $.createEvent('foobar', undefined, true);
                expect(event1.cancelable).to.be(true);
                var event2 = $.createEvent('foobar', undefined, false);
                expect(event2.cancelable).to.be(false);
            });
        });

        describe('on', function() {
            var element;
            var callback;
            var unregister;

            beforeEach(function() {
                element = document.createElement('div');
                callback = sinon.spy();
                unregister = $.on(element, 'x-click', callback);
            });

            it('calls callback when the event is triggered', function() {
                element.dispatchEvent($.createEvent('x-click'));
                expect(callback.callCount).to.be.greaterThan(0);
            });
            it('calls callback each time the event is triggered', function() {
                element.dispatchEvent($.createEvent('x-click'));
                expect(callback.callCount).to.be(1);

                element.dispatchEvent($.createEvent('x-click'));
                expect(callback.callCount).to.be(2);
            });
            it('does not call callback on other event', function() {
                element.dispatchEvent($.createEvent('not-click'));
                expect(callback.callCount).to.be(0);
            });
            it('does not call callback anymore once unregister has been called', function() {
                unregister();
                element.dispatchEvent($.createEvent('x-click'));
                expect(callback.callCount).to.be(0);
            });
        });

        describe('ready', function() {});

        describe('destroy', function() {
            it('calls the passed function when the element is directly removed from the DOM', function(done) {
                var element = document.createElement('div');
                document.body.appendChild(element);

                var spy = sinon.spy();
                $.destroy(element, spy);

                expect(spy.called).to.be(false);
                document.body.removeChild(element);

                setTimeout(function() {
                    expect(spy.called).to.be(true);
                    done();
                }, 10);
            });
            it('calls the passed function when the element is removed from the DOM as part of a subtree', function(done) {
                var element = document.createElement('div');
                var wrapper = document.createElement('div');
                document.body.appendChild(wrapper);
                wrapper.appendChild(element);

                var spy = sinon.spy();
                $.destroy(element, spy);

                expect(spy.called).to.be(false);
                wrapper.innerHTML = '';

                setTimeout(function() {
                    expect(spy.called).to.be(true);

                    // cleanup
                    document.body.removeChild(wrapper);
                    done();
                }, 10);
            });
        });

        describe('getRadio', function() {
            it('returns the value of the checked element from the given array', function() {
                var options = [
                    createRadioBox(0),
                    createRadioBox(1, true),
                    createRadioBox(2)
                ];
                expect($.getRadio(options)).to.equal('1');
            });
            it('returns the value of the first checked element from the given array', function() {
                var options = [
                    createRadioBox(0),
                    createRadioBox(1, true),
                    createRadioBox(2, true)
                ];
                expect($.getRadio(options)).to.equal('1');
            });
            it('returns undefined if no element is checked', function() {
                var options = [
                    createRadioBox(0),
                    createRadioBox(1),
                    createRadioBox(2)
                ];
                expect($.getRadio(options)).to.be(undefined);
            });
            it('returns undefined if the passed array is empty', function() {
                var options = [];
                expect($.getRadio(options)).to.be(undefined);
            });
        });

        describe('setRadio', function() {
            it('sets the element with the given value to checked', function() {
                var options = [
                    createRadioBox(0),
                    createRadioBox(1),
                    createRadioBox(2)
                ];
                $.setRadio(options, '1');
                expect(options[1].checked).to.be.ok();
            });
            it('sets the previously checked element to unchecked', function() {
                var options = [
                    createRadioBox(0, true),
                    createRadioBox(1),
                    createRadioBox(2)
                ];
                $.setRadio(options, '1');
                expect(options[0].checked).not.to.be.ok();
            });
            it('sets all previously checked elements to unchecked', function() {
                var options = [
                    createRadioBox(0, true),
                    createRadioBox(1),
                    createRadioBox(2, true)
                ];
                $.setRadio(options, '1');
                expect(options[0].checked).not.to.be.ok();
                expect(options[2].checked).not.to.be.ok();
            });
        });
    });
});
