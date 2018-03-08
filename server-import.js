"use strict";
import request from 'request-promise'
import cheerio from 'cheerio'
import cloudscrer from'cloudscraper'
import fs from 'fs'
import Promise from 'bluebird'
import lodash from 'lodash'
import assert from 'assert'
import highland from 'highland'
import url from 'url'
import path from 'path'


if (!fs.existsSync('./天来汇景网上登记审核结果公示')) {
 fs.mkdir('./天来汇景网上登记审核结果公示');
 }


request({
    url: 'https://mp.weixin.qq.com/s/MUb2PWkGdHpAxBdkKWq_XQ',
    json: false
}).then(body => {
    var $ = cheerio.load(body);

    function downloadFile (imgUrl, filename) {
        return request(imgUrl).pipe(fs.createWriteStream(path.resolve('天来汇景网上登记审核结果公示/'+filename+'.png')))
    }

    var list = []


    $('img[data-type="jpeg"]').each(function(index) {
        var imgUrl = $( this ).attr('data-src')
        var filename = '天来汇景网上登记审核摇号客户名单公示'+index
        list.push({imgUrl, filename })
    })

    console.time('Downloads Complete.')
    return Promise.map(list, item => {
        console.log(JSON.stringify(item))
        return Promise.resolve(downloadFile(item.imgUrl, item.filename)).delay(5000)
    }, {concurrency: 1}).finally(function(){
        console.timeEnd('Downloads Complete.')
    })

})
