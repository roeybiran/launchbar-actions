// LaunchBar Action Script

include('abbreviateHomePath.js')
include('formatPathForOutput.js')
include('getCurrentDfxFolder.js')

// get current favorites
function getFavs() {
    var currentFavs = LaunchBar.executeAppleScriptFile('default-folder-x-get-favorites.scpt').trim().split('\n')
    return currentFavs
}

// remove a favorite
function removeFav (path) {
    LaunchBar.hide()
    // for each
    LaunchBar.executeAppleScriptFile('default-folder-x-remove-favorite.scpt', path)
}

// display favorite removal sub-menu
function displayRemovalMenu () {    
    var output = []
    var currentFavs = getFavs()
    currentFavs.forEach( function(fav) {
        fav = formatPathForOutput(fav)
        output.push({
            title: fav['name'],
            subtitle: fav['shortPosixPath'],
            path: fav['posixPath'],
            action: 'removeFav',
            actionArgument: fav['posixPath'],
            actionRunsInBackground: true,
            actionReturnsItems: false
        });
    });
    return output
}

// add a favorite
function addFav (path) {
    LaunchBar.hide()
    // for each
    LaunchBar.executeAppleScriptFile('default-folder-x-add-favorite.scpt', path)
}

// function to create a "new favorite" item
function addNewFavorite (path) {
    var path = formatPathForOutput(path)
    var newFavorite = {
        title: 'Add "' + path['name'] + '" to Favorites',
        subtitle: path['shortPosixPath'],
        icon: '/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/ToolbarFavoritesIcon.icns',
        action: 'addFav',
        actionArgument: path['posixPath'],
        actionRunsInBackground: false,
        actionReturnsItems: false
    }
    return newFavorite
}

function run(paths) {
    
    var output = []
    
    // get current favorites
    var currentFavs = getFavs()

    if (currentFavs != '') {
        
        // add the option to display the removal menu
        output.push({
            title: 'Remove a Favorite',
            icon: 'ToolbarDeleteTemplate.pdf',
            action: 'displayRemovalMenu',
            actionRunsInBackground: false,
            actionReturnsItems: true
        })

        // build menu from current favs
        currentFavs.forEach( function(fav) {
            fav = formatPathForOutput(fav)
            output.push({
                title: fav['name'],
                subtitle: fav['shortPosixPath'],
                path: fav['posixPath'],
                badge: 'Default Set'
            });
        });

    }

    // if file dialog is open and the current dialog folder is not already a favorite,
    // show the add to favorites options
    var currentDfxFolder = getCurrentDfxFolder()
    
    if (currentDfxFolder != '' && !currentFavs.includes(currentDfxFolder)) {
        // format current dfx folder for output
        output.push(addNewFavorite(currentDfxFolder))
    };

    if (paths != undefined) {
        paths.forEach( function(path) {
            if (!currentFavs.includes(path)) {
                output.push(addNewFavorite(path))
            }
        });
    };

    if (output.length == 0) {
        return {title: 'No Favorites', icon: 'font-awesome:fa-info'}
    } else {
        return output
    }
}

function runWithPaths(paths) {
    var output = run(paths)
    return output
};
