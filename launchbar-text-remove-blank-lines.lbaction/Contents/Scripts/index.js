'use strict';
const lb = require('launchbar-node');

let output = []
process.argv.splice(2).forEach(str => {
  output.push(str.replace(/^\s*$\n/gm, ''))
});
lb.paste(output.join('\n'))
