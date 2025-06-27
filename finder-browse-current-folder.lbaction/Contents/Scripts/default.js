// LaunchBar Action Script

function run() {
    const path = LaunchBar.executeAppleScript('tell application "Finder" to POSIX path of (insertion location as alias)').trim();
    const contents = File.getDirectoryContents(path, { includeHidden: true });

    return contents
        .map((name) => ({
            path: `${path}/${name}`,
        }))
        .sort((a, b) => {
            const aIsDir = File.isDirectory(a.path);
            const bIsDir = File.isDirectory(b.path);
            
            if (aIsDir && !bIsDir) return -1;
            if (!aIsDir && bIsDir) return 1;
            return a.path.localeCompare(b.path);
        })
}
