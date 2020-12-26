function runWithString(input) {
  if (!input) {
    return;
  }

  if (input.startsWith("?")) {
    return [
      {
        title: `Search IMDb for "${input.slice(1)}"`,
        url: `http://www.imdb.com/find?q=${input.slice(1)}`,
      },
    ];
  }

  const API_KEY = File.readJSON(`${Action.supportPath}/config.json`).API_KEY;
  if (!API_KEY) return [{ title: "Invalid API Key!" }];
  const response = HTTP.getJSON(
    `http://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(
      input
    )}&timeout=5000`
  ).data;
  if (!response.Title) {
    return [
      {
        title: "No results",
        subtitle: `Press ↩ to search for "${input}" in IMDb directly instead`,
        icon: "font-awesome:warning",
        url: `http://www.imdb.com/find?q=${input}`,
      },
    ];
  }
  return [
    {
      title: response.Title,
      subtitle: response.Plot,
      badge: `${response.Year}/${response.Country}`,
      url: `https://www.imdb.com/title/${response.imdbID}/`,
      icon: "font-awesome:fa-imdb",
    },
  ];
}
