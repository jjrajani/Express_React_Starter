// server/app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// Always return the main index.html, so react-router render the route in the client
app.get('/:page', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

var USERS = [
  {id: 0, username: "", password: "", role: "", loggedIn: false},
  {id: 1, username: "humdrum", password: "humdrum", role: "admin", loggedIn: false},
]

// Get a list of users
let compileUsers = function (req, res, next) {
  let users = USERS.map((user) => {
    return {
      username: user.username
    }
  }).slice(1, USERS.length);
  res.body = { users }
  next();
}
app.get('/api/users', compileUsers, function (req, res) {
  console.log("GET USERS LIST", res.body);
  res.status(200).json(res.body);
});

// Get a single user
var authorize = function (req, res, next) {
  console.log("Authorizing: ", req.headers);
  var authed = false;
  var index;
  USERS.forEach((user, i) => {
    if (user.username === req.headers.username
    && user.password === req.headers.password) {
      authed = true;
      index = i;
    }
  });
  if (authed) {
    var user = USERS[index]
    res.body = { user };
    next();
  } else {
    res.status(422).json("Invalid username password combination");
  }
  console.log("authed", authed)
  next();
}
app.get('/api/user/:name', authorize, (req, res) => {
  console.log("GET.res.body", res.body);
  res.status(200).json({
    username: res.body.user.username,
    loggedIn: true,
  });
});

// Create a user
var validate = function (req, res, next) {
  console.log("REQ", req.body)
  let valid = true;
  USERS.forEach((user) => {
    if (user.username === req.body.username) {
      valid = false;
    }
  });
  if (valid) {
    next();
  } else {
    res.status(422).json("Username already exists");
}
var addUser = function(req, res, next) {
  let user = req.body;
  user.id = USERS.length;
  user.role = req.body.role ? req.body.role : "user";
  user.loggedIn = true;
  USERS.push(user);
  next();
}
app.post('/api/user', validate, addUser, (req, res) => {
  res.status(200).json({
    username: req.body.username,
    loggedIn: true,
  });
})

module.exports = app;
