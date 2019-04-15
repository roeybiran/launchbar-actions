// LaunchBar Action Script

function runWithPaths(paths) {
    if (paths == undefined) {
        // Inform the user that there was no argument
    } else {
        // Array.prototype.map returns a new array by 
        // mapping each element in the existing array
        var paths = paths.map(function(path){
        // Wrap each element of the dates array with quotes
        return "'" + path + "'";
        }).join(" "); // Putsa comma in between every element
        // LaunchBar.alert(paths)
       LaunchBar.execute('~/Dropbox/dotfiles/scripts/imgur_uploads.sh', 'upload_file', paths);
    }
}
