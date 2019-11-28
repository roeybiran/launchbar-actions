'use strict';
const snakeCase = require('snake-case')
const lb = require('launchbar-node');

(async () => {
    const text = snakeCase(process.argv[2])
    if (lb.options.commandKey) {
        return console.log(text);
    } else {
        return await lb.paste(text);
    }
})();
