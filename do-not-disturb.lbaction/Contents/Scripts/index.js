"use strict";

const now = Date.now();
const hoursArguments = [1, 2, 4, 6, 8];

// uncomment when debugging
// hoursArguments.push(0.02);

const icon = "font-awesome:fa-moon-o";

const output = [];

hoursArguments.forEach(hour => {
  const durationAsMillisecs = hour * 60 * 60 * 1000;
  const newSecondsSinceEpoch = now + durationAsMillisecs;
  const newDate = new Date(newSecondsSinceEpoch);
  const hours = newDate.getHours();
  const minutes = newDate.getMinutes();
  const displayTime = [hours, minutes].map(x => {
    return x.toString().padStart(2, "0");
  });
  output.push({
    title: `Enable for ${hour} hour(s)`,
    subtitle: `Until ${displayTime[0]}:${displayTime[1]}`,
    hours,
    minutes
  });
});

output.push({
  title: "Toggle"
});

output.map(x => {
  const item = x;
  item.action = "choice.sh";
  item.icon = icon;
  return item;
});

console.log(JSON.stringify(output, null, " "));
