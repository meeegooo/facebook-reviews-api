var express = require('express');
var router = express.Router();
var fb = require('../socialmedias/fb');

router.get('/fb/reviews/:business_id', function(req, res) {
	if(!req.params.business_id){
		res.send({error: 'Empty business_id'});
		return;
	}

	fb.findBusiness(req.params.business_id, function(err, data){
		if(err){
			res.send({error: err});
		}
		else{
			res.json({reviews: data});
		}
	}); 	
});

module.exports = router;
