// LaunchBar Action Script

include('dissect-path.js')

function runWithPaths(paths) {
	var keynoteList = []
	var pagesList = []
	var numbersList = []

	paths.forEach( function(element) {

		var obj = dissectPath(element)
		var ext = obj['ext']
		var name = obj['name']
		var dir = obj['dir']
		var savePath = dir + '/' + name + '.pdf'
 
		if (ext == 'doc' || ext == 'docx') {
			pagesList.push({origPath: element, savePath: savePath})
		} else if (ext == 'ppt' || ext == 'pptx') {
			keynoteList.push(element)
		} else if (ext == 'xls' || ext == 'xlsx') {
			numbersList.push(element)
		} else {
			LaunchBar.debugLog(ext)
			// do shell script "/usr/bin/mdls -name kMDItemContentTypeTree -raw " & POSIX path of source_path & " | grep --silent \"public.image\" && /usr/bin/sips -s format pdf " & POSIX path of source_path & " --out " & POSIX path of save_path
		}
			
	});
		pagesList.forEach( function(element) {
			// LaunchBar.alert(element['origPath'].toString())
			// LaunchBar.alert(element['savePath'].toString())
			LaunchBar.executeAppleScriptFile('pagesConvert.scpt', element['origPath'], element['savePath'])
		});
};
