// LaunchBar Action Script

function run(argument) {
    const obj = File.readPlist(`${LaunchBar.homeDirectory}/Library/Safari/Bookmarks.plist`).Children.filter(obj => obj.Title === "com.apple.ReadingList")[0].Children.map(obj => ({
        title: obj.URIDictionary.title,
        subtitle: obj.URLString,
        badge: "Reading List"
    }))
    return obj
}
