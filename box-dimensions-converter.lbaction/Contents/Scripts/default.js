function runWithString(input) {
  let multiplier;
  let targetUnitString;

  // get the amounts out
  let amounts = [...input.matchAll(/\d+(\.\d+)*/g)];

  const separators = [...input.matchAll(/(\*|x)/g)];
  if (separators.length < 1) {
    return "Provide at least 1 separator (x or *)";
  }

  if (amounts.length < 2) {
    return "Provide at least 2 numbers";
  }

  // determine if inches or cm
  const inputIsInches = input.match(/"|in((ch)?es)?/);
  const inputIsCentimeters = input.match(/cm|centimeters/);

  if (inputIsCentimeters) {
    multiplier = 0.39;
    targetUnitString = "inches";
  } else if (inputIsInches) {
    multiplier = 2.54;
    targetUnitString = "cm";
  } else {
    return "Invalid input";
  }

  amounts = amounts
    .map(amount => {
      return (parseFloat(amount) * multiplier).toFixed(2);
    })
    .join(" x ");

  return `${amounts} ${targetUnitString}`;
}
