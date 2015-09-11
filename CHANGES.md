0.1.2 (2015-09-11)
==================

Breaking changes
----------------

-   The interface to register event listeners has been simplified. Before you
    had to write this:

        muu.$.on(element, 'muu-event-name', function(wrapperEvent) {
            var event = wrapperEvent.detail;
            ...
        });

    Now you should use this instead:

        directive.on('event-name', function(event) {
            ...
        });

    The old interface is deprecated, but guranteed to work until the next minor
    release.

-   The interface of `updateDOM()` has been changed to take a HTML string
    instead of a DOM node. This will make it easier to exchange it by third
    party libraries in the future.

Enhancements
------------

-   `Directive.setModel()` now only changes the DOM if the value has actually
    changed. This way, selection is preserved in more cases.

Bugfixes
--------

-   A bug in `updateDOM()` has been fixed where replacing more than one node in a
    parent threw an exception.


0.1.1 (2015-08-31)
==================

Breaking changes
----------------

-   `$.createEvent` has now a very similar signature to
    [`initEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/initCustomEvent),
    i.e. `detail` is now the fourth instead of second argument.

Enhancements
------------

-   `getModel()` now returns a number if the input element has type `number`.

Bugfixes
--------

-   Event aliases previously only worked if the element where the alias is
    defined is the target of that event.


0.1.0 (2015-08-28)
==================

Breaking changes
----------------

-   The public API has changed: Instead of many AMD modules there is now one
    UMD module exporting an object that provides access to the following
    resources:

    -   `Registry` (formally exported from module `muu`)
    -   `$` (formally exported from module `muu-dom-helpers`
    -   `$location` (formally exported from module `muu-location`)

    There is now also a minimal build in `dist/muu-core.js` that does not
    contain   `muu-template`, `muu-js-helpers`, `muu-location` or `muu-search`.
    Instead, it depends on lodash.

-   `updateDOM` does no longer change the Node it is called on. As a
    consequence, the `<div>` wrapper inside of a `<muu>` element is no longer
    required and was removed.

Enhancements
------------

-   The build-in templating system has two new features:
    -   inverted loops render the content once if the value is falsy
    -   `this` can now be used to refer to the scope as a whole

Bugfixes
--------

-   A bug in `$.destroy` that caused it to always use the fallback
    implementation was fixed.


0.0.0 (2015-08-23)
==================

*initial release*
