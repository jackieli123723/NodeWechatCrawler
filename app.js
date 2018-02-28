const request = require("request-promise");
const cheerio = require('cheerio');
const cloudscraper = require('cloudscraper');
const fs = require('fs');
const Promise = require('bluebird')
const lodash = require('lodash')
const assert = require('assert')
const highland = require('highland')
const url = require('url');
const path = require('path')

//爬虫并且增加估算

//估算一个图片的高度

const https = require('https');
const sizeOf = require('image-size');
// const imgUrl = 'https://mmbiz.qpic.cn/mmbiz_png/oZ9vO0d4g2UtTxhksfxmZWACBzQ5zsTOuS0NtRJR27NCnWnpMl7sL8E9GYYYsGq3wEuBex43zunDticq44c5iaWQ/640?wx_fmt=png';
// const options = url.parse(imgUrl);
// https.get(options, function (response) {
//   var chunks = [];
//   response.on('data', function (chunk) {
//     chunks.push(chunk);
//   }).on('end', function() {
//     var buffer = Buffer.concat(chunks);
//     console.log(sizeOf(buffer));
//   });
// });
//
// function getImgTotalHeight(list){
//   var sum = 0;
//   for(var i=0;i<=list.length;i++){
//       var height = https.get(url.parse(list[i].imgUrl), function (response)) {
//       var chunks = [];
//       response.on('data', function (chunk) {
//         chunks.push(chunk);
//       }).on('end', function() {
//         var buffer = Buffer.concat(chunks);
//             sum += sizeOf(buffer).height
//         console.log('爬取图片真实高度：',sizeOf(buffer).height);
//       });
//     });
//   }
//   return sum
// }


request({
    url: 'https://mp.weixin.qq.com/s/IlzKQpYthrIxYIvYrdF58Q',
    json: false
}).then(body => {
    var $ = cheerio.load(body);

    function downloadFile (imgUrl, filename) {
        return request(imgUrl).pipe(fs.createWriteStream(path.resolve('person/'+filename+'.png')))
    }

    var list = []


    $('img[data-w=447]').each(function(index) {
        var imgUrl = $( this ).attr('data-src')
        var filename = '摇号客户名单公示'+index
        list.push({imgUrl, filename })
    })

    console.time('Downloads Complete.')
    return Promise.map(list, item => {
        console.log(JSON.stringify(item))
        return Promise.resolve(downloadFile(item.imgUrl, item.filename)).delay(250)
    }, {concurrency: 10}).finally(function(){
        console.timeEnd('Downloads Complete.')
    })

})
