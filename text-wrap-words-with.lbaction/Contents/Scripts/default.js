function runWithString(input) {
  const asymmetricTokens = {
    "[": "]",
    "(": ")",
    "<": ">",
    "{": "}"
  };

  const startToken = LaunchBar.executeAppleScript(
    "try",
    'set theDialog to display dialog "Enter text to wrap with:" default answer ""',
    "return text returned of theDialog",
    "on error",
    "return",
    "end try"
  ).trim();

  if (!startToken) return;

  let endToken = startToken;

  if (asymmetricTokens[startToken]) {
    endToken = asymmetricTokens[startToken];
  }

  return input
    .split("\n")
    .filter(x => x)
    .map(line => {
      return line
        .split(/(\w+)/)
        .map(word => {
          if (/\w+/.test(word)) {
            word = `${startToken}${word}${endToken}`;
          }
          return word;
        })
        .join("");
    });
}
