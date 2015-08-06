/* global define, describe, it, beforeEach, afterEach, expect, sinon */
define(['muu-js-helpers'], function(_) {
    "use strict";

    var monkeyPatchArray = function(feature, tests) {
        describe('native', function() {
            tests();
        });
        describe('custom', function() {
            var orig = Array.prototype[feature];

            beforeEach(function() {
                delete Array.prototype[feature];
            });

            afterEach(function() {
                Array.prototype[feature] = orig;
            });

            tests();
        });
    };

    describe('muuJsHelpers', function() {
        describe('once', function() {
            it ('executes the wrapped function only once', function() {
                var inner = sinon.spy();
                var fn = _.once(inner);

                expect(inner).to.have.callCount(0);
                fn();
                expect(inner).to.have.callCount(1);
                fn();
                expect(inner).to.have.callCount(1);
                fn();
                expect(inner).to.have.callCount(1);
            });
            it ('returns a constant function', function() {
                var inner = sinon.stub().returns(1);
                var fn = _.once(inner);

                expect(fn()).to.equal(1);

                inner.returns(2);
                expect(fn()).to.equal(1);
            });
        });

        describe('indexOf', function() {
            monkeyPatchArray('indexOf', function() {
                it('returns the correct index', function() {
                    expect(_.indexOf([4,6,2,4], 6)).to.equal(1);
                });
                it('returns the first correct index', function() {
                    expect(_.indexOf([4,6,2,4], 4)).to.equal(0);
                });
                it('returns -1 if the item is not in the array', function() {
                    expect(_.indexOf([4,6,2,4], 5)).to.equal(-1);
                });
            });
        });

        describe('forEach', function() {
            monkeyPatchArray('forEach', function() {
                it('executes the function for each item', function() {
                    var items = [1, 2, 3];
                    var results = [];
                    _.forEach(items, function(item) {
                        results.push(item * item);
                    });
                    expect(results).to.eql([1,4,9]);
                });
            });
        });

        describe('map', function() {
            monkeyPatchArray('map', function() {
                it('executes the function for each item', function() {
                    var items = [1, 2, 3];
                    var results = [];
                    _.map(items, function(item) {
                        results.push(item * item);
                    });
                    expect(results).to.eql([1,4,9]);
                });
                it('maps the items to an output array', function() {
                    var items = [1, 2, 3];
                    var results = _.map(items, function(item) {
                        return item * item;
                    });
                    expect(results).to.eql([1,4,9]);
                });
            });
        });

        describe('filter', function() {
            monkeyPatchArray('filter', function() {
                it('includes exactly those items in the result, for which the function is truthy', function() {
                    var items = [1, 2, 3];
                    var results = _.filter(items, function(item) {
                        return item * item < 8;
                    });
                    expect(results).to.eql([1,2]);
                });
            });
        });

        describe('union', function() {
            it('returns the set union of all passed lists', function() {
                var input = [[1,1,2,3], [2,3,4], [4,5,3]];
                expect(_.union(input)).to.eql([1,2,3,4,5]);
            });
        });

        describe('difference', function() {
            it('returns the first without all item from the second list', function() {
                expect(_.difference([1,1,2,3], [3,4])).to.eql([1,1,2]);
            });
        });
    });
});
