var vows = require("vows"),
    MozillaLDAP = require("../auth"),
    assert = require("assert"),
    events = require("events");
    credentials = require("../credentials");

var validUsername = credentials.username;
var validPassword = credentials.password;

vows.describe("auth")
.addBatch({
  "authenticate valid": {
    topic: function() {
      MozillaLDAP.bind(validUsername, validPassword, this.callback);
    },    
    "valid login": function(err) {
      assert.ifError(err, "an error occurred authenticating a valid login");
    }
  }
})
.addBatch({
  "second authenticate valid": {
    topic: function() {
      MozillaLDAP.bind(validUsername, validPassword, this.callback);
    },    
    "valid login": function(err) {
      assert.ifError(err, "an error occurred authenticating a valid login");
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

