/* global define, describe, it, expect, beforeEach, sinon */
define(['muu', 'muu-directive', 'muu-js-helpers'], function(Registry, Directive, _) {
    "use strict";

    describe('Registry', function() {
        var registry;

        beforeEach(function() {
            registry = new Registry();
        });

        describe('registerDirective', function() {
            it('is chainable', function() {
                var result = registry.registerDirective('name', 'template', null);
                expect(result).to.be(registry);
            });
        });

        describe('registerModule', function() {
            it('calls the passed function with the registry itself', function() {
                var module = sinon.spy();
                registry.registerModule(module);
                expect(module.calledWith(registry)).to.be(true);
            });
            it('is chainable', function() {
                var module = sinon.spy();
                var result = registry.registerModule(module);
                expect(result).to.be(registry);
            });
        });

        describe('link', function() {
            var template;
            var link;
            var unlink;
            var element;

            beforeEach(function() {
                template = 'template';
                unlink = sinon.spy();
                link = sinon.spy(function() {
                    return unlink;
                });
                registry.registerDirective('test', template, link);
                element = document.createElement('muu');
            });

            it('uses the registered link function', function() {
                registry.link(element, 'test');
                expect(link.called).to.be(true);
            });
            it('returns the created directive', function() {
                var directive = registry.link(element, 'test');
                expect(Directive.prototype.isPrototypeOf(directive)).to.be(true);
            });
            it('uses the registered template', function() {
                sinon.spy(registry, 'renderer');

                var directive = registry.link(element, 'test');
                directive.update();
                expect(registry.renderer.calledWith(template)).to.be(true);
            });
            it('uses the type argument if provided', function() {
                var link2 = sinon.spy();
                registry.registerDirective('test2', template, link2);
                element.setAttribute('type', 'test');

                registry.link(element, 'test2');
                expect(link.called).to.be(false);
                expect(link2.called).to.be(true);
            });
            it('uses the elements type attribute if no type has been provided', function() {
                element.setAttribute('type', 'test');
                registry.link(element);
                expect(link.called).to.be(true);
            });
            it('throws if the provided type has not been registered', function() {
                expect(registry.link).withArgs(element, 'non existing').to.throwError();
            });
            it('adds the `muu-isolate` class', function() {
                registry.link(element, 'test');
                expect(element.className).to.contain('muu-isolate');
            });
            it('adds the `muu-initialised` class', function() {
                registry.link(element, 'test');
                expect(element.className).to.contain('muu-initialised');
            });
            it('creates `element.directive` in debug mode', function() {
                registry.config.debug = true;
                var directive = registry.link(element, 'test');
                expect(element.directive).to.be(directive);
            });
            it('does not create `element.directive` in non-debug mode', function() {
                registry.config.debug = false;
                registry.link(element, 'test');
                expect(element.directive).to.be(undefined);
            });
            it('calls unlink when the element is directly removed from the DOM', function() {
                document.body.appendChild(element);
                registry.link(element, 'test');
                expect(unlink.called).to.be(false);

                document.body.removeChild(element);
                expect(unlink.called).to.be(true);
            });
            it('calls unlink when the element is removed from the DOM as part of a subtree', function() {
                var wrapper = document.createElement('div');
                document.body.appendChild(wrapper);
                wrapper.appendChild(element);
                registry.link(element, 'test');
                expect(unlink.called).to.be(false);

                wrapper.innerHTML = '';
                expect(unlink.called).to.be(true);

                // cleanup
                document.body.removeChild(wrapper);
            });
        });

        describe('linkAll', function() {
            it('calls `link` for all unitialised directives inside root', function() {
                var root = document.createElement('div');
                root.innerHTML = '<div>1</div>' +
                    '<muu>2</muu>' +
                    '<muu class="muu-initialised">3</muu>' +
                    '<div><muu>4</muu></div>';
                registry.link = sinon.spy();
                registry.linkAll(root);

                var results = _.map(registry.link.args, function(args) {
                    return args[0].textContent;
                });
                expect(results).to.eql(['2', '4']);
            });
            it('returns the list of directives', function() {
                var root = document.createElement('div');
                root.innerHTML = '<div>1</div>' +
                    '<muu>2</muu>' +
                    '<muu class="muu-initialised">3</muu>' +
                    '<div><muu>4</muu></div>';
                registry.link = sinon.spy(function(element) {
                    return element.textContent;
                });
                var results = registry.linkAll(root);

                expect(results).to.eql(['2', '4']);
            });
        });
    });
});
