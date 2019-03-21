// @ts-check

const rp = require('request-promise');
const delay = require('delay');

/* eslint indent: ["error", 4, { "ignoredNodes": ["ConditionalExpression"] }] */
/**
 * only fun service on port 9000
 */
// var environementP =

let servicePort = 9000;


if (servicePort > 0) {
  console.log('Try to kill old service on port', servicePort)
  rp(`http://127.0.0.1:${servicePort}/kill`)
    .then(undefined, () => Promise.resolve()).then(delay(400)).then(() => {
      console.log('Starting now')
      require('./web').listen(servicePort)
    })
}