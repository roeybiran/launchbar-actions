"use strict";

const lb = require("launchbar-node");
const dbxRequest = require("./dbxRequest");

(async () => {
  await lb.hide();
  const input = JSON.parse(process.argv[2]);
  let subtitle;
  let text;
  try {
    const response = await dbxRequest(
      "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
      {
        path: input.path
      }
    );
    await lb.setClipboardString(response.url);
    subtitle = `Successfully shared ${input.name}`;
    text = "Link copied to clipboard";
  } catch (error) {
    subtitle = "Error";
    text = error;
  }
  await lb.displayNotification({ text, subtitle });
})();
