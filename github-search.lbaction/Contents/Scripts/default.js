function runWithString(input) {
  if (/^\?/.test(input)) {
    const inputNoQuestionMark = input.slice(1);
    const url = `https://github.com/search?q=${inputNoQuestionMark}`;
    return [
      {
        title: `Search GitHub.com for "${inputNoQuestionMark}"`,
        subtitle: url,
        url,
        quickLookURL: url,
        actionRunsInBackground: true
      }
    ];
  }

  input = encodeURIComponent(input);
  let noQueryTitle = "Enter repository name";
  let quickLookURLSuffix = "#readme";
  let url = "https://api.github.com/search/";
  const icon = "font-awesome:fa-github-square";

  // prepend input with user: to search for users
  if (input.startsWith("usr:")) {
    input = input.replace("usr:", "");
    url += `users?q=${input}`;
    noQueryTitle = "Enter a user's name";
    quickLookURLSuffix = "";
  } else {
    url += `repositories?q=${input}&sort=stars&order=desc`;
  }

  if (input.length === 0) {
    return [
      {
        title: noQueryTitle,
        icon
      }
    ];
  }

  const results = HTTP.getJSON(url).data.items.map(item => {
    const itemURL = item.html_url;
    return {
      title: item.name || item.login,
      subtitle: item.description || "",
      url: itemURL,
      quickLookURL: `${itemURL}${quickLookURLSuffix}`,
      badge: (item.owner && item.owner.login) || "",
      children: [{ title: itemURL }],
      icon
    };
  });

  if (results.length === 0) {
    return [{ title: "No results", icon }];
  } else {
    return results;
  }
}
