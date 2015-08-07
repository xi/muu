/* global define, describe, it, beforeEach, expect, sinon */
define(['muu-dom-helpers'], function($) {
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

        describe('on', function() {
            var element;
            var callback;
            var unregister;

            beforeEach(function() {
                element = document.createElement('div');
                callback = sinon.spy();
                unregister = $.on(element, 'click', callback);
            });

            it('calls callback when the event is triggered', function() {
                element.dispatchEvent(new Event('click'));
                expect(callback).to.have.been.called();
            });
            it('calls callback each time the event is triggered', function() {
                element.dispatchEvent(new Event('click'));
                expect(callback).to.have.been.calledOnce();

                element.dispatchEvent(new Event('click'));
                expect(callback).to.have.been.calledTwice();
            });
            it('does not call callback on other event', function() {
                element.dispatchEvent(new Event('not-click'));
                expect(callback).not.to.have.been.called();
            });
            it('does not call callback anymore once unregister has been called', function() {
                unregister();
                element.dispatchEvent(new Event('click'));
                expect(callback).not.to.have.been.called();
            });
        });

        describe('ready', function() {});

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
                expect($.getRadio(options)).not.to.exist();
            });
            it('returns undefined if the passed array is empty', function() {
                var options = [];
                expect($.getRadio(options)).not.to.exist();
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
