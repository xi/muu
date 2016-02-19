dist/muu.js: JS := src/*.js
dist/muu-core.js: LODASH := 1
dist/muu-core.js: JS := src/index.js src/directive.js src/dom-helpers.js src/registry.js src/update-dom.js

all: dist/muu.min.js dist/muu-core.min.js

dist/%.min.js: dist/%.js node_modules/closure-compiler-jar/compiler.jar .build/externs.js
	java -jar node_modules/closure-compiler-jar/compiler.jar \
		--compilation_level SIMPLE_OPTIMIZATIONS \
		--use_types_for_optimization \
		--warning_level=VERBOSE \
		--jscomp_warning=missingProperties \
		--jscomp_warning=checkTypes \
		--externs .build/externs.js \
		--js $< \
		--js_output_file $@

dist/%.js: .build/template.js src/*.js
	mkdir -p dist
	head -n -3 $< > .build/head.js
	if [ -z ${LODASH} ]; then sed -i "s/require('lodash')//g" .build/head.js; fi
	if [ -z ${LODASH} ]; then sed -i "s/'lodash'//g" .build/head.js; fi
	tail -n 4 $< > .build/tail.js
	cat ${JS} |\
		sed 's/^/        /g' |\
		sed 's/ *$$//g' |\
		sed 's/define(/_define(/g' > .build/modules.js
	cat .build/head.js .build/modules.js .build/tail.js > $@
	rm .build/head.js
	rm .build/tail.js
	rm .build/modules.js

doc: doc/.touch

doc/.touch: src/*.js node_modules/jsdoc/jsdoc.js .doc/conf.json .doc/styles/* .doc/tutorials/*.md bower.json README.md
	./node_modules/jsdoc/jsdoc.js --pedantic --package bower.json -u .doc/tutorials -c .doc/conf.json README.md src/*.js && touch doc/.touch

node_modules/closure-compiler-jar/compiler.jar:
	npm install closure-compiler-jar

node_modules/jsdoc/jsdoc.js:
	npm install jsdoc

push-doc: doc
	git stash
	cp -r doc/muu doc-tmp
	git checkout gh-pages
	rm -r muu
	mv doc-tmp muu
	git add muu
	git commit -am "update docs"
	git push origin gh-pages
	git checkout master
	git stash pop
