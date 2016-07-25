var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var NodeCache = require('node-cache');
var Review = require('../models/Review');
var crawler = require('./crawler');
var moment = require('moment');


var reviewCache = new NodeCache();

var crawl = function(id, callback){
	if(!id){return;}

	var url = 'https://www.facebook.com/' + id + '/reviews';

	console.log("url: " + url);

	crawler.get(url, function(err, content, status){
		if(err){
			console.log('crawler.get ERROR: ', err);
			return;
		}
		if(status !== 200){
			console.log('crawler.get invalid status: ', status);
			return;
		}

		console.log('get content, start parse');
		callback(content);
	});
};


var CrawlHandler = {

	fetchRatings : function (bizId, callback) {
		crawl(bizId, function(content) {

			var $ = cheerio.load(content);

			var overallRating = $('._3-ma').text();

			var ratingDetail = $('div.mvm:nth-child(1)').text();

			var numReviews = $('div.mvm:nth-child(2)').text();


			var review = new Review(overallRating, ratingDetail, numReviews);


			callback(review);
		});
	},


	fetchReviews : function (bizId, callback) {

		crawl(bizId, function(content) {

			var $ = cheerio.load(content);

			var reviewContentWrapperDivs = $('div.userContentWrapper');
			console.log("number of reviews" + reviewContentWrapperDivs.length);
			var reviewList = [];
			reviewContentWrapperDivs.each(function (index) {
				console.log("review index: " + index);

				//get review rating
				var rating = $(this).find('i._51mq').text();

				//get review datetime
				var datetime = $(this).find('abbr:has(span)').attr('data-utime');

				//get review content
				var paragraphs = $(this).find('p');
				var reviewContent = '';
				paragraphs.each(function (index){
					reviewContent += $(this).text();
				});

				var review = new Review(datetime, rating, reviewContent);
				reviewList.push(review);
			});

			//reviewList.sort(function(x, y) {
			//	return x.datetime > y.datetime;
			//});

			CrawlHandler.refreshCache(bizId, reviewList);
			callback(reviewList);
		});
	},

	parseReviewFromText : function (bizId, callback) {
		var filePath = './pageContent.txt';

		fs.exists(filePath, function (exists) {
			if (exists) {
				fs.readFile(filePath, function (err, content) {
					if (err) return callback(err);

					var $ = cheerio.load(content);

					var reviewContentWrapperDiv = $('div.userContentWrapper');

					var reviewList = [];
					reviewContentWrapperDiv.each(function (index) {

						//get review rating
						var rating = $(this).find('i._51mq').text();

						//get review datetime
						var datetime = $(this).find('abbr:has(span)').attr('data-utime');

						//get review content
						var paragraphs = $(this).find('p');
						var reviewContent = '';
						paragraphs.each(function (index){
							reviewContent += $(this).text();
						});

						var review = new Review(datetime, rating, reviewContent);
						reviewList.push(review);
					});

					CrawlHandler.refreshCache(bizId, reviewList);
					callback(reviewList);
				});
			}
			else {
				console.log("error reading file");
				return 'error';
			}
		});
	},


	refreshCache : function(bizId, curReviewList) {

		reviewCache.get(bizId, function(err, prevReviewDatetimeList) {
			if (!err) {

				//if the data is not previously cached
				if (prevReviewDatetimeList == undefined) {
					var dateList = [];
					curReviewList.forEach(function(item) {

						dateList.push(item.datetime);
					});

					reviewCache.set(bizId, dateList);
					console.log('cache' + reviewCache.get(bizId))
				} else {
					console.log('business id already exist: ' + prevReviewDatetimeList);

					//compares the last element in the cur array (oldest comment)
					//with the latest element in the cache
					var i = curReviewList.length - 1;

					while (i >= 0) {

						var curEarliest = curReviewList[i].datetime;
						var prevLatest = prevReviewDatetimeList[0];

						console.log('curEarliest '+ i + ' ' + curEarliest);

						//console.log('prevLatest '+ prevLatest);

						if (curEarliest <= prevLatest) {
							console.log("comments are old, delete");
							curReviewList.pop();
							i--;
						} else {
							//if there are new comments, refresh cache.
							while (i >= 0) {
								prevReviewDatetimeList.pop();
								prevReviewDatetimeList.unshift(curReviewList[i--]);
							}
						}
					}

					//console.log(curReviewList);
				}
			}
		});
	}
}


module.exports = CrawlHandler
