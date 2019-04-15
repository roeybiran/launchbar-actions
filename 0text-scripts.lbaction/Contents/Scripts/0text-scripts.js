// LaunchBar Action Script

function spinalCase(str) {
  return str.replace(/(?!^)([A-Z])/g, ' $1')
            .replace(/[_\s]+(?=[a-zA-Z])/g, '-').toLowerCase();
}

function runWithString(string) {

// --[a-z]+\s

	// get the mode
	var string = string.split(/(^--[a-z]+ )/)
	var mode = string[1]
	var string = string[2]

	var words = []
	// var mode = string.substring(0,7) // get the value of 'mode', which always the first 7 chars (--lower/--upper)
	// var string = string.substring(7) // remove the first 7 chars from the actual string

	var re = /(?=[A-Z])|\W|_/gm // split on capitals, but keep them

	string = string.split(re)
	

	if (mode == '--spinalcase ') {  //|| mode == '--screamingsnake ' || mode == '--snake ') {
		string.forEach( function(word) {
			word = word.toLowerCase()
			words.push(word)
		});
		words = words.join('-')
	} else if (mode == '--screamingsnake ') {
		string.forEach( function(word) {
			word = word.toUpperCase()
			words.push(word)
		});
		words = words.join('_')
	} else if (mode == '--snake ') {
		string.forEach( function(word) {
			word = word.toLowerCase()
			words.push(word)
		});
		words = words.join('_')
	} else if (mode == '--uppercamel ' || mode == '--lowercamel ') {

		string.forEach( function(word, wordIndex) {
		var word = word.split('') // break word into chars
		word.forEach( function(char, charIndex) {
			if (charIndex == 0) { // uppercase the first char
				char = char.toUpperCase()
			} else { // lowercase the rest
				char = char.toLowerCase()
			}	
			words.push(char)
		});
		});
		if (mode == '--lowercamel ') {
			words[0] = words[0].toLowerCase()
		}
		words = words.join('')
	}

	LaunchBar.performAction('0paste', words)

};