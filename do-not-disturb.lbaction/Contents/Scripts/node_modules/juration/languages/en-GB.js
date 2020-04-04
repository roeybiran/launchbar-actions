(function() {
  var juration;
  if (typeof require !== "undefined") juration = require("juration");
  else juration = window.juration;

  if (juration && juration.UNITS) {
    juration.UNITS.seconds.patterns = ["millisecond", "msec", "ms"];
    juration.UNITS.seconds.patterns = ["second", "sec", "s"];
    juration.UNITS.minutes.patterns = ["minute", "min", "m(?!s)"];
    juration.UNITS.hours.patterns = ["hour", "hr", "h"];
    juration.UNITS.days.patterns = ["day", "dy", "d"];
    juration.UNITS.weeks.patterns = ["week", "wk", "w"];
    juration.UNITS.months.patterns = ["month", "mon", "mo", "mth"];
    juration.UNITS.years.patterns = ["year", "yr", "y"];

    juration.UNITS.milliseconds.formats = {
      chrono: "",
      micro: "ms",
      short: "msec",
      long: "millisecond",
      plural: "milliseconds"
    };
    juration.UNITS.seconds.formats = {
      chrono: "",
      micro: "s",
      short: "sec",
      long: "second",
      plural: "seconds"
    };
    juration.UNITS.minutes.formats = {
      chrono: ":",
      micro: "m",
      short: "min",
      long: "minute",
      plural: "minutes"
    };
    juration.UNITS.hours.formats = {
      chrono: ":",
      micro: "h",
      short: "hr",
      long: "hour",
      plural: "hours"
    };
    juration.UNITS.days.formats = {
      chrono: ":",
      micro: "d",
      short: "day",
      long: "day",
      plural: "days"
    };
    juration.UNITS.weeks.formats = {
      chrono: ":",
      micro: "w",
      short: "wk",
      long: "week",
      plural: "weeks"
    };
    juration.UNITS.months.formats = {
      chrono: ":",
      micro: "m",
      short: "mth",
      long: "month",
      plural: "months"
    };
    juration.UNITS.years.formats = {
      chrono: ":",
      micro: "y",
      short: "yr",
      long: "year",
      plural: "years"
    };
  }
})();
