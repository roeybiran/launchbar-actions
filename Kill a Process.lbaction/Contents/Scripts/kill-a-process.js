// LaunchBar Action Script

function killProc(argument) {
	LaunchBar.hide()
	LaunchBar.execute('/usr/bin/killall', '-9', argument)
}
function run() {

    var output = []
    // show processes from all users
    // show processes by name, omit full path
    // show cpu usage
    // don't a print header line
    var processes = LaunchBar.execute('/bin/ps', 'rcAo', 'command=').trim()
    processes = processes.split('\n')

    
    // split each line on the first space from the end
    // var re = /\s(?=\S+$)/

    processes.forEach( function(element, index) {
    
        output.push({
                title: element,
                // subtitle: 'CPU: ' + cpu + '%',
                icon: 'com.apple.ActivityMonitor',
                action: 'killProc',
                actionArgument: element,
                actionRunsInBackground: true,
                actionReturnsItems: false
                });
    });
    

        // _process = processes[i].split(re)
        // the split creates trailing whitespace after the proc's name, we'll trim it
        // procName = _process[0].trim()
        // cpu = _process[1]
            return output
    }
	
	