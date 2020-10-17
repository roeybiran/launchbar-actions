// LaunchBar Action Script

function runWithString(theString) {
  if (!theString) {
    return;
  }
  if (theString.startsWith("?")) {
    const query = theString.slice(1);
    return {
      title: `Search MDN for ”${query}”...`,
      url: `https://developer.mozilla.org/en-US/search?q=${query}`,
      icon: "mdn.png"
    };
  }
  const response = HTTP.getJSON(
    `https://wiki.developer.mozilla.org/api/v1/search/en-US?q=${encodeURIComponent(
      theString
    )}`
  ).data.documents.map(value => {
    return {
      title: value.title,
      url: "https://developer.mozilla.org/en-US/" + value.slug,
      subtitle: value.excerpt.replace(/<\/?mark>/g, ""),
      icon: "mdn.png"
    };
  });
  return response.length > 0 ? response : "no results";
}
