// LaunchBar Action Script
// based on https://github.com/mlinzner/LaunchBarActions/tree/master/actions/Keyboard%20Maestro

function selectMacroGroup(argument) {
    LaunchBar.hide()
    LaunchBar.executeAppleScript('tell application "Keyboard Maestro"',
	'	select macro group id "' + argument + '"',
	'	activate',
	'end tell')
}

function selectMacro(argument) {
    LaunchBar.hide()
    var args = argument.split('\n')
    var macroGroupUid = args[0]
    var macroUid = args[1]
        LaunchBar.executeAppleScript(
        'tell application "Keyboard Maestro"',
        		'select macro group id "' + macroGroupUid + '"',
        		'select macro id "' + macroUid + '"',
        	'activate',
        'end tell');
}

function run() {
    var output = [];
    var macroGroupList = [];
    var macroList = [];
    var macroGroups = Plist.parse(LaunchBar.executeAppleScript('tell application id "com.stairways.keyboardmaestro.engine" to getmacros with asstring'));

    macroGroups.forEach( function(macroGroup) {
        macroGroupList.push({
            title: macroGroup.name,
            subtitle: 'Macro Group',
            icon: '/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericFolderIcon.icns',
            action: 'selectMacroGroup',
            actionArgument: macroGroup.uid,
            actionRunsInBackground: true,
            actionReturnsItems: false
        });
        var macros = macroGroup.macros
        macros.forEach( function(macro) {
            macroList.push({
                title: macro.name,
                subtitle: macroGroup.name,
                icon: 'com.stairways.keyboardmaestro.editor',
                action: 'selectMacro',
                actionArgument: macroGroup.uid + '\n' + macro.uid,
                actionRunsInBackground: true,
                actionReturnsItems: false
            });
            LaunchBar.log(macro.name)
        });
	});
    output = macroGroupList.concat(macroList)
    return output
}
