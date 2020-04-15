"use strict";

const cache = require("@roeybiran/launchbar-cache");
const getJSON = require("@roeybiran/launchbar-get-json");
const conf = require("@roeybiran/launchbar-config");

// https://github.com/jeppestaerk/alfred-currency-conversion
// preferences
const currenciesList = [
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

const converter = async (amount, sourceCurrencyArg, targetCurrencyArg) => {
  // custom ordering/favorites
  const sourceCurrency = sourceCurrencyArg.toUpperCase();
  const targetCurrency = targetCurrencyArg.toUpperCase();
  let favoriteCurrencies = conf.get("favoriteCurrencies");
  if (!favoriteCurrencies) {
    favoriteCurrencies = ["ILS", "USD", "GBP", "EUR", "JPY", "CAD", "AUD"];
  }
  const baseCurrency = "ILS"; // could be any of the supported currencies

  const currencyList = Array.from(
    new Set(favoriteCurrencies.concat(currenciesList))
  );

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

  const output = [];

  currencyList.forEach(supportedCurrencyName => {
    if (supportedCurrencyName === sourceCurrency) {
      return;
    }
    if (targetCurrency) {
      if (targetCurrency !== supportedCurrencyName) {
        return;
      }
    }

    const sourceCurrencyRate = Number(rates[sourceCurrency]);
    const sourceCurrencyConvertedToBaseCurrency = amount / sourceCurrencyRate;
    const suppotedCurrencyRate = Number(rates[supportedCurrencyName]);
    const convertedCurrency =
      sourceCurrencyConvertedToBaseCurrency * suppotedCurrencyRate;

    // LaunchBar output
    output.push({
      title: `${convertedCurrency.toFixed(2)} ${supportedCurrencyName}`,
      subtitle: `Last updated ${lastUpdateDate} ${lastUpdateTime}`,
      icon: `${supportedCurrencyName}.png`,
      actionReturnsItems: false
    });
  });

  return output;
};

module.exports = {
  currenciesList,
  converter
};
