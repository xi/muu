muu.min.js: build.js src/*.js node_modules/requirejs/bin/r.js
	./node_modules/requirejs/bin/r.js -o build.js

node_modules/requirejs/bin/r.js:
	npm install requirejs
