"use strict";
const runningApps = require('@roeybiran/running-dock-apps');
const quitApp = require('@roeybiran/quit-app');

const whitelist = [
    'com.apple.finder',
];

(async () => {
    const result = await runningApps();
    result.forEach(app => {
        if (!whitelist.includes(app)) {
            quitApp(app)
        }
    });
})()
