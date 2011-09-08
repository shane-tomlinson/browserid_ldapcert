#!/usr/bin/env node

/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla BrowserID.
 *
 * The Initial Developer of the Original Code is Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

"use strict";

var express = require("express"),
    MozillaLDAP = require("./lib/ldap_auth"),
    jwk = require("./lib/jwcrypto/jwk"),
    certifier = require("./lib/certificates");

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
  var username = body.username;
  var password = body.password;

  if (username && password) {
    MozillaLDAP.bind(username, password, function(err, creds) {
      var redirectTo = err ? "/" : "/authenticated";
      var httpCode = 301;

      req.session.warning = undefined;

      if (err) {
        req.session.warning = 'authentication';
        // XXX put an authorization denied
      }
      else {
        req.session.creds = creds;
      }

      res.redirect(redirectTo, httpCode);
    });
  }
  else {
    res.send("Not enough information provided", 401);
  }
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

function signOut(req, res, next) {
  req.session.creds = undefined;
  res.redirect("/");
}

app.get("/sign_out", signOut);
app.post("/sign_out", signOut);

app.post("/api/generate_cert", function(req, res, next) {
  var creds = req.session.creds;
  if (creds) {
    var email = creds.username;
    var pubkeyRaw = req.body && req.body.pubkey;
    var pubkey = jwk.PublicKey.deserialize(pubkeyRaw); 

    if (email && pubkey) {
      certifier.generateCertificate(email, pubkey, function(err, cert) {
        if (!err) {
          res.json({
            certificate: cert,
            update_url: "http://mozillaid.no.de/api/update_cert"
          });
        }
      });
    }
    else {
      res.send("Not enough information provided", 401);
    }
  }
  else {
    res.send("User must authenticate", 401);
  }
});

app.listen(PORT, function () {
  var address = app.address();
  var fullServerAddress = address.address + ":" + address.port;
  console.log("listening on " + fullServerAddress);
});
