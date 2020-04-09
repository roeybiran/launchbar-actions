#!/usr/bin/env node

const convert = require("convert-units");

const unitsList = [];
convert()
  .possibilities()
  .forEach(a => {
    const props = convert().describe(a);
    const arr = [props.abbr, props.singular, props.plural];
    unitsList.push(...arr);
  });

console.log(unitsList);
