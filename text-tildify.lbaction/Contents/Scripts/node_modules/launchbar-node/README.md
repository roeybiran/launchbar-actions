# launchbar-node

A helper library for making [LaunchBar](https://www.obdev.at/products/launchbar/index.html) actions.

_Note: A heavy work in progress, things change and break incessantly._

## Features

- Aims to offer NodeJS bindings for the entire LaunchBar JavaScript API.
- Tries to be as syntactically similar as reasonably possible to LaunchBar's own JS API.
- Easy caching.
- Easy action config handling.

### Table of Contents

-   [hide][1]
-   [remainActive][2]
-   [hasKeyboardFocus][3]
-   [setClipboardString][4]
    -   [Parameters][5]
-   [clearClipboard][6]
-   [paste][7]
    -   [Parameters][8]
-   [performService][9]
    -   [Parameters][10]
-   [displayNotification][11]
    -   [Parameters][12]
-   [textAction][13]
    -   [Parameters][14]

## hide

hides LaunchBar.

## remainActive

keeps LaunchBar active.

## hasKeyboardFocus

Returns **[boolean][15]** true if LaunchBar has keyboard focus, otherwise false.

## setClipboardString

sets the clipboard's contents.

### Parameters

-   `text` **[String][16]** the text to copy to the clipboard.

## clearClipboard

Clears the clipboard's contents.

## paste

Paste text in the frontmost application.

### Parameters

-   `text`
-   `null-null` **[String][16]** text the text to paste.

## performService

Perform a macOS service (as seen System Preferences > Keyboard > Shortcuts).

### Parameters

-   `service` **[string][16]** the service to perform.
-   `argv` **[string][16]?** optional arguments to the service.

## displayNotification

Displays a message in Notification Center.

### Parameters

-   `options` **[Object][17]?**
    -   `options.text` **[string][16]?** the notification's body.
    -   `options.title` **[string][16]?** the notification's title.
    -   `options.subtitle` **[string][16]?** the notification's subtitle.
    -   `options.callbackUrl` **[string][16]?** URL opened if the user clicks on the notification.
    -   `options.afterDelay` **[number][18]?** Delay in seconds before the notification is shown.

## textAction

Boilerplate function for text-processing actions.

### Parameters

-   `textArguments`
-   `textProcessingFunction` **[function][19]** a function to run over each line. Should accept and return single argument -- a line of text.
-   `joiner` **[string][16]** the separator to join back the lines into a string. (optional, default `"\n"`)
-   `text` **([String][16] \| [Array][20])** a single string or an array of strings.

[1]: #hide

[2]: #remainactive

[3]: #haskeyboardfocus

[4]: #setclipboardstring

[5]: #parameters

[6]: #clearclipboard

[7]: #paste

[8]: #parameters-1

[9]: #performservice

[10]: #parameters-2

[11]: #displaynotification

[12]: #parameters-3

[13]: #textaction

[14]: #parameters-4

[15]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[16]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[17]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[18]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[19]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[20]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

## To Do

- Loud error handling with output directly LaunchBar.
- Tests.
- Documentation.

## Credits

- [alfy](https://github.com/sindresorhus/alfy/)
