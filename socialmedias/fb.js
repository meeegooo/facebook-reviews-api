var request = require('request');
var crawlhandler = require('./crawl/crawlhandler');


var fb = {
	findBusiness: function(bizId, callback){
		if(!bizId){
			return callback('Error: Empty bizId');
		}
		
		console.log("start fetching reviews: " );

		crawlhandler.fetchRatings(bizId, function(reviewList){
			return callback(null, reviewList);
		});
	}
};

module.exports = fb;