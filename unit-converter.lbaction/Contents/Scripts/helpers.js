"use strict";

const sanitized = word => {
  return word.toLowerCase().replace(/\W+|_/, "");
};

module.exports = {
  sanitized
};
