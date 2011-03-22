var fs = require('fs'),
		sys = require('sys');

var fileFrom = process.argv[2],   // file with imports
		fileTo = process.argv[3],     // file for imports
		filesPath = process.argv[4];  // path to files directory

function getData(path) {
	var file = fs.openSync(path, "r+", 0644),
			styles = fs.readSync(file, 40000, null, 'utf8');

	return {styles: styles[0], file: file};
}

function toArray(text, re) {
	return text.split(re);
}


var data = getData(fileFrom),
		files_arr = toArray(data.styles, '\n'),
		files_import = [];

for (var i=0, l=files_arr.length; i<l; i++) {
	if (files_arr[i] != '' && !files_arr[i].search('@')) {
		var file = files_arr[i].replace('@import \'..\/', '').replace('\';', '');

		files_import.push(file);
	}
}

var file_write = fs.openSync(fileTo, 'a', 0644);

for (var j=0, len=files_import.length; j<len; j++) {
	var path = '../static/css/'+files_import[j],
			file_data = getData(path);

	fs.writeSync(file_write, file_data.styles+'\n', null, 'utf8');
	fs.closeSync(file_data.file);
}

fs.closeSync(data.file);
fs.closeSync(file_write);