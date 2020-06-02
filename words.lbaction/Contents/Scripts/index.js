"use strict";

const got = require("got");
const config = require("@roeybiran/launchbar-config");

// https://www.definitions.net/definitions_api.php
// https://www.phrases.com/phrases_api.php
// https://www.synonyms.com/synonyms_api.php

const API_ID = config.get("API_ID");
const API_TOKEN = config.get("API_TOKEN");
if (!API_ID || !API_TOKEN) {
  console.log("No STANDS4 API ID and/or API Token found");
  process.exit();
}

const apirequest = async (url, param, query) => {
  try {
    const response = await got(url, {
      responseType: "json",
      searchParams: {
        uid: API_ID,
        tokenid: API_TOKEN,
        [param]: query,
        format: "json"
      }
    });
    return response.body.result;
  } catch (error) {
    console.log(error);
    process.exit();
    return undefined;
  }
};

(async () => {
  try {
    const query = process.argv[2] || process.exit();
    const requests = [
      {
        kind: "Phrases",
        url: "https://www.stands4.com/services/v2/phrases.php",
        param: "phrase"
      },
      {
        kind: "Definitions",
        url: "https://www.stands4.com/services/v2/defs.php",
        param: "word"
      },
      {
        kind: "Synonyms",
        url: "https://www.stands4.com/services/v2/syno.php",
        param: "word"
      },
      {
        kind: "Rhymes",
        url: "https://www.stands4.com/services/v2/rhymes.php",
        param: "word"
      }
    ];
    const kinds = [];
    const promises = [];
    requests.forEach(request => {
      kinds.push(request.kind);
      promises.push(apirequest(request.url, request.param, query));
    });

    const responsesWithKind = [];
    const resolvedPromises = await Promise.all(promises);
    for (let index = 0; index < resolvedPromises.length; index += 1) {
      let promise = resolvedPromises[index];
      if (promise) {
        if (!Array.isArray(promise)) {
          promise = [promise];
        }
        promise.map(obj => {
          obj.kind = kinds[index];
          return obj;
        });
        responsesWithKind.push(...promise);
      }
    }

    let output = [];
    responsesWithKind.forEach(x => {
      if (x.kind === "Phrases") {
        output.push({
          title: x.term,
          subtitle: x.explanation,
          badge: x.kind
        });
      }
      if (x.kind === "Synonyms") {
        const obj = [
          {
            title: x.term,
            subtitle: x.definition,
            label: `Synonyms: ${x.synonyms}`
          },
          {
            title: x.term,
            subtitle: x.definition,
            label: `Antonyms: ${x.antonyms}`
          }
        ];
        output.concat(obj);
      }
      if (x.kind === "Definitions") {
        let subtitle = "";
        if (Object.values(x.example).length === 0) {
          subtitle = x.definition;
        } else {
          subtitle = x.example;
        }
        output.push({
          title: x.term,
          subtitle,
          badge: x.kind
        });
      }
      if (x.kind === "Rhymes") {
        output.push({
          subtitle: "",
          title: x.rhymes,
          badge: x.kind
        });
      }
    });
    if (output.length === 0) {
      output = "No results";
    }
    console.log(JSON.stringify(output));
  } catch (error) {
    console.log(error);
  }
})();
