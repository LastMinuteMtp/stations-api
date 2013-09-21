var express = require('express');
var rest = require('restler');
var mongoose = require ('mongoose');

var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/lm';

mongoose.connect('mongodb://localhost/lm');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Succeeded connected to: ' + uristring);
  mongoose.connection.db.collectionNames(function (err, names) {
    console.log(names);
  });
  Station.find({}).count(function (err, result) {
    console.log(result + ' stations in collection');
  });
});

var stationSchema = mongoose.Schema({
    ID: String,
    Name: String,
    City: String,
    CB: Boolean,
    Updated: {
      type: Date,
      default: Date.now
    },
    SlotsTotal : Number,
    BikesAvailable: Number,
    SlotsAvailable: Number,
    Coordinates: {
      type: [Number],
      index: '2d'
    }
});

var Station = mongoose.model('Station', stationSchema);

/*
{
  "ID": 1,
  "Name": "Gare Saint-Roch",
  "City": "Montpellier",
  "Lat": 43.605313,
  "Lng": 3.880934,
  "CB": 1,
  "SlotsTotal": 24,
  "BikesAvailable": 16,
  "SlotsAvailable": 8
},
LAT/LNG
43.61092/3.87723
**/
/**
 * Vélos au départ
    Idem à l'arrivée

    Stations selon coord + perim
    Dispos des places et vélos


    Station la plus proche qui a des places
    Station la plus proche qui a des place
 */

var app = express();

var retrieveAllStations = function (callback) {
  rest.get('http://192.168.1.148/Bikes/Stations', {parser: rest.parsers.json}).on('complete', callback);
};

app.get('/near/:lat/:lon', function (req, resp) {
  var loc = {$geometry :  {type : "Point" , coordinates: [parseFloat(req.params.lon), parseFloat(req.params.lat)]} };
  Station.find({Coordinates: {
    $near: [parseFloat(req.params.lon), parseFloat(req.params.lat)]
  }}).exec(function (error, stations) {
    if (error) {
      resp.send(error);
    }
    else {
      resp.send(stations);
    }
  });
});

app.get('/update', function (req, resp) {

  Station.remove({}, function(err) {
    if (err) {
      console.log('Error removing old data');
    }
    else {
      console.log('Removed old data')
    }
  });

  retrieveAllStations(function (stations) {
    var s;
    stations.forEach(function (e, i, array) {
      s = new Station({
        ID: e.ID,
        Name: e.Name,
        City: e.City,
        CB: e.CB === 1,
        SlotsTotal : e.SlotsTotal,
        BikesAvailable: e.BikesAvailable,
        SlotsAvailable: e.SlotsAvailable,
        Coordinates: [parseFloat(e.Lng), parseFloat(e.Lat)]
      });
      s.save(function (err, s) {
        if (err) {
          console.log(err);
        }
        else {
          console.log('Stored ' + s.ID);
        }
      });
    });
  });

  resp.send('Update started');
});

var port = process.env.PORT || 9000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

