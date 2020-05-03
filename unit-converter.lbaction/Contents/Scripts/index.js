"use strict";

const units = require("./units");
const currencies = require("./currencies");
const { sanitized } = require("./helpers");

const allUnits = units.unitsList.map(x => {
  return sanitized(x);
});
const allCurrencies = currencies.currenciesList.map(x => {
  return sanitized(x);
});

const input = process.argv[2] || process.exit();

const parsedInput = input
  .toLowerCase()
  .split(/\s+/)
  .filter(x => {
    return !/^\s*$/.test(x) && !["to", "in"].includes(x);
  })
  .map(x => {
    return x.replace(/[/-]+/, "");
  });

if (parsedInput.length > 3 || parsedInput.length === 1) {
  console.log(`Couldn't parse input: ${parsedInput}`);
  process.exit();
}

const amount = Number(parsedInput[0]);
const unit = sanitized(parsedInput[1]);

let targetUnit;
if (parsedInput.length === 3) {
  targetUnit = parsedInput[2];
}

const allPossibilities = allUnits.concat(allCurrencies);

if (!allPossibilities.includes(unit)) {
  console.log(`Unknown source unit: ${unit}`);
  process.exit();
}

if (targetUnit && !allPossibilities.includes(targetUnit)) {
  console.log(`Unknown target unit: ${targetUnit}`);
  process.exit();
}

(async () => {
  let output;
  if (allUnits.includes(unit)) {
    output = units.converter(amount, unit, targetUnit);
  } else if (allCurrencies.includes(unit)) {
    output = await currencies.converter(amount, unit, targetUnit);
  }
  console.log(JSON.stringify(output));
})();
