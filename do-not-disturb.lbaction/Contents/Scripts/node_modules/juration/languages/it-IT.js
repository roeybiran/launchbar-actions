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
      long: "millisecondo",
      plural: "millisecondi"
    };
    juration.UNITS.seconds.formats = {
      chrono: "",
      micro: "s",
      short: "sec",
      long: "secondo",
      plural: "secondi"
    };
    juration.UNITS.minutes.formats = {
      chrono: ":",
      micro: "m",
      short: "min",
      long: "minuto",
      plural: "minuti"
    };
    juration.UNITS.hours.formats = {
      chrono: ":",
      micro: "h",
      short: "hr",
      long: "ora",
      plural: "ore"
    };
    juration.UNITS.days.formats = {
      chrono: ":",
      micro: "d",
      short: "day",
      long: "giorno",
      plural: "giorni"
    };
    juration.UNITS.weeks.formats = {
      chrono: ":",
      micro: "w",
      short: "wk",
      long: "settimana",
      plural: "settimane"
    };
    juration.UNITS.months.formats = {
      chrono: ":",
      micro: "m",
      short: "mth",
      long: "mese",
      plural: "mesi"
    };
    juration.UNITS.years.formats = {
      chrono: ":",
      micro: "y",
      short: "yr",
      long: "anno",
      plural: "anni"
    };
  }
})();
