"use strict";

const cache = require("@roeybiran/launchbar-cache");
const getJSON = require("@roeybiran/launchbar-get-json");

(async () => {
  const input = process.argv[2] || process.exit();

  // Do not boost exact matches by unless input is quoted
  const q = /^("|').+?('|$)/.test(input)
    ? `${input.replace(/("|')/g, "")} boost-exact:true`
    : `${input} boost-exact:false`;

  if (/^\?/.test(input)) {
    const inputNoQuestionMark = input.slice(1);
    const url = `https://www.npmjs.com/search?q=${inputNoQuestionMark}`;
    return console.log(
      JSON.stringify([
        {
          title: `Search npmjs.com for "${inputNoQuestionMark}"`,
          subtitle: url,
          url,
          quickLookURL: url
        }
      ])
    );
  }

  let data;
  const cachedOutput = cache.get(input);

  if (!cachedOutput) {
    data = await getJSON("https://api.npms.io/v2/search", {
      query: {
        q,
        size: 20
      }
    });
    cache.set(input, data, { maxAge: 604800000 });
  } else {
    data = cachedOutput;
  }

  const output = data.results
    .filter(result => result.package.name.length > 1)
    .map(result => {
      const pkg = result.package;
      const item = {
        title: pkg.name,
        subtitle: pkg.description,
        badge: pkg.publisher.username,
        action: "choice.sh",
        icon: "icon.png",
        url: pkg.links.repository || pkg.links.npm,
        npmUrl: pkg.links.npm,
        quickLookURL: pkg.links.repository && `${pkg.links.repository}#readme`
      };
      return item;
    });

  return console.log(JSON.stringify(output, null, " "));
})();
