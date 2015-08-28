dist/muu.js: JS := src/*.js
dist/muu-core.js: LODASH := 1
dist/muu-core.js: JS := src/muu-directive.js src/muu-dom-helpers.js src/muu.js src/muu-registry.js src/muu-update-dom.js

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
