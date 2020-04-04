// Type definitions for Juration v0.1.0
// Project: https://github.com/framp/juration
// Definitions by: Mahi-Uddin Zihad <https://github.com/Mahi-Uddin>
// Definitions: https://github.com/Mahi-Uddin/juration

interface JurationFormats {
  chrono: string | null;
  micro: string;
  short: string;
  long: string;
  plural: string;
}

interface JurationUnit {
  patterns: string[];
  value: number;
  formats: JurationFormats;
}

interface JurationUnits {
  milliseconds: JurationUnit;
  seconds: JurationUnit;
  minutes: JurationUnit;
  hours: JurationUnit;
  days: JurationUnit;
  weeks: JurationUnit;
  months: JurationUnit;
  years: JurationUnit;
}

interface StringifyOptions {
  format?: "chrono" | "micro" | "short" | "long";
  units?: number;
}

interface Juration {
  UNITS: JurationUnits;
  setLanguage(language: string): void;
  parse(string: string): number;
  stringify(seconds: number, options?: StringifyOptions): string;
  humanize(seconds: number, options?: StringifyOptions): string;
}

declare var juration: Juration;

declare module "juration" {
  export = juration;
}
