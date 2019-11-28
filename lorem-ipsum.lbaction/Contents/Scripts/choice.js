"use strict";

const faker = require("faker");
const lb = require("launchbar-node");

const input = JSON.parse(process.argv[2]);

const { args } = input;
const count = parseInt(input.count, 10);

let fakeData = [];

for (let index = 0; index < count; index += 1) {
  fakeData.push(faker[args[0]][args[1]]());
}

fakeData = fakeData.join("\n");
lb.setClipboardString(fakeData);
lb.paste(fakeData);
