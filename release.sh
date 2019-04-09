#!/bin/sh
set -e
output=robotJsWeb-$(uname -m)-node-$(node --version | cut -d. -f1);
PRJ_HOME=$(pwd)

echo building $output
rm -rf node_modules dist/main.js dist/robotjs.node;
npm install;
echo Starting webpack
./node_modules/.bin/webpack;
echo webpack done building tar.gz
cp "${PRJ_HOME}"/node_modules/robotjs/build/Release/robotjs.node dist/;
cd dist
cat main.js | \
 sed s@\""${PRJ_HOME}"/node_modules/robotjs/build/Release/robotjs.node\"@require'("path").resolve(__dirname,"robotjs.node")'@ |
 sed s@"${PRJ_HOME}"/node_modules/robotjs/build/Release/@__dirname+@ > main2.js
mv main2.js main.js
tar -cvzf $output.tar.gz main.js robotjs.node;

