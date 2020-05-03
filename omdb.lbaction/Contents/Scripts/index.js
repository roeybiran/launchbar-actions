"use strict";

const got = require("got");
const config = require("@roeybiran/launchbar-config");

(async () => {
  const API_KEY = config.get("API_KEY");
  if (!API_KEY) {
    console.log("Error: OMDb API key missing");
    process.exit();
  }
  let input = process.argv[2] || process.exit();
  let output;
  if (input.startsWith("?")) {
    input = input.slice(1);
    output = [
      {
        title: `Search IMDb for "${input}"`,
        url: `http://www.imdb.com/find?q=${input}`
      }
    ];
  } else {
    let response;
    try {
      const request = await got("http://www.omdbapi.com/", {
        responseType: "json",
        searchParams: {
          t: input,
          apikey: API_KEY,
          timeout: 5000
        }
      });
      response = request.body;
    } catch (error) {
      console.log(error);
      process.exit();
    }
    if (!response) {
      output = "No results";
    } else {
      output = [
        {
          title: response.Title,
          subtitle: response.Plot,
          badge: `${response.Year}/${response.Country}`,
          url: `https://www.imdb.com/title/${response.imdbID}/`,
          icon: "font-awesome:fa-imdb"
        }
      ];
    }
  }
  console.log(JSON.stringify(output));
})();
