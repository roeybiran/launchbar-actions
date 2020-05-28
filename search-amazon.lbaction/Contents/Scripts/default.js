function run()
{
    // No argument passed, just open the website:
    LaunchBar.openURL('http://www.amazon.com/');
}

function runWithString(argument)
{
    LaunchBar.openURL('http://www.amazon.com/s?ie=UTF8&index=blended&keywords=' + encodeURIComponent(argument));
}
