'use strict';
const windows = require('finder-windows');

(async() => {
    let result = await windows.allFinderWindows();
    result = result.map(x => { return { path: x } })
    console.log(JSON.stringify(result));
})()
