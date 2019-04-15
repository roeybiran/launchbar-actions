
const finderWindows = require('finder-windows')
const input = process.argv[2]
const curr = finderWindows.currentFinderWindow()
const fs = require('fs')

if (input == undefined || input == '') {
	console.log(JSON.stringify({title: 'Invalid input'}, null, '\t'))
	return
}

var files = input.split(':')
var items = []

files.forEach( function(element, index) {
	var re = /\//gm
	element = element.replace(re, ':')
	file = curr + element
	fs.writeFileSync(file, '')
	items.push({ 
		title: file,
		path: file
	})
});

console.log(JSON.stringify(items, null, '\t'))