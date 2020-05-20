"use strict";

const lb = require("launchbar-node");
const conf = require("@roeybiran/launchbar-config");
const got = require("got");

// https://www.dropbox.com/developers/documentation/http/documentation

const dbxRequest = async jsonBody => {
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
  const url =
    "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings";
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

(async () => {
  const promises = [];
  process.argv.slice(2).forEach(element => {
    const path = element.replace(/^.+?Dropbox/, "");
    const promise = dbxRequest({
      path
    })
      .then(data => {
        return data;
      })
      .catch(err => {
        return err;
      });
    promises.push(promise);
  });
  const urls = [];
  const errors = [];
  const resolved = await Promise.all(promises);
  resolved.forEach(x => {
    if (x.url) {
      urls.push(x.url);
    } else {
      errors.push(x);
    }
  });

  const message = `${urls.length} shared links copied to clipboard, ${errors.length} errors`;
  lb.displayNotification({ text: message });
  if (urls.length > 0) {
    lb.setClipboardString(urls.join("\n"));
  }
})();
