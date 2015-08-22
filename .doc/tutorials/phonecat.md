*This tutorial is based on the [angular
tutorial](https://docs.angularjs.org/tutorial/) of the same name.*

# Creating a registry and a directive

Before we can start doing anything, we need to have a basic directive.  The
only muu related object you will ever have to create yourself is a *{@link
Registry}*.  It will take care of creating directives for you. Here is how it
is done:

    require(['muu'], function(Muu) {
        var registry = new Muu();
    });

*For simplicaty, the calls to require will be left out of all following
examples. `Muu` always refers to the `muu` module, `_` to `muu-js-helpers` and
`$` to `muu-dom-helpers`.*

Once you have a registry, you can register *directives* with it. In order to do
that, you will need a *name*, a *template*, and a *link* function.

    registry.registerDirective('hello', '<h1>Hello World</h1>', function(self, element) {
        self.update({});
    });

The link function is execute whenever you want to link a directive to a DOM
element. The first argument is an instance of the {@link Directive} class while
the second is the DOM element.  `self.update({})` means that the template
should be rendered and pushed to the DOM.

Now you have registered a new type of directive, but you still need to link it
to a DOM element. All muu directives use the tag `<muu>`. The `type` attribute
defines the name of the directive that should be used.

    <muu type="hello"></muu>

Now you can call `registry.linkAll(document)`. This will automatically link all
directives that can be found in th whole document. "Hello World" should now be
written on your screen.

# Static template

*muu can work with any templating system. See {@link Registry} on that. By
default (and in this tutorial), the minimal build-in templating engine is used.
For details on that, see {@link module:muu-template}.*

In this example, we want to create a catalog that displays a list of phones.
We can start off with this simple template:

    var template = '<ul>' +
            '{{#phones}}' +
            '<li>' +
                '<span>{{name}}</span>' +
                '<p>{{snippet}}</p>' +
            '</li>' +
            '{{/phones}}' +
        '</ul>';

    var phones = [
        {"age": 1, "name": "Samsung Gem", "snippet": "The Samsung Gem brings ..."},
        {"age": 2, "name": "Dell Venue", "snippet": "The Dell Venue; Your Personal ..."},
        {"age": 3, "name": "Nexus S", "snippet": "Fast just got faster with ..."}
    ];

    registry.registerDirective('phonecat', template, function(self, element) {
        self.update({
            phones: phones
        });
    });

This will render the template with the passed data.

# Events

We wouldn't need JavaScript if we did not want to react to runtime events. Of
course you could just register an event listener on some DOM element. But muu
is supposed to reduce the need to interact with the DOM.

The recommended way is to register an alias for a event. For example, you could
create a button like this:

    <a href="#" class="button" data-onclick="reverse"></a>

Any `click` event that is now triggered on this element will be forwarded to
the *directive element* as a `muu-reverse` event. So in your link function you
can do something like this:

    registry.registerDirective('phonecat', template, function(self, element) {
        element.addEventListener('muu-reverse', function() {
            self.update({
                phones: phones.reverse()
            });
        });

        self.update({
            phones: phones
        });
    });

# Working with a model

Next we want to allow to filter the list of phones. In order to do that, we
need to be able to receive the query from the DOM. In muu, this only works for
form inputs. So lets first add a search input to the template:

    <input type="search" name="query" data-onsearch="filter" />

Next, we can register a handler for the new `muu-filter` event in the link
function:

    registry.registerDirective('phonecat', template, function(self, element) {
        element.addEventListener('muu-filter', function() {
            var query = self.getModel('query', '');
            self.update({
                phones: phones.filter(function(phone) {
                    return phone.name.match(query);
                })
            });
        });

        self.update({
            phones: phones
        });
    });

You can also set models. If, for example, you wanted to clear the search input,
you could simply call `self.setModel('query', '')`.

# Nesting directives

The template for displaying a phone in the list is not immensly complex in this
example. But it might be in yours. In that case, you can simply wrap it in its
own directive.

    var listTemplate = '<ul>' +
            '{{#phones}}' +
            '<li>' +
                '<muu type="phone" data-name="{{name}}" data-snippet="{{snippet}}"></muu>' +
            '</li>' +
            '{{/phones}}' +
        '</ul>' +
        '<input type="search" name="query" data-onsearch="filter" />';
    registry.registerDirective('phonecat', listTemplate, function(self, element) {
        element.addEventListener('muu-filter', function() {
            var query = self.getModel('query', '');
            self.update({
                phones: phones.filter(function(phone) {
                    return phone.name.match(query);
                })
            });
        });

        self.update({
            phones: phones
        });
    });

    var singleTemplate = '<span>{{name}}</span><p>{{snippet}}</p>';
    registry.registerDirective('phone', singleTemplate, function(self, element) {
        self.update({
            name: element.dataset.name,
            snippet: element.dataset.snippet
        });
    });

This should work fine. But it only uses the attributes once. If the phonecat
directive would update, the phone drective would have to check whether its
attributes have changed.

To make that possible, the parent directive triggers a `muu-parent-update`
event on all of its child directives each time it updates.

*Note that the `muu-parent-update` event is triggered regardless of whether the
attributes have changed or not. It might be a good idea to check for actuall
changes before updating (which would also trigger updates on all child
directives ...).*

# Beware of memory leaks

We have seen how directives are created. But directives may also be removed
from the DOM again. In that case, standard JavaScript garbage collection kicks
in.

To avoid memory leaks, you need to remove any references from external services
to the directive. This can easily be done by returning a *unlink* function from
your link function:

    var template = 'This is a great joke {{#showit}}NOT{{/showit}}';
    registry.registerDirective('joke', template, function(self, element) {
        var timeoutID = setTimeout(function() {
            self.update({
                showit: true
            })
        }, 5000);

        self.update({
            showit: false
        });

        // unlink
        return function() {
            clearTimeout(timeoutID);
        };
    });
