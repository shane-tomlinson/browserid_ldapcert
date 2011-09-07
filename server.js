//#!/usr/bin/env node

var express = require("express");
//var connect = require("connect");
var MozillaLDAP = require("./auth");

var app = express.createServer();
var PORT = process.env.PORT || 80;

/*
app.use(
  connect.basicAuth(function(user, password, callback) {
  })

);
*/
app.use(express.bodyParser());
app.use(app.router);
app.use("/", express.errorHandler({ dump: true, stack: true }));

app.use(
  express.static(__dirname + "/static")
);

app.set("view options", {
  layout: true 
});

app.get("/", function(req, res, next) {
  res.render("index.ejs", {
    title: "You need to authenticate"
  });
});

app.post("/sign_in", function(req, res, next) {
  console.log(req.body);
  var body = req.body || {};
  var username = body.username || "";
  var password = body.password || "";

  MozillaLDAP.bind(username, password, function(err, creds) {
    var redirectTo = err ? "/" : "/authenticated";
    res.redirect(redirectTo, 301);
  });
});

app.get("/authenticated", function(req, res, next) {
  res.render("authenticated.ejs", {
    title: "Droppin' certs",
    username: "stomlinson@mozilla.com"
  });
});


app.post("/sign_out", function(req, res, next) {
  res.redirect("/");
});



app.listen(PORT, function () {
  var address = app.address();
  fullServerAddress = address.address + ":" + address.port;
  console.log("listening on " + fullServerAddress);
});
