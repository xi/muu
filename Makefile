muu.dist.js: build.js muu.js directive.js dom-helpers.js evmgr.js updateDOM.js lodash.custom.min.js node_modules/requirejs/bin/r.js bower_components/mustache/mustache.min.js
	./node_modules/requirejs/bin/r.js -o build.js

lodash.custom.min.js: node_modules/lodash-cli/bin/lodash
	./node_modules/lodash-cli/bin/lodash -p modern strict exports=amd include=once,forEach,map,filter,union,difference

bower_components/mustache/mustache.min.js:
	bower install mustache

node_modules/lodash-cli/bin/lodash:
	npm install lodash-cli

node_modules/requirejs/bin/r.js:
	npm install requirejs
