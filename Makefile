muu.min.js: build.js src/*.js node_modules/requirejs/bin/r.js
	./node_modules/requirejs/bin/r.js -o build.js

doc: doc/.touch

doc/.touch: src/*.js node_modules/jsdoc/jsdoc.js .doc/conf.json .doc/styles/* bower.json README.md
	./node_modules/jsdoc/jsdoc.js --pedantic --package bower.json -c .doc/conf.json README.md src/*.js && touch doc/.touch

node_modules/requirejs/bin/r.js:
	npm install requirejs

node_modules/jsdoc/jsdoc.js:
	npm install jsdoc
