"use strict";

const { DateTime } = require("luxon");
const fs = require("fs");
const path = require("path");
const conf = require("@roeybiran/launchbar-config");

// https://github.com/jaroslawhartman/TimeZones-Alfred
// https://stackoverflow.com/questions/10087819/convert-date-to-another-timezone-in-javascript

function sanitized(someString) {
  return someString.replace(/\W|_/g, "").toLowerCase();
}

let CITIES = conf.get("CITIES");
if (!CITIES) {
  CITIES = [
    { country: "Israel", city: "Tel Aviv" },
    { country: "United States", city: "New York" },
    { country: "Thailand", city: "Bangkok" },
    { country: "Philippines", city: "Manila" },
    { country: "Australia", city: "Brisbane" }
  ];
  conf.set("CITIES", CITIES);
}

const csvFile = path.join(__dirname, "GeoLite2-City-Locations-en.csv");
const csvContents = fs.readFileSync(csvFile, { encoding: "utf-8" });

const query = process.argv[2];
let filteredData = [];
const matchingCities = [];
const matchingCountries = [];

csvContents
  .split("\n")
  .map(row => {
    const splittedRow = row.split(",").map(x => {
      return x.replace(/"/g, "");
    });
    return {
      geonameId: splittedRow[0],
      localeCode: splittedRow[1],
      continentCode: splittedRow[2],
      continentName: splittedRow[3],
      countryIsoCode: splittedRow[4],
      countryName: splittedRow[5],
      subdivision1IsoCode: splittedRow[6],
      subdivision1Name: splittedRow[7],
      subdivision2IsoCode: splittedRow[8],
      subdivision2Name: splittedRow[9],
      cityName: splittedRow[10],
      metroCode: splittedRow[11],
      timeZone: splittedRow[12],
      isInEuropeanUnion: splittedRow[13]
    };
  })
  .slice(1)
  .forEach(row => {
    const obj = row;
    const storedCity = obj.cityName;
    const storedCountry = obj.countryName;
    if (!obj.cityName) {
      return;
    }
    const item = {
      cityName: storedCity,
      countryName: storedCountry,
      timeZone: obj.timeZone
    };
    const city = sanitized(storedCity);
    const country = sanitized(storedCountry);
    if (query) {
      const queryRegex = new RegExp(`^${sanitized(query)}`);
      if (city.match(queryRegex)) {
        if (query === city) {
          matchingCities.unshift(item); // boost exact matches for cities
        } else {
          matchingCities.push(item);
        }
      } else if (country.match(queryRegex)) {
        matchingCountries.push(item);
      }
    }
    CITIES.forEach(userSpecifciedCity => {
      if (
        sanitized(userSpecifciedCity.country) === country &&
        sanitized(userSpecifciedCity.city) === city
      ) {
        filteredData.push(item);
      }
    });
  });

// if no matching cities, show country matches
if (query) {
  if (matchingCities.length === 0) {
    filteredData = matchingCountries;
  } else {
    filteredData = matchingCities;
  }
}

filteredData = filteredData.map(x => {
  const localTime = DateTime.local();
  const remoteTime = localTime.setZone(x.timeZone);
  const remoteTimeString = remoteTime.toFormat("HH:mm");
  // TODO:
  let offset =
    Number(remoteTime.toFormat("Z")) + new Date().getTimezoneOffset() / 60;

  const localDay = localTime.day;
  const remoteDay = remoteTime.day;

  let dayDiff;
  if (localDay === remoteDay) {
    dayDiff = "Today";
  } else {
    const localEpoch = localTime.toMillis();
    const remoteEpoch = remoteTime.toMillis();
    if (localEpoch > remoteEpoch) {
      dayDiff = "Yesterday";
    } else {
      dayDiff = "Tomorrow";
    }
  }

  if (offset === 0 || offset > 0) {
    offset = `+${offset}HRS`;
  } else {
    offset = `${offset}HRS`;
  }
  return {
    title: `${x.cityName}, ${x.countryName}`,
    badge: remoteTimeString,
    subtitle: `${dayDiff}, ${offset}`,
    icon: path.join(
      __dirname,
      "flags",
      `${x.countryName.replace(/\s/g, "-").toLowerCase()}.png`
    )
  };
});

const seenCities = [];
const seenTimes = [];
const output = [];

// deduplication
// remove weird duplicate csv rows where the city, country and time are equal
for (let index = 0; index < filteredData.length; index += 1) {
  let add = true;
  const element = filteredData[index];
  const cityKey = element.title;
  const timeKey = element.badge;
  for (let j = 0; j < seenCities.length; j += 1) {
    if (seenCities[j] === cityKey && seenTimes[j] === timeKey) {
      add = false;
    }
  }
  if (add) {
    output.push(element);
  }
  seenCities.push(cityKey);
  seenTimes.push(timeKey);
}

console.log(JSON.stringify(output));
