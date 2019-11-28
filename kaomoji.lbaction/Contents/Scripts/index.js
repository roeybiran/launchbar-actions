"use strict";

const cache = require("@roeybiran/launchbar-cache");
const getJSON = require("@roeybiran/launchbar-get-json");

(async () => {
  const input = process.argv[2] || process.exit();

  let items = [];
  const cachedInput = cache.get(input, { ignoreMaxAge: true });

  if (cachedInput) {
    items = cachedInput;
  } else {
    const url = "customer.getdango.com/dango/api/query/kaomoji";
    const data = await getJSON(url, {
      query: {
        q: input
      }
    });
    items = data.items;
    cache.set(input, items, { maxAge: 5000 });
  }

  const output = items.map(item => ({
    title: item.text,
    icon: "icon.png",
    action: "choice.sh",
    actionArgument: item.text,
    actionRunsInBackground: true,
    actionReturnsItems: false
  }));
  return console.log(JSON.stringify(output));
})();
