// server/app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
var PLACES = require("./places");
var LINKS = require("./links");
const cors = require('cors');
var fs = require('fs');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1989Felix',
  database : 'travel_locations'
});
connection.connect(function(err){
  if(!err) {
      console.log("Database is connected ... \n\n");
  } else {
      console.log("Error connecting database ... \n\n");
  }
});
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
  connection.query('SELECT * from place', function(err, rows, fields) {
    if (!err) {
      // console.log("ROWS", rows)
      res.status(200)
         .json(rows.sort((a, b) => {
           return a.title > b.title ? 1 : -1
         }));
    } else {
      console.log('Error while performing GET Places Query.', err);
      res.status(500).json("Something went wrong loading the database");
    }
  });
});
// Create a place - returns list of places
var addPlace = function (req, res, next) {
  connection.query("SELECT * FROM place", function(err, rows, fields) {
    if (!err) {
      req.body.id = rows.length;
      connection.query("INSERT INTO place SET ?", req.body, function(err, result) {
        if (!err) {
          rows.push(req.body);
          res.status(200)
             .json(rows.sort((a, b) => {
               return a.desire > b.desire ? -1 : 1
             }));
        } else {
          console.log('Error while getting adding place.', err);
          res.status(500).json("Something went wrong adding the place");
        }
      });
    } else {
      res.status(500).json("Could not get places to add place");
    }
  });

}
app.post('/api/places', addPlace, (req, res) => {
  // res.sent in addPlace
});
// Update a place - returns upated user
var updateUser = function(req, res, next) {
  var placeQuery = "UPDATE place set img =? , title =? , description =? , desire =?, WHERE id =?";
  connection.query(placeQuery,[
                      req.body.img,
                      req.body.title,
                      req.body.description,
                      req.body.desire,
                      req.body.id,
                    ], function(err, results) {
                      if(!err) {
                        console.log("Results", results)
                        res.status(200).json(req.body).end();
                      } else {
                        console.log('There was an error updating the place', err);
                        res.status(422).json("Place failed to update");
                      }
                    });
}
app.post('/api/place/:id', updateUser, (req, res) => {
  // res sent in updateUser;
});
// Delete a place - returns status message
var deletePlace = function(req, res, next) {
  var deleteQuery = "DELETE from place WHERE id = ?";
  let id = req.params.id;
  console.log(req.params);
  connection.query(deleteQuery, id, function(err, result) {
    if (!err) {
      console.log("Place deleted", result);
      res.status(200).json("Place deleted");
    } else {
      console.log("There was an error deleting the place", err);
      res.status(422).json("Place failed to delete");
    }
  });
  next();
}
app.delete('/api/place/:id', deletePlace, (req, res) => {
  // res sent in deletePlace();
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
// var addLink = function(req, res, next) {
//   let link = req.body;
//   link.id = LINKS.length;
//   link.placeId = req.params.id;
//   LINKS.push(link);
//   res.body = LINKS;
//   next();
// }
// app.post('/api/place/:id/links', addLink, (req, res) => {
//   res.status(200).json(res.body);
// });
//
// // Update Link
// var updateLink = function(req, res, next) {
//   let id = req.params.linkid;
//   LINKS[id] = link;
//   next();
// }
// app.post('/api/place/:id/link/:linkid', updateLink, getLinks, (req, res) => {
//   res.status(200).json(res.body);
// });

module.exports = app;
