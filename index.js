var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var app = express();
var User = require("./models/user");

var secret = "mysupersecretpassword";

mongoose.connect('mongodb://localhost:27017/myauthenticatedusers');

app.use(bodyParser.urlencoded({extended:true}));

//Controllers
app.use('/api/auth', require('./controllers/auth'));

//Add middleware to look for the token. Luckily express-jwt has this built-in
app.use('/api/users', expressJWT({secret: secret}).unless({method: 'POST'}), require('./controllers/users'));
app.use(function (err, req, res, next) {
  // send an appropriate status code & JSON object saying there was an error, if there was one.
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({message: 'You need an authorization token to view this information.'})
  }
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.listen(process.env.PORT || 3000);
