"use strict";

const cp = require("child_process");
const chrono = require("chrono-node");

const input = process.argv[2] || process.exit();

const referenceDate = new Date();
const parsed = chrono.parse(input, referenceDate, { forwardDate: true })[0];

if (!parsed) {
  console.log("Invalid input");
  process.exit();
}
const reminderTitle = input.replace(parsed.text, "").trim();
const startDate = parsed.start.date();

const locale = cp
  .execFileSync("/usr/bin/defaults", ["read", "-g", "AppleLocale"], {
    encoding: "utf8"
  })
  .trim()
  .replace("_", "-");

const dateString = startDate.toLocaleDateString([locale], {
  weekday: "long",
  day: "numeric",
  month: "short"
});
const timeString = startDate.toLocaleTimeString([locale], {
  hour: "2-digit",
  minute: "2-digit"
});

const year = startDate.getFullYear();
const month = startDate.getMonth() + 1;
const day = startDate.getDate();
const hours = startDate.getHours();
const minutes = startDate.getMinutes();
const secondsSinceMidnight = hours * 60 * 60 + minutes * 60;

const output = {
  title: `“${reminderTitle}”`,
  name: reminderTitle,
  subtitle: `${timeString}, ${dateString}`,
  year,
  month,
  day,
  secondsSinceMidnight,
  action: "choice.sh",
  icon: "com.apple.reminders"
};

console.log(JSON.stringify(output));
