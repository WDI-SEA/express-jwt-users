var express = require('express');
var User = require('../models/user');
var router = express.Router();

//Find a user
router.get('/', function(req, res) {
  User.find(function(err, users) {
    if (err) return res.send({message: 'An error occurred when finding users'});

    res.send(users);
  });
});

//SIGN-UP: Create a user
router.post('/', function(req, res) {
  var user = new User(req.body);
  user.save(function(err) {
    if (err) return res.send({message: 'An error occurred when creating a user'});
    res.send(user);
  });
});

router.get('/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return res.send({message: 'No user found'});
    res.send(user);
  });
});

router.put('/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return res.send({message: 'No user found'});

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;

    user.save(function(err) {
      if (err) return res.send({message: 'Error occurred when editing the user'});
      res.send(user);
    });
  });
});

router.delete('/:id', function(req, res) {
  User.remove({_id: req.params.id}, function(err) {
    if (err) return res.send({message: 'No user found'});
    res.send({message: 'User deleted'});
  });
});

module.exports = router;
