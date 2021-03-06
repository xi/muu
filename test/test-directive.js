/* global define, describe, it, expect, beforeEach, sinon */
define(['directive', 'update-dom', 'js-helpers', 'dom-helpers'], function(Directive, updateDOM, _, $) {
    "use strict";

    describe('muuDirective', function() {
        var registry;

        beforeEach(function() {
            registry = {
                linkAll: sinon.spy(),
                renderer: sinon.spy(function(template) {
                    return template;
                }),
                updateDOM: updateDOM,
                events: ['keydown', 'keyup', 'click', 'change', 'search'],
            };
        });

        describe('update', function() {
            it('renders the new data to the DOM', function() {
                var element = document.createElement('div');
                var template = '<span class="test">foo bar</span>';
                var directive = new Directive(element, template, registry);

                var data = 'testdata';
                directive.update(data);
                expect(registry.renderer.calledWith(template, data)).to.be(true);
                expect(element.querySelector('.test').textContent).to.equal('foo bar');

                data = 5;
                directive.update(data);
                expect(registry.renderer.calledWith(template, data)).to.be(true);
            });
            it('registers event aliases', function() {
                var element = document.createElement('div');
                var template = '<a class="button" data-onclick="test"></a>';
                var directive = new Directive(element, template, registry);
                directive.update({});

                var button = element.querySelector('.button');
                var spy = sinon.spy();
                element.addEventListener('muu-test', spy, false);

                expect(spy.callCount).to.equal(0);
                button.dispatchEvent($.createEvent('click'));
                expect(spy.callCount).to.equal(1);
                button.dispatchEvent($.createEvent('click'));
                expect(spy.callCount).to.equal(2);
                button.dispatchEvent($.createEvent('click'));
                expect(spy.callCount).to.equal(3);
            });
            it('registers event aliases for non-target elements', function() {
                var element = document.createElement('div');
                var template = '<div data-onclick="test"><a href="#" class="button"></a></div>';
                var directive = new Directive(element, template, registry);
                directive.update({});

                var button = element.querySelector('.button');
                var spy = sinon.spy();
                element.addEventListener('muu-test', spy, false);

                document.body.appendChild(element);
                expect(spy.callCount).to.equal(0);
                button.dispatchEvent($.createEvent('click', true));
                expect(spy.callCount).to.equal(1);
                button.dispatchEvent($.createEvent('click', true));
                expect(spy.callCount).to.equal(2);
                button.dispatchEvent($.createEvent('click', true));
                expect(spy.callCount).to.equal(3);
                document.body.removeChild(element);
            });
            it('initialises new child directives', function() {
                var element = document.createElement('div');
                var template = '';
                var directive = new Directive(element, template, registry);
                directive.update({});

                expect(registry.linkAll.calledWith(directive)).to.be(true);
            });
            it('triggers the "muu-parent-update" event on child directives', function() {
                var element = document.createElement('div');
                var template = '<muu class="muu-initialised"></muu>';
                var directive = new Directive(element, template, registry);
                directive.update({});

                var subdirective = element.querySelector('muu');
                var spy = sinon.spy();
                subdirective.addEventListener('muu-parent-update', spy, false);

                expect(spy.callCount).to.equal(0);
                directive.update({});
                expect(spy.callCount).to.equal(1);
                directive.update({});
                expect(spy.callCount).to.equal(2);
                directive.update({});
                expect(spy.callCount).to.equal(3);
            });
        });

        describe('querySelectorAll', function() {
            it('returns the first matching descendant that is not isolated', function() {
                var element = document.createElement('div');
                var template = '<div class="muu-isolate"><span class="test">1</span></div>';
                template += '<span class="test">2</span>';
                template += '<span class="test">3</span>';
                var directive = new Directive(element, template, registry);
                directive.update({});

                var results = directive.querySelectorAll('.test');
                expect(_.map(results, function(r) {
                    return r.textContent;
                })).to.eql(['2', '3']);
            });
        });

        describe('querySelector', function() {
            it('returns the first matching descendant that is not isolated', function() {
                var element = document.createElement('div');
                var template = '<div class="muu-isolate"><span class="test">1</span></div>';
                template += '<span class="test">2</span>';
                template += '<span class="test">3</span>';
                var directive = new Directive(element, template, registry);
                directive.update({});

                expect(directive.querySelector('.test').textContent).to.equal('2');
            });
        });

        describe('on', function() {
            var directive;
            var button;

            beforeEach(function() {
                var element = document.createElement('div');
                var template = '<a class="button" data-onclick="test"></a>';
                directive = new Directive(element, template, registry);
                directive.update({});
                button = element.querySelector('.button');
            });

            it('registers an event listener for an event alias', function() {
                var spy = sinon.spy();
                directive.on('test', spy);

                expect(spy.callCount).to.equal(0);
                button.dispatchEvent($.createEvent('click'));
                expect(spy.callCount).to.equal(1);
                button.dispatchEvent($.createEvent('click'));
                expect(spy.callCount).to.equal(2);
                button.dispatchEvent($.createEvent('click'));
                expect(spy.callCount).to.equal(3);
            });
            it('calls callback with original event', function() {
                var spy = sinon.spy();
                directive.on('test', spy);

                button.dispatchEvent($.createEvent('click', undefined, undefined, 'asd'));
                expect(spy.firstCall.args[0].detail).to.equal('asd');
            });
            it('can register more than one event listener', function() {
                var spy1 = sinon.spy();
                directive.on('test', spy1);

                expect(spy1.callCount).to.equal(0);
                button.dispatchEvent($.createEvent('click'));
                expect(spy1.callCount).to.equal(1);

                var spy2 = sinon.spy();
                directive.on('test', spy2);

                expect(spy2.callCount).to.equal(0);
                button.dispatchEvent($.createEvent('click'));
                expect(spy1.callCount).to.equal(2);
                expect(spy2.callCount).to.equal(1);
                button.dispatchEvent($.createEvent('click'));
                expect(spy1.callCount).to.equal(3);
                expect(spy2.callCount).to.equal(2);
            });
            it('returns an unregister function', function() {
                var spy = sinon.spy();
                var unregister = directive.on('test', spy);

                expect(spy.callCount).to.equal(0);
                button.dispatchEvent($.createEvent('click'));
                expect(spy.callCount).to.equal(1);

                unregister();

                button.dispatchEvent($.createEvent('click'));
                expect(spy.callCount).to.equal(1);
                button.dispatchEvent($.createEvent('click'));
                expect(spy.callCount).to.equal(1);
            });
        });

        describe('getModel', function() {
            var directive;

            beforeEach(function() {
                var element = document.createElement('div');
                var template = '<input name="test" value="foobar" />';
                template += '<input name="test-empty" />';
                template += '<input name="yes" type="checkbox" checked="checked" /><input name="no" type="checkbox" />';
                template += '<input name="test-radio" type="radio" checked="checked" value="foo" /><input name="test-radio" type="radio" value="bar" />';
                template += '<input name="test-number" type="number" value="1.5" />';
                directive = new Directive(element, template, registry);
                directive.update({});
            });

            it('returns the value of the form input with the specified name', function() {
                expect(directive.getModel('test')).to.equal('foobar');
            });
            it('still returns the value of the form input with the specified name if it is empty', function() {
                expect(directive.getModel('test-empty')).to.equal('');
            });
            it('returns default if no input with the specified name exists', function() {
                expect(directive.getModel('noexistent')).to.be(undefined);
                expect(directive.getModel('noexistent', 123)).to.be(123);
            });
            it('returns a boolean for checkboxes', function() {
                expect(directive.getModel('yes')).to.be(true);
                expect(directive.getModel('no')).to.be(false);
            });
            it('returns the selected value for radioboxes', function() {
                expect(directive.getModel('test-radio')).to.equal('foo');
            });
            it('returns the selected value as number for number input', function() {
                expect(directive.getModel('test-number')).to.equal(1.5);
            });
            it('returns all formdata as a flat object if no name is specified', function() {
                expect(directive.getModel()).to.eql({
                    test: 'foobar',
                    'test-empty': '',
                    yes: true,
                    no: false,
                    'test-radio': 'foo',
                    'test-number': 1.5
                });
            });
        });

        describe('setModel', function() {
            var directive;
            var element;

            var byName = function(name) {
                return element.querySelector('[name=' + name + ']');
            };

            beforeEach(function() {
                element = document.createElement('div');
                var template = '<input name="test" value="foobar" />';
                template += '<input name="test-check" type="checkbox" checked="checked" />';
                template += '<input name="test-radio" type="radio" checked="checked" value="foo" /><input name="test-radio" type="radio" value="bar" />';
                directive = new Directive(element, template, registry);
                directive.update({});
            });

            it('sets the value of the form input with the specified name', function() {
                directive.setModel('test', 'baz');
                expect(byName('test').value).to.equal('baz');
            });
            it('sets the checked property on checkboxes', function() {
                directive.setModel('test-check', true);
                expect(byName('test-check').checked).to.be(true);
                directive.setModel('test-check', false);
                expect(byName('test-check').checked).to.be(false);
                directive.setModel('test-check', true);
                expect(byName('test-check').checked).to.be(true);
            });
            it('sets the checked property on radioboxes', function() {
                var choices = element.querySelectorAll('[name=test-model]');

                directive.setModel('test-radio', 'foo');
                for (var i = 0; i < choices.length; i++) {
                    expect(choices[i].checked).to.be(i === 0);
                }
                directive.setModel('test-radio', 'bar');
                for (i = 0; i < choices.length; i++) {
                    expect(choices[i].checked).to.be(i === 1);
                }
                directive.setModel('test-radio', 'baz');
                for (i = 0; i < choices.length; i++) {
                    expect(choices[i].checked).to.be(false);
                }
            });
            it('throws if no input with the specified name exists', function() {
                expect(directive.setModel).withArgs('noexistent', 123).to.throwError();
            });
        });
    });
});
