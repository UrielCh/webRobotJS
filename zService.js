// @ts-check
/* eslint indent: ["error", 4, { "ignoredNodes": ["ConditionalExpression"] }] */

const rp = require('request-promise');
const delay = require('delay');

async function killRun(servicePort) {
  console.log('Try to kill old service on port', servicePort);
  let pass = 0;
  try {
    while (pass < 20) {
      await rp(`http://127.0.0.1:${servicePort}/kill`);
      await delay(1000);
    }
  } catch (e) {
    console.log('Starting now');
    require('./web').listen(servicePort);
    return;
  }
  console.error(`${servicePort} is bussy`);
}
killRun(9000);
