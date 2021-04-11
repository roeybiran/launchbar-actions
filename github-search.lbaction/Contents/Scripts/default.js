function runWithString(input) {
  const icon = "font-awesome:fa-github-square";

  // https://docs.github.com/en/free-pro-team@latest/rest/reference/search#search-repositories

  const { API_KEY } = File.readJSON(`${Action.supportPath}/config.json`);

  if (/^\?/.test(input)) {
    input = input.slice(1);
    const url = `https://github.com/search?q=${input}`;
    return [
      {
        title: `Search GitHub.com for "${input}"`,
        subtitle: url,
        url,
        quickLookURL: url,
        actionRunsInBackground: true,
      },
    ];
  }

  if (input.length === 0) {
    return [
      {
        title: "Enter repository name",
        icon,
      },
    ];
  }

  input = encodeURIComponent(input);

  const { data } = HTTP.getJSON(
    `https://api.github.com/search/repositories?q=${input}&sort=stars&order=desc&per_page=10`,
    {
      headerFields: {
        authorization: API_KEY ? `token ${API_KEY}` : null,
      },
    }
  );

  if (data.message) {
    return [
      {
        title: data.message,
        subtitle: data.documentation_url,
        url: data.documentation_url,
        icon,
      },
    ];
  }

  if (data.items.length === 0) {
    return [{ title: "No results", icon }];
  }

  return data.items.map(item => {
    const itemURL = item.html_url;
    return {
      title: item.name,
      subtitle: item.description || "",
      url: itemURL,
      quickLookURL: `${itemURL}#readme`,
      badge: (item.owner && item.owner.login) || "",
      children: [{ title: itemURL }],
      icon,
    };
  });

  // LaunchBar.debugLog(JSON.stringify(results, null, 2));
}

// if (input.startsWith("usr:")) {
//   input = input.replace("usr:", "");
//   url += `users?q=${input}`;
//   noQueryTitle = "Enter a user's name";
//   quickLookURLSuffix = "";
// } else {
//   url += `repositories?q=${input}&sort=stars&order=desc`;
// }
