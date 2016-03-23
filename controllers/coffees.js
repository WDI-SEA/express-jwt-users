var express = require('express');
var Coffee = require('../models/coffee.js');
var router = express.Router();

router.get('/', function(req, res){
	Coffee.find(function(err, coffees){
		if(err) return res.send({message: 'An error occured when finding coffees'});

		res.send(coffees);
	})
})

router.post('/', function(req, res){
	var coffee = new Coffee(req.body);
	coffee.save(function(err){
		if(err) return res.send({message: 'An error occurred when making coffee'});
		res.send(coffee);
	});
});

module.exports = router;