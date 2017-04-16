// server/app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
var PLACES = require("./places");
var LINKS = require("./links");
const cors = require('cors');
var fs = require('fs');

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "DELETE GET POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



// Always return the main index.html, so react-router render the route in the client
app.get('/:page', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

// PLACES ROUTES //

// Get the list of places
app.get('/api/places', (req, res) => {
  res.status(200)
     .json(PLACES.slice(1, PLACES.length)
     .sort((a, b) => {
       return a.desire > b.desire ? -1 : 1
     }));
});
// Create a place
var addPlace = function (req, res, next) {
  let place = req.body;
  place.id = PLACES.length;
  PLACES.push(place);
  fs.writeFile("/places", PLACES, function (err) {
    if(err) new Promise(function(resolve, reject) {
      return console.log(err)
    });
    console.log('file was saved')
  })
  res.body = place;
  next();
}
app.post('/api/places', addPlace, (req, res) => {
  res.status(200).json(res.body);
});
// Update a place
var updateUser = function(req, res, next) {
  PLACES[req.body.id] = req.body;
  res.body = PLACES[req.body.id];
  next();
}
app.post('/api/place/:id', updateUser, (req, res) => {
  res.status(202).json(res.body);
});
// Delete a place
var deletePlace = function(req, res, next) {
  let id = req.params.id;
  PLACES = PLACES.filter((place, i) => {
    if (+place.id !== +id) {
      if (place.id > id) {
        place.id = place.id - 1;
      }
      return place;
    }
  });
  next();
}
app.delete('/api/place/:id', deletePlace, (req, res) => {
  res.status(200).json("Delete Successful");
});

// Get the list of a places links
var getLinks = function(req, res, next) {
  let id = req.params.id;
  let links = [];
  LINKS.forEach((link, i) => {
    if (+link.placeId === +id) {
      links.push(link);
    }
  });
  res.body = links;
  next();
}
app.get('/api/place/:id/links', getLinks, (req, res) => {
  res.status(200).json(res.body);
});


// Add a link
var addLink = function(req, res, next) {
  let link = req.body;
  link.id = LINKS.length;
  link.placeId = req.params.id;
  LINKS.push(link);
  res.body = LINKS;
  next();
}
app.post('/api/place/:id/links', addLink, (req, res) => {
  res.status(200).json(res.body);
});

// Update Link
var updateLink = function(req, res, next) {
  let id = req.params.linkid;
  LINKS[id] = link;
  next();
}
app.post('/api/place/:id/link/:linkid', updateLink, getLinks, (req, res) => {
  res.status(200).json(res.body);
});





// USER ROUTES //

var USERS = [
  {id: 0, username: "", password: "", role: "", loggedIn: false},
  {id: 1, username: "humdrum", password: "humdrum", role: "admin", loggedIn: false},
]
// Get a List of Users
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
  console.log("PLACES", PLACES);
  res.status(200).json(res.body);
});

// Get a Users
var exists = function (req, res, next) {
  var index;
  USERS.forEach((user, i) => {
    if (user.username.toLowerCase() === req.params.username.toLowerCase()) {
      index = i;
    }
  });
  if (index) {
    var user = USERS[index]
    res.body = { user };
    next();
  } else {
    res.status(422).json("User does not exist");
  }
}
app.get('/api/user/:username', exists, (req, res) => {
  res.status(200).json({
    username: res.body.user.username
  });
});

// Create a user
var nonExists = function (req, res, next) {
  let valid = true;
  USERS.forEach((user) => {
    if (user.username === req.body.username) {
      valid = false;
    }
  });
  if (valid) {
    next();
  } else {
    USERS.forEach((user) => {
      if (user.password === req.body.password) {
        res.body = user;
        res.status(200).json({
          username: req.body.username,
          loggedIn: true,
        });
      } else {
        res.status(422).json("Password incorrect");
      }
    });
  }
}
var addUser = function(req, res, next) {
  console.log(req.body)
  let user = req.body;
  user.id = USERS.length;
  user.role = req.body.role ? req.body.role : "user";
  user.loggedIn = true;
  USERS.push(user);
  next();
}
app.post('/api/user', nonExists, addUser, (req, res) => {
  console.log(req.body)
  res.status(200).json({
    username: req.body.username,
    loggedIn: true,
  });
})

module.exports = app;
