// https://github.com/turusuke/alfred-eslint-workflow

function runWithString(input) {
  if (!input) return;
  const url =
    "https://bh4d9od16a-dsn.algolia.net/1/indexes/*/queries?x-algolia-api-key=891b0e977d96c762a3821e0c00172ac9&x-algolia-application-id=BH4D9OD16A&x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.24.7%3Bdocsearch.js%202.5.2";

  const response = HTTP.postJSON(url, {
    body: {
      requests: [
        { indexName: "eslint", params: `query=${input}&hitsPerPage=10` }
      ]
    },
    resultType: "json"
  });
  return response.data.results[0].hits.map(result => {
    if (!result.hierarchy.lvl1) {
      return {
        title: result.hierarchy.lvl0,
        subtitle: result.url,
        url: result.url,
        icon: "icon.png"
      };
    }
  });
}
