const split2 = require('split2');
const through2 = require('through2');
const fs = require('fs');

function parseCsv () {
	let headers = [];
	let isHeader = true;
	return through2.obj(function (data,enc,cb) {
		if (isHeader) {
			headers = data.toString().split(',');
			isHeader = false;
			return cb();
		}
		const entries = data.toString().split(',');
		const obj = {};
		headers.forEach((item, index) => {
			obj[item] = entries[index];
		})
		this.push(obj);
		return cb();

	});
}
const allData = [];
fs.createReadStream('test.csv')
.pipe(split2())
.pipe(parseCsv())
.on('data',(data) => {
	allData.push(data);
})
.on('error', (err) => {
	console.log('error',err);
})
.on('finish',()=>{
	console.log(allData);
})
