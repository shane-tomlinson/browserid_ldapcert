//#!/usr/bin/env node

var express = require("express");
var MozillaLDAP = require("./auth");

var app = express.createServer();
var PORT = process.env.PORT || 80;

app.use(express.errorHandler({ dump: true, stack: true }));
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'Zimbra\'s markup is terrible' }));
app.use(app.router);
app.use(express.static(__dirname + "/static"));

app.set("view options", {
  layout: true 
});

app.get("/", function(req, res, next) {
  res.render("index.ejs", {
    title: "Zimbra Collaboration Suite Log In",
    warning: req.session.warning
  });
});


app.post("/sign_in", function(req, res, next) {
  console.log(req.body);
  var body = req.body || {};
  var username = body.username || "";
  var password = body.password || "";

  MozillaLDAP.bind(username, password, function(err, creds) {
    var redirectTo = err ? "/" : "/authenticated";
    req.session.warning = undefined;
    if (err) {
      req.session.warning = 'authentication';
    }
    else {
      req.session.creds = creds;
    }
    res.redirect(redirectTo, 301);
  });
});

app.get("/authenticated", function(req, res, next) {
  var creds = req.session.creds;
  if (creds) {
    res.render("authenticated.ejs", {
      title: "Droppin' certs",
      username: creds.username
    });
  }
  else {
    res.redirect('/');
  }
});


app.post("/sign_out", function(req, res, next) {
  req.session.creds = undefined;
  res.redirect("/");
});



app.listen(PORT, function () {
  var address = app.address();
  fullServerAddress = address.address + ":" + address.port;
  console.log("listening on " + fullServerAddress);
});
