var sizeOf = require('image-size');
var sum = 0
for(var i=0;i<=37;i++){
   sizeOf('person/摇号客户名单公示'+i+'.png', function (err, dimensions) {
    if(err){
      return
    }
    sum += dimensions.height
    console.log('总的摇中人数',sum)
  });
}


// 186578/30
// 6219.266666666666
// (187065-358-129)/30
// 6219.266666666666
