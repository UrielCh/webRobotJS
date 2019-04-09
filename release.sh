#!/bin/sh
set -e
output=roboJsWeb-$(uname -m)-node-$(node --version | cut -d. -f1);
PRJ_HOME=$(pwd)

echo building $output
rm -rf node_modules dist/main.js dist/robotjs.node;
npm install;
echo Starting webpack
./node_modules/.bin/webpack;
echo webpack done building tar.gz
cp "${PRJ_HOME}"/node_modules/robotjs/build/Release/robotjs.node dist/;
cd dist
sed -i s@\""${PRJ_HOME}"/node_modules/robotjs/build/Release/robotjs.node\"@require'("path").resolve(__dirname,"robotjs.node")'@ main.js;
sed -i s@"${PRJ_HOME}"/node_modules/robotjs/build/Release/@__dirname+@ main.js;
tar -cvzf $output.tar.gz main.js robotjs.node;

