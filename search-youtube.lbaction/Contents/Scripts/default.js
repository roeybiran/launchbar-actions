// Copyright (c) 2014 Manuel Weiel
// http://manuel.weiel.eu/

// The 'run' function is called by LaunchBar when the user opens the action.
function run()
{
    // No argument passed, just open the website:
    LaunchBar.openURL('https://www.youtube.com/');
}

// The 'runWithString' function is called by LaunchBar when the user opens the action with a string argument.
function runWithString(argument)
{
    LaunchBar.openURL('https://www.youtube.com/results?search_query=' + encodeURIComponent(argument));
}
