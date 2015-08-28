0.1.0
=====

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


0.0.0 (2015-10-23)
==================

*initial release*
