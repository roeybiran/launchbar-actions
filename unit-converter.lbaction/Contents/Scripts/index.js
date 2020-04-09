"use strict";

// https://github.com/ben-ng/convert-units

const units = require("./units");
const currencies = require("./currencies");

const allUnits = units.unitsList.map(x => {
  return x.toLowerCase();
});
const allCurrencies = currencies.currenciesList.map(x => {
  return x.toLowerCase();
});

const input = process.argv[2] || process.exit();

const parsedInput = input
  .toLowerCase()
  .replace("nis", "ils") // special override
  .split(/([\d.]+|[\w/]+)/)
  .filter(x => {
    return x.match(/\d|\w/);
  });

const amount = Number(parsedInput[0]);
const unit = parsedInput[1];
const targetUnit = parsedInput[2];

(async () => {
  let output;
  if (allUnits.includes(unit)) {
    output = units.converter(amount, unit);
  } else if (allCurrencies.includes(unit)) {
    output = await currencies.converter(amount, unit, targetUnit);
  } else {
    output = [{ title: `Unknown source unit: ${unit}` }];
  }
  console.log(JSON.stringify(output));
})();
