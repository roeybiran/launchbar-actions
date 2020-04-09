"use strict";

const convert = require("convert-units");

const sanitized = word => {
  return word.toLowerCase().replace(/\W+/, "");
};

const unitsList = [];
convert()
  .possibilities()
  .forEach(a => {
    const props = convert().describe(a);
    const arr = [props.abbr, props.singular, props.plural];
    unitsList.push(...arr);
  });

const converter = (amount, inputUnit) => {
  const allUnits = convert().list();
  let baseUnit;
  let found;
  for (let i = 0; i < allUnits.length; i += 1) {
    const unit = allUnits[i];
    const props = [unit.abbr, unit.singular, unit.plural];
    for (let j = 0; j < props.length; j += 1) {
      if (sanitized(props[j]) === sanitized(inputUnit)) {
        baseUnit = allUnits[i].abbr;
        found = true;
        break;
      }
    }
    if (found) {
      break;
    }
  }

  // LaunchBar output
  return convert()
    .from(baseUnit)
    .possibilities()
    .map(x => {
      if (x !== baseUnit) {
        const convertedAmount = convert(amount).from(baseUnit).to(x).toFixed(2);
        return {
          title: `${convertedAmount} ${convert().describe(x).plural}`,
          icon: "font-awesome:fa-balance-scale"
        };
      }
      return undefined;
    });
};

module.exports = {
  unitsList,
  converter
};
