// 186578/30
// 6219.266666666666
// (187065-358-129)/30
// 6219.266666666666

//for循环中的必须是promise否则循环结束了但是图片还没读取完毕 会导致求和异常
//way2

var sizeOf = require('image-size');
var fs=require('fs');
var personDirectory = "./person";
var personPromises = []

function geFileList(path)
{
   var filesList = [];
   readFile(path,filesList);
   return filesList;
}

//遍历读取文件
function readFile(path,filesList)
{
   files = fs.readdirSync(path);//需要用到同步读取
   files.forEach(walk);
   function walk(file)
   {
        states = fs.statSync(path+'/'+file);
        if(states.isDirectory())
        {
            readFile(path+'/'+file,filesList);
        }
        else
        {
            //创建一个对象保存信息
            var obj = new Object();
            obj.size = states.size;//文件大小，以字节为单位
            obj.name = file;//文件名
            obj.path = path+'/'+file; //文件绝对路径
            filesList.push(obj);
        }
    }
}

//写入文件utf-8格式
function writeFile(fileName, data) {
	fs.writeFile(fileName, data, 'utf-8', complete);
	function complete() {
		console.log("文件生成成功");
	}
}

var filesList = geFileList(personDirectory);
console.log('爬取图片总数', filesList.length)

filesList.sort(sortHandler);
function sortHandler(a, b) {
	if (a.size > b.size) return - 1;
	else if (a.size < b.size) return 1
	return 0;
}
var str = '';

for (var i = 0; i < filesList.length; i++) {
	var item = filesList[i];
	var desc = "文件名:" + item.name + "  " + "大小:" + (item.size / 1024).toFixed(2) + "/kb" + "  " + "路径:" + item.path;
	str += desc + "\n"
}

writeFile("文件信息汇总.txt", str);

function getPersonAll(){
  //变为异步报错？？？
  for(var i=0;i<=37;i++){
    personPromises.push(getSize('person/摇号客户名单公示'+i+'.png'))
  }
}

function getSize(fileName) {
    return new Promise(function(resolve,reject){
        sizeOf(fileName,function(error,dimensions){
            if(error) reject(error);
            resolve(dimensions.height);
        });
    });
}
getPersonAll()
console.time('耗时')
Promise.all(personPromises).then(function(promise) {
    var sum=0;
    promise.forEach((num)=>sum+=num)
    console.log("抓取图片的总共高度是",sum+'px');
    console.log("成功可以摇号的人数是",parseInt(sum/30)+'人');
    console.timeEnd('耗时')
});
