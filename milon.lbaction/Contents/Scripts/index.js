"use strict";

const sqlite3 = require("sqlite3");
const path = require("path");
const getJSON = require("@roeybiran/launchbar-get-json");

const input = process.argv[2] || process.exit();
const databasePath = path.join(__dirname, "milon.db");
let output;
let table = "hebrew";
let runMorfix;

// phase 2: morfix live/cached query
const morfix = async () => {
  const word = input;
  try {
    const sanitizedWord = word.replace(
      /[`~!@#$%^&*()_|+=?;:'",.<>{}[\]/\\]/gi,
      ""
    );
    const response = await getJSON(
      "http://services.morfix.com/translationhebrew/TranslationService/GetTranslation/",
      {
        maxAge: 604800000,
        body: {
          Query: sanitizedWord
        }
      }
    );
    const launchbarOutput = [];
    output = response;
    let translations = response.Words;
    if (output.ResultType === "NoResult") {
      const { Translate } = output.MachineTranslateResult;
      const { ServerBrand } = output.MachineTranslateResult;
      launchbarOutput.push({
        title: output.Query,
        subtitle: Translate,
        badge: ServerBrand
      });
      translations = output.Tokens.map(token => {
        return token.Words[0];
      });
    }

    if (output.Words.length === 0) {
      console.log("No results");
      process.exit();
    }

    translations.forEach(translation => {
      // console.log(translation);
      launchbarOutput.push({
        title: translation.InputLanguageMeanings[0]
          .map(x => {
            return x.DisplayText;
          })
          .join(),
        subtitle: translation.OutputLanguageMeaningsString,
        badge: translation.PartOfSpeech
      });
    });
    console.log(JSON.stringify(launchbarOutput, null, " "));
  } catch (error) {
    console.log(error);
  }
};

// phase 0: open a query in Morfix.co.il in advance
if (input.startsWith("?")) {
  const wordWithoutQuestionMark = input.substring(1);
  const url = `http://www.morfix.co.il/${wordWithoutQuestionMark}`;
  console.log(
    JSON.stringify([
      {
        title: `Search Morfix.co.il for "${wordWithoutQuestionMark}"`,
        subtitle: url,
        url
      }
    ])
  );
  process.exit();
}

// phase 1: querying the local database first
/*
    EXAMPLE OUTPUT
    term: 'בְּדִיקָה',
    termWithoutNiqqudOrDiacritics: 'בדיקה',
    translations: 'examination; check (noun); test (noun)',
    synonyms: '',
    samples: '',
    inflections: '',
    part_of_speech: null,
    id: 4480
*/
const databaseObject = new sqlite3.Database(
  databasePath,
  sqlite3.OPEN_READONLY
);

if (/[A-Za-z]/.test(input)) {
  table = "english";
}

databaseObject.all(
  `select * FROM ${table} WHERE termWithoutNiqqudOrDiacritics LIKE '${input}%'`,
  (err, rows) => {
    if (err) {
      output = err;
    } else if (rows.length === 0) {
      runMorfix = true;
    } else {
      output = rows.map(x => {
        return {
          title: x.translations,
          badge: x.term
        };
      });
    }
    databaseObject.close();
    if (runMorfix) {
      morfix();
    } else {
      console.log(JSON.stringify(output));
    }
  }
);
