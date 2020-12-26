// https://www.dropbox.com/developers/documentation/http/documentation

function runWithString(input) {
  const { DBX_ACCESS_TOKEN } = File.readJSON(
    `${Action.supportPath}/config.json`
  );

  if (!DBX_ACCESS_TOKEN) {
    return [
      {
        title: "Dropbox access token not found",
        icon: "font-awesome:fa-warning",
      },
    ];
  }

  const url = "https://api.dropboxapi.com/2/files/search_v2";
  const response = HTTP.postJSON(url, {
    body: {
      query: input,
    },
    headerFields: {
      Authorization: `Bearer ${DBX_ACCESS_TOKEN}`,
    },
    resultType: "json",
  });

  if (!response.data) {
    return [{ title: response.errror }];
  }

  return response.data.matches.map((x) => {
    const { metadata } = x.metadata;
    const { name } = metadata;
    const { path_display } = metadata;
    const url = `https://www.dropbox.com/home${encodeURIComponent(metadata.path_lower)}`;
    return {
      title: name,
      subtitle: path_display,
      icon: "font-awesome:fa-dropbox",
      url,
      actionArgument: metadata.path_lower,
    };
  });
}
