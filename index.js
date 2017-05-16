var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressJWT = require("express-jwt");
var jwt = require("jsonwebtoken");
var User = require("./models/user");
var secret = "xxxyyyzzz"
var app = express();

mongoose.connect('mongodb://localhost:27017/myauthenticatedusers');

app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/api/users', require('./controllers/users'));

//Middleware to check for tokens.
app.use("/api/users",
    expressJWT({ secret: secret }).unless({ method: "POST" }),
    require("./controllers/users")
);

//Error handler to handle unauthorized users gracefully - not ugly!
app.use(function(err, req, res, next) {
    //Catch unauthorized user errors, send status/message that is cleaner than default.
    if (err.name === "UnauthorizedError") {
        res.status(401).send({ message: "You need an authorization token to view this page." });
    }
});

//A route to generate tokens.
app.post("/api/auth", function(req, res) {
    //Find the user, check credentials
    //Select any info about the user that we want to include in the token's payload.
    User.findOne({ email: req.body.email }, function(err, user) {
        if (err || !user) {
            return res.send("User not found!");
        }
        user.authenticated(req.body.password, function(err, result) {
            if (err || !result) {
                return res.send("Innvalid Credentials");
            }
            //Yay, things are working. I'm ready to make the JWT!
            var token = jwt.sign(user, secret);
            //Now we have a token & need to send it back to the user in JSON format
            res.send({ user: user, token: token });
        });
    });
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.listen(3000);
