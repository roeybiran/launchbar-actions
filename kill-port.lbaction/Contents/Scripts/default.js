// LaunchBar Action Script

// https://github.com/raycast/extensions/tree/8cc4bbbe9e3ff7b4d07cf5317af9e4a491d995ee/extensions/port-manager/
// https://github.com/raycast/extensions/blob/8cc4bbbe9e3ff7b4d07cf5317af9e4a491d995ee/extensions/port-manager/src/models/Process.ts#L44
// /usr/sbin/lsof +c0 -iTCP -w -sTCP:LISTEN -P -FpcRuLPn
// lsof -i -P -n | grep LISTEN

function run(argument) {
    if (argument == undefined) {
        // Inform the user that there was no argument
        LaunchBar.alert('No argument was passed to the action');
    } else {
        // Return a single item that describes the argument
        return [{ title: '1 argument passed'}, { title : argument }];
    }
}
