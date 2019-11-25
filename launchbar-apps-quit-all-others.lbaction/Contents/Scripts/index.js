"use strict";
const frontapp = require('@roeybiran/front-app')
const dockapps = require('@roeybiran/running-dock-apps')
const quitapp = require('@roeybiran/quit-app')

const whitelist = [
    'com.apple.finder',
];

(async () => {
    const frontApp = await frontapp();
    const apps = await dockapps();
    for (const app of apps) {
        if ((!whitelist.includes(app)) && (app !== frontApp)) {
            quitapp(app)
        }
    }
})();
