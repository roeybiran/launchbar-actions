"use strict";

const getJSON = require("@roeybiran/launchbar-get-json");

// https://github.com/turusuke/alfred-eslint-workflow

(async () => {
  const url =
    "https://bh4d9od16a-dsn.algolia.net/1/indexes/*/queries?x-algolia-api-key=891b0e977d96c762a3821e0c00172ac9&x-algolia-application-id=BH4D9OD16A&x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.24.7%3Bdocsearch.js%202.5.2";
  const inputText = process.argv[2] || process.exit();
  const data = await getJSON(url, {
    body: {
      requests: [
        { indexName: "eslint", params: `query=${inputText}&hitsPerPage=10` }
      ]
    }
  });
  const results = data.results[0].hits.map(result => {
    if (!result.hierarchy.lvl1) {
      return {
        title: result.hierarchy.lvl0,
        // title: result.anchor,
        url: result.url,
        icon: "icon.png"
      };
    }
    return undefined;
  });
  console.log(JSON.stringify(results));
})();
