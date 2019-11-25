// LaunchBar Action Script

function runWithString(strings) {
    var output = [];
    strings.split('\n').forEach(element => {
        output.push({
            path: element
        })
    });
    return output
}
