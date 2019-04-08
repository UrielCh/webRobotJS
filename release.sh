#!/bin/sh

output=roboJsWeb-$(uname -m)-node-$(node --version | cut -d. -f1).js; tar -czf $output *.js node_modules
./node_modules/.bin/webpack --module-bind 'node=node-loader'
mv dist/webRobotJS.js $output

