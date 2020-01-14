"use strict";

const path = require("path");

const cache = require("@roeybiran/launchbar-cache");
const getJSON = require("@roeybiran/launchbar-get-json");
const conf = require("@roeybiran/launchbar-config");

// https://github.com/jeppestaerk/alfred-currency-conversion

// preferences
const supportedCurrencies = [
  "AUD",
  "BGN",
  "BRL",
  "CAD",
  "CHF",
  "CNY",
  "CZK",
  "DKK",
  "EUR",
  "GBP",
  "HKD",
  "HRK",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "ISK",
  "JPY",
  "KRW",
  "MXN",
  "MYR",
  "NOK",
  "NZD",
  "PHP",
  "PLN",
  "RON",
  "RUB",
  "SEK",
  "SGD",
  "THB",
  "TRY",
  "USD",
  "ZAR"
];
// custom ordering/favorites
let favoriteCurrencies = conf.get("favoriteCurrencies");
if (!favoriteCurrencies) {
  favoriteCurrencies = ["ILS", "USD", "GBP", "EUR", "JPY", "CAD", "AUD"];
}
// could be any of the supported currencies
const baseCurrency = "ILS";

const currencyList = Array.from(
  new Set(favoriteCurrencies.concat(supportedCurrencies))
);

const input = process.argv[2] || process.exit();

const parsedInput = input
  .toUpperCase()
  .replace("NIS", "ILS")
  .replace(/,/g, "")
  .split(/([\d.]+|\w{3})/)
  .map(x => {
    return x.replace(/\s+/, "");
  })
  .filter(x => {
    return x !== "";
  });

// parse input
let amount;
let sourceCurrency;
let targetCurrency;
parsedInput.forEach(parsedInputElement => {
  if (Number(parsedInputElement)) {
    amount = Number(parsedInputElement);
  } else if (!sourceCurrency) {
    sourceCurrency = parsedInputElement;
  } else {
    targetCurrency = parsedInputElement;
  }
});

const printAndExit = msg => {
  console.log(
    JSON.stringify([{ title: msg, icon: "font-awesome:fa-info-circle" }])
  );
  process.exit();
};

if (!amount) {
  printAndExit("Specify amount");
} else if (!sourceCurrency) {
  printAndExit("Specify currency");
}
if (!currencyList.includes(sourceCurrency)) {
  printAndExit(`Unsupported currency: ${sourceCurrency}`);
}
if (targetCurrency && !currencyList.includes(targetCurrency)) {
  printAndExit(`Unsupported currency: ${targetCurrency}`);
}

(async () => {
  const output = [];

  // caching
  let rates = cache.get("rates");
  if (!rates) {
    rates = await getJSON(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
    );
    cache.set("rates", rates, { maxAge: 86400 * 1000 });
  }

  const timeStamp = Number(rates.time_last_updated) * 1000;
  const lastUpdateDate = new Date(timeStamp).toLocaleDateString();
  const lastUpdateTime = new Date(timeStamp).toLocaleTimeString();
  rates = rates.rates;

  currencyList.forEach(supportedCurrencyName => {
    if (supportedCurrencyName === sourceCurrency) {
      return;
    }
    if (targetCurrency && targetCurrency !== supportedCurrencyName) {
      return;
    }

    const sourceCurrencyRate = Number(rates[sourceCurrency]);
    const sourceCurrencyConvertedToBaseCurrency = amount / sourceCurrencyRate;
    const suppotedCurrencyRate = Number(rates[supportedCurrencyName]);
    const convertedCurrency =
      sourceCurrencyConvertedToBaseCurrency * suppotedCurrencyRate;
    output.push({
      title: `${convertedCurrency.toFixed(2)} ${supportedCurrencyName}`,
      subtitle: `Last updated ${lastUpdateDate} ${lastUpdateTime}`,
      icon: path.join(__dirname, `flags/${supportedCurrencyName}.png`),
      actionReturnsItems: false
    });
  });
  console.log(JSON.stringify(output));
})();
