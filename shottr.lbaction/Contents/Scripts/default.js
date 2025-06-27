function run() {
    const items = [
        {
            title: "Show",
            actionArgument: "show",
            subtitle: "Show Shottr"
        },
        {
            title: "Fullscreen",
            actionArgument: "grab/fullscreen",
            subtitle: "Takes a fullscreen screenshot"
        },
        {
            title: "Area",
            actionArgument: "grab/area",
            subtitle: "Takes an area screenshot"
        },
        {
            title: "Repeat",
            actionArgument: "grab/repeat",
            subtitle: "Repeats area screenshot in the same location"
        },
        {
            title: "Window",
            actionArgument: "grab/window",
            subtitle: "Takes a window screenshot"
        },
        {
            title: "Scrolling",
            actionArgument: "grab/scrolling",
            subtitle: "Takes a scrolling capture"
        },
        {
            title: "Reverse Scrolling",
            actionArgument: "grab/scrolling/reverse",
            subtitle: "Takes a reverse scrolling capture (scrolling up)"
        },
        {
            title: "Delayed",
            actionArgument: "grab/delayed",
            subtitle: "Takes a screenshot with a standard delay (3s)"
        },
        {
            title: "Custom Delayed",
            actionArgument: "grab/delayed=10",
            subtitle: "Takes a screenshot with a custom delay specified in seconds"
        },
        {
            title: "Append",
            actionArgument: "grab/append",
            subtitle: "Implements the \"Add Capture\" function"
        },
        {
            title: "OCR",
            actionArgument: "ocr",
            subtitle: "Initiates text recognition command"
        },
        {
            title: "Load Clipboard",
            actionArgument: "load/clipboard",
            subtitle: "Loads image from the clipboard"
        },
        {
            title: "Load File",
            actionArgument: "load/file",
            subtitle: "Opens up a file; the file cannot be passed as a url because Shottr is sandboxed, you have to pass it the file explicitly"
        },
        {
            title: "Uploads",
            actionArgument: "uploads",
            subtitle: "Opens a web page that allows you to review and manage your uploads to Shottr Cloud"
        },
        {
            title: "Settings",
            actionArgument: "settings",
            subtitle: "Opens up app preferences"
        }
    ];
    
    return items.map(item => ({
        ...item,
        action: "shottr",
        icon: "cc.ffitch.shottr"
    }));
}

function shottr(action) {
    LaunchBar.openURL(`shottr://${action}`);
}