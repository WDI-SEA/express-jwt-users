var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var secret = "mysupersecretpassword";
var router = express.Router();

//LOGIN - An endpoint to generate tokens
router.post('/', function(req, res) {
  // The authenticated function in the user model checks that a user's
  // credentials are right using bcrypt.
  // collect any information we want to include in the token, like that user's info
  User.findOne({email: req.body.email}, function(err, user) {
    if (err || !user) return res.send({message: 'User not found'});
    user.authenticated(req.body.password, function(err, result) {
      if (err || !result) return res.send({message: 'User not authenticated'});

      // make a token & send it as JSON
      var token = jwt.sign(user, secret);
      res.send({user: user, token: token});
    });
  });
});

module.exports = router;
