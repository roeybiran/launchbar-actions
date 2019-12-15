"use strict";

const getJSON = require("@roeybiran/launchbar-get-json");
const cache = require("@roeybiran/launchbar-cache");

(async () => {
  try {
    let input = process.argv[2];

    // TODO: MODULIZE (ARBITRARY SEARCH)
    if (/^\?/.test(input)) {
      const inputNoQuestionMark = input.slice(1);
      const url = `https://github.com/search?q=${inputNoQuestionMark}`;
      return console.log(
        JSON.stringify([
          {
            title: `Search GitHub.com for "${inputNoQuestionMark}"`,
            subtitle: url,
            url,
            quickLookURL: url,
            actionRunsInBackground: true
          }
        ])
      );
    }

    let noQueryTitle = "Enter repository name";
    let quickLookURLSuffix = "#readme";
    let url = "https://api.github.com/search/";
    const icon = "font-awesome:fa-github-square";

    const rawUserInput = input;
    // prepend input with user: to search for users
    if (input.startsWith("usr:")) {
      input = input.replace("usr:", "");
      url += `users?q=${input}`;
      noQueryTitle = "Enter a user's name";
      quickLookURLSuffix = "";
    } else {
      url += `repositories?q=${input}&sort=stars&order=desc`;
    }
    if (input.length === 0) {
      console.log(
        JSON.stringify({
          title: noQueryTitle,
          icon
        })
      );
      process.exit();
    }

    const cachedOutput = cache.get(rawUserInput);
    let output;

    if (!cachedOutput) {
      const result = await getJSON(url);
      output = result.items.map(item => {
        const itemURL = item.html_url;
        return {
          title: item.name || item.login,
          subtitle: item.description || undefined,
          url: itemURL,
          quickLookURL: `${itemURL}${quickLookURLSuffix}`,
          badge: (item.owner && item.owner.login) || undefined,
          icon
        };
      });
      cache.set(rawUserInput, output, { maxAge: 604800000 });
    } else {
      output = cachedOutput;
    }

    return console.log(JSON.stringify(output));
  } catch (error) {
    return console.log(JSON.stringify(error));
  }
})();
