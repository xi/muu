define(['muu-template'], function(muuTemplate) {
    describe('muuTemplate', function() {
        it('do variable replacement', function() {
            var template = '{{asd}}'
            var result = muuTemplate(template, {asd: 'huhu'});
            expect(result).to.equal('huhu');
        });
    });
});
