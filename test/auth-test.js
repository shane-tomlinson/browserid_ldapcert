var vows = require("vows"),
    MozillaLDAP = require("../auth"),
    assert = require("assert"),
    events = require("events");
    credentials = require("../credentials");

var username = credentials.username;
var usernameFull = credentials.usernameFull;
var password = credentials.password;

vows.describe("auth")
.addBatch({
  "authenticate with just username valid": {
    topic: function() {
      MozillaLDAP.bind(username, password, this.callback);
    },    

    "valid login": function(err, creds) {
      assert.ifError(err, "an error occurred authenticating a valid login");
    },

    "credentials are given to us": function(err, creds) {
      assert.ok(creds.username, 'A username is given to us');
      assert.ok(creds.username.indexOf('@') > -1, 'a full email address?');
      assert.ok(creds.password, 'A password is given to us');
    }
  }
})
.addBatch({
  "authenticate with username@mozilla.com valid": {
    topic: function() {
      MozillaLDAP.bind(usernameFull, password, this.callback);
    },    

    "valid login": function(err, creds) {
      assert.ifError(err, "an error occurred authenticating a valid login");
    },

    "credentials are given to us": function(err, creds) {
      assert.ok(creds.username, 'A username is given to us');
      assert.ok(creds.username.indexOf('@') > -1, 'a full email address?');
      assert.ok(creds.password, 'A password is given to us');
    }
  }
})
.addBatch({
  "authenticate invalid": {
    topic: function() {
      var promise = new events.EventEmitter();

      MozillaLDAP.bind("illegit", "badpass", function(err) {
        promise.emit("success", err);
      });

      return promise;
    },    
    "check return has error message": function(err) {
      assert.ok(err, "we indeed have an error");
    }
  },
})
.export(module);

