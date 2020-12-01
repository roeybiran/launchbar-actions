function runWithString(input) {
  if (input.length === 0) return;

  if (/^\?/.test(input)) {
    const inputNoQuestionMark = input.slice(1);
    const url = `https://www.npmjs.com/search?q=${inputNoQuestionMark}`;
    return [
      {
        title: `Search npmjs.com for "${inputNoQuestionMark}"`,
        subtitle: url,
        url,
        quickLookURL: url
      }
    ];
  }

  // Do not boost exact matches by unless input is quoted
  const query = /^("|').+?('|$)/.test(input)
    ? `${input.replace(/("|')/g, "")} boost-exact:true`
    : `${input} boost-exact:false`;
  const url = `https://api.npms.io/v2/search?q=${encodeURIComponent(
    query
  )}&size=20`;
  return HTTP.getJSON(url)
    .data.results.filter(result => result.package.name.length > 1)
    .map(result => {
      const pkg = result.package;
      const item = {
        title: pkg.name,
        subtitle: pkg.description,
        badge: pkg.publisher.username,
        icon: "icon.png",
        url: pkg.links.repository || pkg.links.npm,
        npmUrl: pkg.links.npm,
        quickLookURL: pkg.links.repository && `${pkg.links.repository}#readme`
      };
      return item;
    });
}
