"use strict";

const dbxRequest = require("./dbxRequest");

(async () => {
  let output;
  const userInput = process.argv[2] || process.exit();
  try {
    const icon = "font-awesome:fa-dropbox";
    const response = await dbxRequest(
      "https://api.dropboxapi.com/2/files/search_v2",
      {
        query: userInput
      }
    );
    output = response.matches.map(x => {
      const itemMeta = x.metadata.metadata;
      const { name } = itemMeta;
      const title = name;
      const subtitle = itemMeta.path_display;
      const path = subtitle;
      return {
        title,
        subtitle,
        icon,
        url: `https://www.dropbox.com/home${encodeURI(itemMeta.path_lower)}`,
        children: [
          {
            title: `Share ${title}`,
            name,
            path,
            subtitle,
            icon,
            action: "share.sh",
            actionRunsInBackground: true,
            actionReturnsItems: false
          }
        ]
      };
    });
  } catch (error) {
    output = error;
  }
  console.log(JSON.stringify(output));
})();
