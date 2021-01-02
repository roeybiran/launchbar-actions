// https://products.wolframalpha.com/api/

function runWithString(input) {
  if (!input) return;
  const { API_KEY } = File.readJSON(`${Action.supportPath}/config.json`);
  if (!API_KEY) return [{ title: "Invalid API Key!" }];

  const url = `https://api.wolframalpha.com/v1/result?appid=${API_KEY}&i=${encodeURIComponent(
    input
  )}`;
  const response = HTTP.get(url);

  return [
    { title: response.error ?? response.data, icon: "wolfram-alpha.png" },
  ];
}
