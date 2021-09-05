// https://www.dropbox.com/developers/documentation/http/documentation

function runWithPaths(thePaths) {
  const { DBX_ACCESS_TOKEN } = File.readJSON(
    `${Action.supportPath}/config.json`
  );
  if (!DBX_ACCESS_TOKEN) {
    LaunchBar.displayNotification({ string: "Dropbox access token not found" });
    return;
  }
  const url =
    "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings";

  const requests = thePaths.map((thePath) => {
    const path = thePath.replace(/^.+?Dropbox/, "");
    return HTTP.createPostJSONRequest(url, {
      body: { path },
      bodyType: "application/json",
      resultType: "json",
      headerFields: {
        Authorization: `Bearer ${DBX_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
  });

  const links = HTTP.loadRequests(requests)
    .map((request) => {
      if (request.data && request.data.url) {
        return request.data.url;
      }
      if (
        request.data &&
        request.data.error &&
        request.data.error.shared_link_already_exists
      ) {
        return request.data.error.shared_link_already_exists.metadata.url;
      }
      if (request.error) return undefined;
    })
    .filter((x) => x);

  const errors = thePaths.length - links.length;
  const message = `${links.length} shared links copied to clipboard, ${errors} errors`;
  LaunchBar.displayNotification({ string: message });
  if (links.length > 0) {
    // LaunchBar.setClipboardString(links.join("\n"));
    LaunchBar.executeAppleScript(`set the clipboard to "${links.join("\n")}"`);
  }
}
