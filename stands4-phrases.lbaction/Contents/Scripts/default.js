// https://www.phrases.com/phrases_api.php

function runWithString(input) {
  const { API_ID, API_TOKEN } = File.readJSON(
    `${Action.supportPath}/config.json`
  );
  if (!API_ID || !API_TOKEN) {
    return [{ title: "No STANDS4 API ID and/or API Token found" }];
  }
  // uid=1001&tokenid=tk324324&phrase=buckle+up&format=xml
  const { data, error, timedOut } = HTTP.getJSON(
    `https://www.stands4.com/services/v2/phrases.php?uid=${API_ID}&tokenid=${API_TOKEN}&phrase=${encodeURIComponent(
      input
    )}&format=json`,
    {
      resultType: "json",
    }
  );

  if (error) return [{ title: error }];

  let { result } = data;
  if (!Array.isArray(result)) {
    result = [result];
  }
  return result.map((x) => ({
    title: x.term,
    subtitle: x.explanation,
    badge: x.kind,
  }));
}
