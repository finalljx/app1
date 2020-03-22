const fs = require('fs');
const {Transform} = require('stream');
const demoFile = 'test.txt';
const split2 = require('split2');


function statistics(chunk) {
  // 首先过滤出大小写字母,然后排序再整合再过滤出重复字母
  const firstStep = chunk.match(/[a-zA-Z]/g).sort().join('').match(/(\w)\1+/g)
  // 这样得到的结果应该是诸如这样的： ['aaaaa','bbb','ccc'.....]
  // 这样就很容易统计每个字母出现的个数了！
  return firstStep.map(item => {
    const res = { letter: item[0], length: item.length }
    return res
  })
}

class Middware extends Transform {
	constructor(options) {
		super(options);
	}
	_transform(data,encoding,done) {
		 console.log('in middleware: ', data);
		 const lines = data.toString().split('\n');
		 let index = 1;
		 while(lines.length) {

		 	const res = statistics(lines.shift());
		 	const result = {line: index, statistics: res };
		 	this.push(result);
		 	index++;
		 }
		 done();
	}
}

let result =[];
fs.createReadStream(demoFile, {highWaterMark:1000})
.on('error',()=>{console.log('read file error')})
.pipe(split2())
.pipe(new Middware({objectMode:true}))
.on('data', (data) => {
	console.log('transform data', data);
	result.push(data);
})
.on('finish',()=>{
	 console.log('finish event')
  console.log(result[0].statistics)
})
.on('end', () => {
  console.log('end event....')
})