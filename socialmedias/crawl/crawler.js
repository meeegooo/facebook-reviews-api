var http = require('http'),
    request = require('request'),
    phantom = require('phantom'),
    jquery = require('jquery');

var Crawler = function () {
};

function printArgs() {
    var i, ilen;
    for (i = 0, ilen = arguments.length; i < ilen; ++i) {
        console.log("    arguments[" + i + "] = " + JSON.stringify(arguments[i]));
    }
    console.log("");
}

Crawler.prototype.get = function (url, callback) {
    console.log("Entering Crawler.get");

    //var phantom = require('phantom');
    //phantom.create().then(function(ph) {
    //    ph.createPage().then(function(page) {
    //
    //        console.log('After creating page');
    //
    //        page.property('onLoadStarted', function() {
    //            console.log("page.onLoadStarted");
    //            printArgs.apply(this, arguments);
    //        });
    //
    //        page.property('onLoadFinished', function() {
    //            console.log("page.onLoadFinished");
    //            printArgs.apply(this, arguments);
    //        });
    //        page.property('onUrlChanged', function() {
    //            console.log("page.onUrlChanged");
    //            printArgs.apply(this, arguments);
    //        });
    //
    //        page.property('onConsoleMessage', function() {
    //            console.log("page.onConsoleMessage");
    //            console.log.apply(console, arguments);
    //        });
    //
    //        page.property('onResourceRequested', function() {
    //            console.log("page.onResourceRequested");
    //            printArgs.apply(this, arguments);
    //        });
    //
    //        page.property('onResourceReceived', function() {
    //            console.log("page.onResourceReceived");
    //            printArgs.apply(this, arguments);
    //        });
    //
    //        page.open(url)
    //            .then(function(status){
    //                console.log('after openning page ' + status);
    //
    //                //page.evaluate(function() {
    //                //    document.getElementById('u_0_3i');
    //                //
    //                //    var event = document.createEvent('MouseEvent');
    //                //    event.initEvent('click', true, true);
    //                //    button.dispatchEvent(event);
    //                //
    //                //}).then(function(){
    //                //
    //                //    console.log('after clicking is done');
    //                //
    //                //    page.property('content').then(function(pageContent){
    //                //        //console.log(pageContent);
    //                //        callback(null, pageContent, status);
    //                //        page.close();
    //                //        ph.exit();
    //                //    });
    //                //});
    //
    //
    //                try {
    //
    //                    var clickRecentPromise = page.evaluate(function () {
    //
    //                            //document.querySelector("ul[role='tablist'] li[class='_45hc'] a").click();
    //                            //console.log('clicked');
    //
    //                            var button = document.querySelector("ul[role='tablist'] li[class='_45hc'] a");
    //
    //                            var event = document.createEvent('MouseEvent');
    //                            event.initEvent('click', true, true);
    //                            button.dispatchEvent(event);
    //
    //                        }
    //                    );
    //
    //                    clickRecentPromise.then(function () {
    //
    //                            setTimeout(function() {
    //                                console.log('after clicking is done');
    //
    //                                page.property('content').then(function (pageContent) {
    //                                    console.log(pageContent);
    //                                    callback(null, pageContent, status);
    //                                    page.close();
    //                                    ph.exit();
    //                                });
    //                            }, 50000);
    //                        })
    //                        .catch(function(e) {
    //                            console.log(e);
    //                        })
    //
    //                }
    //                catch(error){
    //                    console.log(error);
    //                }
    //
    //
    //
    //                //console.log('after clicking');
    //                //
    //                //phantom.waitFor(function(){
    //                //   return page.evaluate(function(){
    //                //       console.log(document.getElementsByClassName('._468f')[0].getAttribute('aria-selected'));
    //                //       return document.getElementsByClassName('._468f')[0].getAttribute('aria-selected') === "true";
    //                //   })
    //                //});
    //
    //                //console.log('after clicking is done');
    //                //
    //                //
    //                //page.property('content').then(function(pageContent){
    //                //    console.log(pageContent);
    //                //    callback(null, pageContent, status);
    //                //    page.close();
    //                //    ph.exit();
    //                //});
    //
    //
    //            }, function(){
    //                console.error("")
    //            });
    //
    //
    //    });
    //});


    request({url:url, headers:{'User-Agent':'request'}}, function(err, response, body){
    	if(err) return callback(err);
    	if(!!response && response.statusCode === 200){
    		console.log("crawl succeed!");
    		callback(null, body, response.statusCode);
    	}
    	else{
    		return callback(new Error('Invalid status code for "' + url + '":' + response.statusCode));
    	}
    });
}

module.exports = new Crawler();