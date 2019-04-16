// LaunchBar Action Script

include('abbreviateHomePath.js')

function formatPathForOutput(path) {
    var urlCheckRe = /^file:\/\/.+/ // check if path is url
    if (urlCheckRe.test(path)) {
        path = File.pathForFileURL(path)
    }
    var formattedPath = {
        'name': File.displayName(path),
        'posixPath': path,
        'shortPosixPath': abbreviateHomePath(path)
    }
    return formattedPath
}

