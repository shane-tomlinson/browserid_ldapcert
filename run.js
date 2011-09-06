#!/usr/bin/env node

var MozillaLDAP = require("./auth");
var credentials = require("./credentials");

MozillaLDAP.bind(credentials.username, credentials.password, function(err) {
  console.log(err || 'successfully authenticated');  
});



