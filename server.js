//#!/usr/bin/env node

var express = require("express");
var connect = require("connect");
var MozillaLDAP = require("./auth");

var app = express.createServer();

app.use(
  connect.basicAuth(function(user, password, callback) {
    MozillaLDAP.bind(user, password, function(err) {
 //     console.log(err || 'successfully authenticated: ' + user + '@mozilla.com');  
      if (callback) {
        callback(err, {
          username: user + '@mozilla.com' 
        });
      }
    });
  })

);

app.use(app.router);
app.use('/', express.errorHandler({ dump: true, stack: true }));

app.use(
  express.static(__dirname + '/static')
);

app.set('view options', {
  layout: false
});

app.get('/', function(req, res, next) {
  // req.remoteUser;
  res.render('index.ejs', {
    title: 'We give you certs!',
    username: req.remoteUser.username
  });
});


app.listen(8000);
