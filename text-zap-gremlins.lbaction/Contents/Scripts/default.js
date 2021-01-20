// LaunchBar Action Script

// https://stackoverflow.com/a/24231346

// \u00a0 -- non breaking space
// \u200b -- zero width space
function runWithString(argument) {
  return {
    title: argument
      .replace(/\u200b+/g, "")
      .replace(/\u00a0/g, " ")
      .replace(/\t/g, "  "),
  };
}
