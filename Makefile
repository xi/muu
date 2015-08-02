muu.dist.js: build.js muu.js directive.js dom-helpers.js evmgr.js updateDOM.js js-helpers.js node_modules/requirejs/bin/r.js bower_components/mustache/mustache.min.js
	./node_modules/requirejs/bin/r.js -o build.js

bower_components/mustache/mustache.min.js:
	bower install mustache

node_modules/requirejs/bin/r.js:
	npm install requirejs
