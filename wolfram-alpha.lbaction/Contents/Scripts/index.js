"use strict";

const conf = require("@roeybiran/launchbar-config");
const got = require("got");

class LaunchBarItem {
  constructor(title) {
    this.icon = "wolfram-alpha.png";
    this.actionReturnsItems = false;
    this.title = title;
  }
}
// https://products.wolframalpha.com/api/
// replace DEMO with your api key and run through launchbar at least once
// alternatively, edit config.json in the action's support directory
const key = conf.get("API_KEY");
if (!key) {
  conf.set("API_KEY", "DEMO");
}

const request = async (url, responseType, searchParams) => {
  try {
    const response = await got(url, {
      responseType,
      searchParams: {
        appid: key,
        ...searchParams
      }
    });
    return response.body;
  } catch (error) {
    console.log(
      JSON.stringify(new LaunchBarItem(`Error: ${error.response.body}`))
    );
    process.exit();
    return undefined;
  }
};

(async () => {
  let question = process.argv[2] || process.exit();
  const output = [];
  let answer;
  // short answers api
  if (!question.startsWith("full:")) {
    answer = await request("https://api.wolframalpha.com/v1/result", "text", {
      i: question
    });
    output.push(new LaunchBarItem(answer));
  } else {
    // full results api
    question = question.replace(/^full:/, "");
    answer = await request("http://api.wolframalpha.com/v2/query", "json", {
      input: question,
      format: "plaintext",
      output: "JSON"
    });
    answer.queryresult.pods.forEach(pod => {
      pod.subpods.forEach(subpod => {
        subpod.plaintext.split("\n").forEach(line => {
          output.push(new LaunchBarItem(line));
        });
      });
    });
  }
  console.log(JSON.stringify(output));
})();
