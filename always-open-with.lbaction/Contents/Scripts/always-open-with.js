// LaunchBar Action Script

// function setDutiFile(argument) {
//     var dutiFile = LaunchBar.executeAppleScriptFile('always-open-with-choose-file.scpt').trim()
//     dutiFile = File.pathForFileURL(dutiFile)
//     if (File.exists(dutiFile)) {
//         var plist = Action.supportPath + '/Preferences.plist'
//         var dutiFileKey = plist.dutiFilePath
//         var object = {'dutiFilePath':dutiFile}
//         File.writePlist(object, plist)
//         return [{
//             title: 'Path to duti file has been saved. Please run this action again'
//         }]
//     } else {
//         return [{
//             title: "Invalid choice",
//             icon: 'font-awesome:warning'
//         }]
//     }
// }

function getBundleId (app) {
	var re = /^kMDItemCFBundleIdentifier\s+= "(.+)"$/m; // regex to find the bundle id
    var bundleid = LaunchBar.execute('/usr/bin/mdls', app) // find the bundle id using `mdls`
    return bundleid.match(re)[1]
}

function extractIcon(path) {
        var plist = path + '/Contents/Info.plist'
        if (File.exists(plist)) {
            var icon = File.readPlist(plist)['CFBundleIconFile']
            if (!File.exists(path + '/Contents/Resources/' + icon)) {
                return path + '/Contents/Resources/' + icon + '.icns'
            }
        }
}

function registerUti(argument) {

    LaunchBar.hide()
    var appPath = argument['path']
    var uti = argument['uti']
    var dutiFile = argument['dutiFile']
    // var bundleid = getBundleId(appPath)
    var bundleid = 'foo'

    // LaunchBar.execute('/usr/local/bin/duti', '-s', bundleid, uti, 'all');
    str = 'Successfully registered "' + uti + '" with "' + bundleid + '"'
    LaunchBar.displayNotification({
        string: str.toString()
    })

    // register changes to a file
    // var dutiFileContents = (File.readText(dutiFile)) // the file's current contents
    // var text = bundleid + '\t' + uti + '\t' + 'all' // the new line to add. data is tab delimited. currently, 'role' defaults to "all"
    // File.writeText(dutiFileContents + text + '\n', dutiFile) // re-write the file with its current contents + the new data, finish with a newline
    // todo: remove duplicate lines
}

// pass files to lb
function runWithPaths(paths) {

	var output = []
    var utis = [];
    var addedText = ""
    // regex to find the uti, will be capture group 1
    var re = /^kMDItemContentType\s+=\s"(.+)"$/m
    
    // getting the file's 'kMDItemContentType', or extension
    paths.forEach( function(path) {
        uti = LaunchBar.execute('/usr/bin/mdls', path);
        uti = uti.match(re)
        // if 'kMDItemContentType' cannot be extracted, use extension instead
        if (uti == undefined) {
            uti = File.displayName(path)
            uti = uti.split('.')
            uti = uti[uti.length-1]
            addedText = ' extension ".' + uti + '"'
        } else {
            uti = uti[1] // the UTI is in capture group 1
            addedText = ' item type "' + uti + '"'
        }
        utis.push(uti)
    });
    
    // optional: record all UTI modifications to a file
    var dutiFile = Action.preferences.dutiFilePath
    if (dutiFile == undefined || !File.exists(dutiFile)) {
        output.push({
            title: 'No "duti" File Found',
            subtitle: 'Defaults will be changed, but will not be recorded',
            action: 'setDutiFile',
            path: Action.supportPath + '/Preferences.plist',
            icon: 'font-awesome:warning'
        })
    } else {
        output.push({
        title: 'Changes will be Recorded to a "duti" File',
        subtitle: dutiFile,
        path: dutiFile,
        icon: 'font-awesome:check'
        })
    }
    
    // choosing the target app to register the uti with:
    var apps = LaunchBar.execute('/usr/bin/mdfind', '-onlyin', '/Applications/',  "kMDItemContentType == 'com.apple.application-bundle'").trim().split('\n').sort() // returns a list of installed apps

    apps.forEach( function(app) {
        var icon = extractIcon(app) // get the app's icon
    	output.push({
    		title: File.displayName(app),
    		subtitle: 'Register' + addedText + ' with this app', // utis are stored in an array for future support of registering multiple uti types at once, right now, only a single uti (the first in the array) is acted upon
    		path: app,
            icon: icon,
    		action: 'registerUti',
            dutiFile: dutiFile,
            uti: utis[0],
            actionReturnsItems: false,
            actionRunsInBackground: true
	   })
    });
    return output
}
