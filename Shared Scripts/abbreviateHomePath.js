// LaunchBar Action Script

function abbreviateHomePath(string) {
    var home = LaunchBar.homeDirectory
    var re = new RegExp("^" + home)
    var string = string.replace(re, "~")
    return string
}
