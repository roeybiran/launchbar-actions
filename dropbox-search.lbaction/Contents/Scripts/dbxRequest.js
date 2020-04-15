"use strict";

// https://www.dropbox.com/developers/documentation/http/documentation

const conf = require("@roeybiran/launchbar-config");
const got = require("got");

const DBX_ACCESS_TOKEN = conf.get("DBX_ACCESS_TOKEN");
if (!DBX_ACCESS_TOKEN) {
  console.log(
    JSON.stringify([
      {
        title: "Dropbox access token not found",
        icon: "font-awesome:fa-warning"
      }
    ])
  );
  process.exit();
}

module.exports = async (url, jsonBody) => {
  const request = await got(url, {
    json: jsonBody,
    headers: {
      Authorization: `Bearer ${DBX_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    method: "POST"
  });
  return JSON.parse(request.body);
};
