// LaunchBar Action Script

function runWithString(text) {
  return text.replace(/”|“|״/g, '"').replace(/‘|’|׳/g, "'");
}
